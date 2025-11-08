# Math Adventure - Deployment Guide

## Prerequisites

1. **Firebase Project Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Enable Cloud Functions

2. **Square Account Setup**
   - Create a Square developer account at https://developer.squareup.com
   - Create subscription plans in Square Dashboard
   - Get Application ID, Location ID, and Access Token

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

## Google Play Store Setup

1. **Declare External Payments**:
   - Go to Play Console → Monetization
   - Select "User purchases through external website"
   - Submit for review (1-3 days)

2. **Update App Description**:
   - Use the provided app description
   - Upload screenshots showing the app features
   - Add "Premium subscription available" in short description

3. **Compliance**:
   - Ensure UpgradeButton shows Google's required disclosure
   - Test external checkout flow thoroughly
   - Submit app for review

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

## Production Checklist

- [ ] Firebase project configured
- [ ] Square production credentials added
- [ ] Cloud Functions deployed
- [ ] Square webhooks configured
- [ ] Firestore rules deployed
- [ ] Web app deployed to Firebase Hosting
- [ ] .env updated with production URLs
- [ ] Google Play external payment declaration approved
- [ ] App submitted to Play Store
- [ ] Test subscription flow end-to-end
- [ ] Monitor Cloud Functions logs for errors

## Support

For issues:
1. Check Firebase Functions logs: `firebase functions:log`
2. Check Firestore security rules allow writes to `users/{email}/entitlements`
3. Verify Square webhook is receiving events
4. Test with Square sandbox mode first

## Subscription Plans

Create these in Square Dashboard:
- **Monthly Plan**: $9.99/month
- **Annual Plan**: $79.99/year (33% savings)

Note the Plan Variation IDs and update them in:
- `src/pages/Subscribe.jsx` (plans object)
- Square Dashboard subscription settings
