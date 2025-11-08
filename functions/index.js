const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Client, Environment } = require('square');

admin.initializeApp();
const db = admin.firestore();

// Initialize Square client
// Set environment variables in Firebase Functions config:
// firebase functions:config:set square.access_token="YOUR_TOKEN" square.location_id="YOUR_LOCATION"
const squareClient = new Client({
  accessToken: functions.config().square?.access_token || process.env.SQUARE_ACCESS_TOKEN,
  environment: functions.config().square?.environment === 'sandbox' ? Environment.Sandbox : Environment.Production
});

/**
 * Create a subscription via Square and grant premium access
 * POST body: { email, planId, sourceId, customerId? }
 */
exports.createSubscription = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, planId, sourceId, customerId } = req.body;

  if (!email || !planId || !sourceId) {
    res.status(400).json({ error: 'Missing required fields: email, planId, sourceId' });
    return;
  }

  try {
    const locationId = functions.config().square?.location_id || process.env.SQUARE_LOCATION_ID;

    // Create or use existing customer
    let finalCustomerId = customerId;
    if (!finalCustomerId) {
      const customerResponse = await squareClient.customersApi.createCustomer({
        emailAddress: email,
        referenceId: email,
      });
      finalCustomerId = customerResponse.result.customer.id;
    }

    // Create subscription
    const { result } = await squareClient.subscriptionsApi.createSubscription({
      locationId: locationId,
      planVariationId: planId,
      customerId: finalCustomerId,
      sourceId: sourceId,
    });

    const subscription = result.subscription;

    // Write entitlement to Firestore
    await db.collection('users').doc(email).set({
      entitlements: {
        premium: true
      },
      subscription: {
        id: subscription.id,
        status: subscription.status,
        platform: 'square',
        planId: planId,
        customerId: finalCustomerId,
        startDate: subscription.startDate || admin.firestore.FieldValue.serverTimestamp(),
        chargedThroughDate: subscription.chargedThroughDate || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }
    }, { merge: true });

    res.json({
      success: true,
      subscriptionId: subscription.id,
      status: subscription.status
    });

  } catch (error) {
    console.error('Subscription creation failed:', error);
    res.status(500).json({
      error: 'Failed to create subscription',
      message: error.message
    });
  }
});

/**
 * Handle Square webhook events (subscription updates, cancellations, etc.)
 * Configure this URL in Square Dashboard: https://your-project.cloudfunctions.net/handleSquareWebhook
 */
exports.handleSquareWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  try {
    const event = req.body;
    console.log('Square webhook received:', event.type);

    // Handle subscription events
    if (event.type === 'subscription.updated' || event.type === 'subscription.created') {
      const subscription = event.data?.object?.subscription;
      if (!subscription) {
        res.status(200).send('OK');
        return;
      }

      // Find user by customerId (stored in Firestore)
      const usersSnapshot = await db.collection('users')
        .where('subscription.customerId', '==', subscription.customerId)
        .limit(1)
        .get();

      if (usersSnapshot.empty) {
        console.warn('No user found for customerId:', subscription.customerId);
        res.status(200).send('OK');
        return;
      }

      const userDoc = usersSnapshot.docs[0];
      const isPremium = subscription.status === 'ACTIVE';

      await userDoc.ref.update({
        'entitlements.premium': isPremium,
        'subscription.status': subscription.status,
        'subscription.chargedThroughDate': subscription.chargedThroughDate || null,
        'subscription.updatedAt': admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Updated user ${userDoc.id} premium status: ${isPremium}`);
    }

    res.status(200).send('OK');

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal server error');
  }
});

/**
 * Manually grant premium access (for testing or customer support)
 * POST body: { email, expiresInDays? }
 */
exports.grantPremiumAccess = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, expiresInDays = 365 } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Missing email' });
    return;
  }

  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await db.collection('users').doc(email).set({
      entitlements: {
        premium: true
      },
      subscription: {
        status: 'ACTIVE',
        platform: 'manual',
        grantedAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
      }
    }, { merge: true });

    res.json({ success: true, message: `Premium access granted to ${email}` });

  } catch (error) {
    console.error('Grant premium error:', error);
    res.status(500).json({ error: 'Failed to grant access', message: error.message });
  }
});
