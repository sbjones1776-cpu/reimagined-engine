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
 * verifyPlayPurchase
 * Verifies a Google Play Billing purchase token using the Android Publisher API.
 * Expects functions config for service account credentials via GOOGLE_APPLICATION_CREDENTIALS
 * or embedded config. For security, prefer Workload Identity or env var on deploy.
 *
 * POST body: { token, productId, email }
 * Response: { success: true }
 */
exports.verifyPlayPurchase = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, productId, email } = req.body || {};
  if (!token || !productId || !email) {
    return res.status(400).json({ error: 'Missing token, productId, or email' });
  }

  try {
    // Lazy import to avoid cold start cost when unused
    const { google } = require('googleapis');

    // Configure auth
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/androidpublisher']
    });
    const authClient = await auth.getClient();
    const publisher = google.androidpublisher({ version: 'v3', auth: authClient });

    const packageName = functions.config().play?.package || process.env.PLAY_PACKAGE_NAME;
    if (!packageName) {
      throw new Error('Missing Play package name (functions.config().play.package or PLAY_PACKAGE_NAME)');
    }

    // For subscriptions, validate via purchases.subscriptionsv2 or purchases.subscriptions
    // Here we try Subscriptions v2 first; fallback to classic if needed.
    let valid = false;
    try {
      const { data } = await publisher.purchases.subscriptionsv2.get({
        packageName,
        token
      });
      const lineItems = data?.lineItems || [];
      const active = lineItems.some(li => (li?.expiryTime || 0) > Date.now());
      valid = active;
    } catch (e) {
      // Fallback to classic endpoint if v2 not enabled
      try {
        const { data } = await publisher.purchases.subscriptions.get({
          packageName,
          subscriptionId: productId,
          token
        });
        // Consider purchased if not canceled and expiry in future
        const expiry = Number(data?.expiryTimeMillis || 0);
        valid = expiry > Date.now();
      } catch (e2) {
        console.error('Play verification failed (classic):', e2?.message || e2);
        valid = false;
      }
    }

    if (!valid) {
      return res.status(400).json({ error: 'Invalid or expired purchase token' });
    }

    // Extract subscription tier from productId
    // Expected format: play_premium_player_monthly, play_family_teacher_yearly, etc.
    let subscriptionTier = null;
    const tierMatch = productId.match(/play_(.+?)_(monthly|yearly)$/);
    if (tierMatch) {
      subscriptionTier = tierMatch[1]; // e.g., "premium_player", "premium_parent", "family_teacher"
    }

    // Grant entitlement
    const updateData = {
      entitlements: { premium: true },
      subscription: {
        platform: 'googleplay',
        productId,
        status: 'ACTIVE',
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    };

    // Add subscription_tier if extracted successfully
    if (subscriptionTier) {
      updateData.subscription_tier = subscriptionTier;
    }

    await db.collection('users').doc(email).set(updateData, { merge: true });

    return res.json({ success: true });

  } catch (error) {
    console.error('verifyPlayPurchase error:', error);
    return res.status(500).json({ error: 'Verification error', message: error.message });
  }
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

/**
 * Scheduled function to check trial expirations and send notifications.
 * Runs daily via Cloud Scheduler (configure cron: 'every day 09:00').
 * Detects users with trial_expires_at nearing expiration (day 6, day 7, grace day 8)
 * and writes notification docs to Firestore 'notifications' collection.
 */
exports.checkTrialExpirations = functions.pubsub.schedule('every day 09:00').onRun(async (context) => {
  console.log('Trial expiration check started');
  const now = admin.firestore.Timestamp.now();
  const nowMs = now.toMillis();
  const oneDayMs = 24 * 60 * 60 * 1000;

  try {
    // Fetch all users with trial_start_date set and subscription_tier=free
    const snapshot = await db.collection('users')
      .where('trial_start_date', '!=', null)
      .where('subscription_tier', '==', 'free')
      .get();

    const notifications = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const email = doc.id;
      const expiresAt = data.trial_expires_at;
      if (!expiresAt) return;

      const expiresMs = expiresAt.toMillis();
      const timeLeft = expiresMs - nowMs;
      const daysLeft = Math.ceil(timeLeft / oneDayMs);

      // Day 6 warning (1 day left)
      if (daysLeft === 1 && !data.notif_day6_sent) {
        notifications.push({
          email,
          type: 'trial_day6_warning',
          title: 'Trial Ending Soon!',
          message: 'Your 7-day trial ends tomorrow. Upgrade now to keep unlimited access to premium features!',
          action_url: '/subscription',
          updateField: 'notif_day6_sent'
        });
      }

      // Day 7 (expiration day)
      if (daysLeft === 0 && timeLeft > 0 && !data.notif_expired_sent) {
        notifications.push({
          email,
          type: 'trial_expired_today',
          title: 'Trial Ends Today',
          message: 'Your trial expires today. Upgrade now to keep your premium features!',
          action_url: '/subscription',
          updateField: 'notif_expired_sent'
        });
      }

      // Expired (grace day logic: day 8)
      const daysSinceStart = Math.floor((nowMs - data.trial_start_date.toMillis()) / oneDayMs);
      if (daysSinceStart === 7 && !data.notif_grace_sent) {
        notifications.push({
          email,
          type: 'trial_grace_day',
          title: 'Grace Day: Final Chance!',
          message: 'Your trial expired, but you still have premium access today only. Upgrade now before it locks tomorrow.',
          action_url: '/subscription',
          updateField: 'notif_grace_sent'
        });
      }
    });

    // Batch write notifications and update user flags
    const batch = db.batch();
    for (const notif of notifications) {
      const notifRef = db.collection('notifications').doc();
      batch.set(notifRef, {
        user_email: notif.email,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        is_read: false,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        action_url: notif.action_url
      });
      // Mark user as notified to avoid duplicates
      const userRef = db.collection('users').doc(notif.email);
      batch.update(userRef, { [notif.updateField]: true });
    }
    await batch.commit();

    console.log(`Sent ${notifications.length} trial notifications`);
    return null;
  } catch (error) {
    console.error('Trial expiration check error:', error);
    return null;
  }
});
