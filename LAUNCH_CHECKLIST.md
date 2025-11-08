# Launch Checklist for Math Adventure

## ✅ Pre-Launch Setup

### 1. Firebase Configuration
- [ ] Create Firebase project
- [ ] Enable Authentication (Email/Password + Google)
- [ ] Enable Firestore Database
- [ ] Enable Cloud Functions
- [ ] Copy credentials to `.env`
- [ ] Deploy Firestore security rules: `firebase deploy --only firestore:rules`
- [ ] Deploy Firestore indexes: `firebase deploy --only firestore:indexes`

### 2. Square Payment Setup
- [ ] Create Square developer account
- [ ] Create subscription plans:
  - [ ] Monthly: $9.99/month (note Plan Variation ID)
  - [ ] Annual: $79.99/year (note Plan Variation ID)
- [ ] Copy Application ID to `.env`
- [ ] Copy Location ID to `.env`
- [ ] Get Access Token (production mode)

### 3. Cloud Functions Deployment
- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Login: `firebase login`
- [ ] Navigate to functions: `cd functions && npm install`
- [ ] Set Square config:
  ```bash
  firebase functions:config:set square.access_token="YOUR_TOKEN"
  firebase functions:config:set square.location_id="YOUR_LOCATION"
  firebase functions:config:set square.environment="production"
  ```
- [ ] Deploy functions: `firebase deploy --only functions`
- [ ] Note function URLs (need for `.env`)

### 4. Square Webhooks
- [ ] Go to Square Dashboard → Webhooks
- [ ] Add endpoint: `https://YOUR_PROJECT.cloudfunctions.net/handleSquareWebhook`
- [ ] Subscribe to events:
  - [ ] `subscription.created`
  - [ ] `subscription.updated`
  - [ ] `subscription.canceled`
- [ ] Test webhook delivery

### 5. Environment Variables
- [ ] Create `.env` from `.env.example`
- [ ] Fill in Firebase credentials
- [ ] Fill in Square credentials
- [ ] Update `VITE_FUNCTIONS_URL` with your Cloud Functions URL
- [ ] Update `VITE_CHECKOUT_URL` (can be `/subscribe` for in-app)

### 6. Update Subscribe Page
- [ ] Open `src/pages/Subscribe.jsx`
- [ ] Update Plan IDs:
  ```javascript
  monthly: { id: 'YOUR_MONTHLY_PLAN_ID' }
  annual: { id: 'YOUR_ANNUAL_PLAN_ID' }
  ```

### 7. Build & Test
- [ ] Run `npm install`
- [ ] Run `npm run build` (verify no errors)
- [ ] Run `npm run dev` locally
- [ ] Test sign up flow
- [ ] Test free tier (3 games limit)
- [ ] Test premium content locks

### 8. Test Subscription Flow (Sandbox)
- [ ] Set Square to sandbox mode in `.env`
- [ ] Deploy test version
- [ ] Complete checkout with test card (4111 1111 1111 1111)
- [ ] Verify Firestore `entitlements.premium` = true
- [ ] Verify premium features unlock
- [ ] Check Cloud Functions logs for errors
- [ ] Test webhook delivery

## 🚀 Google Play Store Setup

### 9. Play Console Configuration
- [ ] Create app in Google Play Console
- [ ] Upload app bundle/APK
- [ ] Fill in store listing:
  - [ ] Use provided app description (under 4000 chars)
  - [ ] Upload screenshots (at least 2)
  - [ ] Add app icon
  - [ ] Set category: Education
  - [ ] Add content rating

### 10. Declare External Payments
- [ ] Go to Play Console → Monetization
- [ ] Select "User purchases subscriptions on external website"
- [ ] Submit declaration for review
- [ ] **Wait for approval (1-3 days)** before submitting app

### 11. Privacy & Compliance
- [ ] Add Privacy Policy URL (host at `/privacy`)
- [ ] Complete Data Safety section
- [ ] Declare data collection (email, usage stats)
- [ ] Target audience: Kids & families
- [ ] Complete COPPA compliance

### 12. App Review Preparation
- [ ] Create test account for reviewers
- [ ] Grant premium access to test account:
  ```bash
  curl -X POST https://YOUR_PROJECT.cloudfunctions.net/grantPremiumAccess \
    -H "Content-Type: application/json" \
    -d '{"email":"reviewer@test.com","expiresInDays":30}'
  ```
- [ ] Provide test credentials in review notes
- [ ] Explain external payment flow in review notes

### 13. Final Checks
- [ ] Verify all pages load without errors
- [ ] Test on real Android device
- [ ] Test on different screen sizes
- [ ] Verify offline mode works (service worker)
- [ ] Check all links work
- [ ] Test UpgradeButton disclosure shows correctly
- [ ] Verify external checkout opens in browser

## 📱 Production Deployment

### 14. Switch to Production
- [ ] Update Square to production mode in `.env`
- [ ] Update Cloud Functions config to production
- [ ] Deploy Cloud Functions: `firebase deploy --only functions`
- [ ] Build production app: `npm run build`
- [ ] Deploy to Firebase Hosting: `firebase deploy --only hosting`
- [ ] Update `VITE_APP_URL` to production domain

### 15. Submit to Play Store
- [ ] **After external payment approval received**
- [ ] Upload production APK/AAB
- [ ] Complete all store listing fields
- [ ] Submit for review
- [ ] Monitor review status

### 16. Post-Launch
- [ ] Test production subscription flow end-to-end
- [ ] Monitor Cloud Functions logs
- [ ] Check Firestore writes
- [ ] Verify webhook delivery
- [ ] Test with real credit card
- [ ] Monitor user feedback
- [ ] Set up analytics (optional)

## 🛠️ Quick Commands Reference

```bash
# Development
npm run dev

# Build
npm run build

# Deploy Functions
cd functions && npm install
firebase deploy --only functions

# Deploy Hosting
firebase deploy --only hosting

# Deploy Everything
firebase deploy

# View Logs
firebase functions:log

# Grant Test Premium
curl -X POST https://YOUR_PROJECT.cloudfunctions.net/grantPremiumAccess \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","expiresInDays":7}'
```

## ⚠️ Important Notes

1. **Do NOT submit app to Play Store** until external payment declaration is approved
2. **Test thoroughly in sandbox** before switching to production
3. **UpgradeButton must show disclosure** - required by Google
4. **Keep Firebase Functions deployed** - they handle subscriptions
5. **Monitor webhooks** - ensure Square can reach your endpoint
6. **Test on real device** - PWA features behave differently

## 📞 Support Contacts

- Square Support: https://developer.squareup.com/support
- Firebase Support: https://firebase.google.com/support
- Google Play Support: https://support.google.com/googleplay/android-developer

## ✨ You're Ready to Launch!

Once all checkboxes are complete, you're ready to submit your app. Good luck! 🚀
