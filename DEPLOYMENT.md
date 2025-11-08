# Math Adventure - Deployment Guide

## Prerequisites

1. **Firebase Project Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Enable Cloud Functions

2. **Payments Setup (Hybrid)**
   - Square (External Fallback): Create subscription plans & obtain Application ID, Location ID, Access Token.
   - Google Play Billing: In Play Console create subscription products (monthly/yearly). Note their product IDs and place them in `.env` as `VITE_PLAY_MONTHLY_ID` / `VITE_PLAY_YEARLY_ID`.

## Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials from Firebase Console → Project Settings
3. Fill in your Square credentials from Square Developer Dashboard

## Deploy Cloud Functions

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```bash
   firebase init functions
   ```

4. Set Square environment variables:
   ```bash
   firebase functions:config:set square.access_token="YOUR_SQUARE_ACCESS_TOKEN"
   firebase functions:config:set square.location_id="YOUR_SQUARE_LOCATION_ID"
   firebase functions:config:set square.environment="production"
   ```

5. Deploy functions:
   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

6. Note the function URLs (you'll need these for VITE_FUNCTIONS_URL):
   - `https://your-project.cloudfunctions.net/createSubscription`
   - `https://your-project.cloudfunctions.net/handleSquareWebhook`
   - `https://your-project.cloudfunctions.net/grantPremiumAccess`

## Configure Square Webhooks

1. Go to Square Developer Dashboard → Webhooks
2. Add new webhook endpoint: `https://your-project.cloudfunctions.net/handleSquareWebhook`
3. Subscribe to events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`

## Deploy Web App

1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

## Firestore Security Rules

Deploy the security rules:
```bash
firebase deploy --only firestore:rules
```

## Firestore Indexes

Deploy the indexes:
```bash
firebase deploy --only firestore:indexes
```

## Google Play Store Setup (Hybrid)

### Trusted Web Activity (TWA) Packaging
1. Create a minimal Android wrapper using Bubblewrap or your preferred TWA tooling.
2. Set the start URL to your production web app.
3. Include Digital Goods API origin trial if still required (check current Play policy) or verify automatic availability.
4. Ensure the web origin matches Play Console verified domain.

### Play Billing Subscription Products
1. In Play Console → Monetization → Products → Subscriptions, create monthly & yearly offerings.
2. Copy product IDs → set in `.env` as `VITE_PLAY_MONTHLY_ID`, `VITE_PLAY_YEARLY_ID`.
3. (Optional) Configure base plans and offers for introductory pricing.

### External Payment Disclosure
The `UpgradeButton` automatically shows the external payment disclosure only if Digital Goods API is not available (web browser scenario). No disclosure is shown for Play Billing purchases.

### Review Checklist
1. Test Play Billing flow inside TWA build (purchase sandbox test account).
2. Confirm `verifyPlayPurchase` Cloud Function grants Firestore entitlement.
3. Test external fallback on a regular Chrome desktop browser (should open Square checkout with disclosure).
4. Provide accurate privacy policy & hybrid billing explanation in store listing.
5. Submit AAB for review.

## Testing

### Test Premium Access (Manual)

Call the `grantPremiumAccess` function:
```bash
curl -X POST https://your-project.cloudfunctions.net/grantPremiumAccess \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","expiresInDays":7}'
```

### Test Subscription Flow

1. Use Square Sandbox mode for testing
2. Test card: 4111 1111 1111 1111, CVV: 111, Exp: 12/25
3. Complete checkout and verify Firestore updates
4. Check that premium features unlock immediately

## Production Checklist (Hybrid Billing)

- [ ] Firebase project configured
- [ ] Cloud Functions deployed (including `verifyPlayPurchase`)
- [ ] Square production credentials added & webhooks configured
- [ ] Play subscription product IDs set in `.env` & working
- [ ] TWA wrapper built & signed (AAB)
- [ ] Firestore rules & indexes deployed
- [ ] Web app deployed (Hosting) & origin verified in Play Console
- [ ] Play Billing purchase test succeeds (sandbox)
- [ ] External Square fallback test succeeds (non-TWA browser)
- [ ] README & DEPLOYMENT docs updated
- [ ] App listing updated with hybrid billing disclosure
- [ ] Submit for Play review
- [ ] Monitor Cloud Functions logs for Square + Play verification

## Support

For issues:
1. Check Firebase Functions logs: `firebase functions:log`
2. Check Firestore security rules allow writes to `users/{email}/entitlements`
3. Verify Square webhook is receiving events
4. Test with Square sandbox mode first

## Subscription Plans & IDs

Square:
- Monthly Plan: $9.99/month → use variation ID in `Subscribe.jsx`.
- Annual Plan: $79.99/year → variation ID in `Subscribe.jsx`.

Google Play:
- Monthly Subscription Product ID: `VITE_PLAY_MONTHLY_ID`
- Yearly Subscription Product ID: `VITE_PLAY_YEARLY_ID`

Ensure product IDs remain consistent across environments. Use sandbox test accounts for Play Billing validation.
