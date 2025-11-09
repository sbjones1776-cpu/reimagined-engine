# Google Play Console Setup Guide
## Free App with In-App Subscriptions

This guide walks you through setting up **Math Adventure** as a **free app** with Google Play Billing subscriptions in the Play Console.

---

## ✅ Step 1: Create App (Free Model)

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in app details:
   - **App name**: `Math-Adventure: Kids Math`
   - **Default language**: English (United States)
   - **App or game**: Select **App**
   - **Free or paid**: Select **Free** ⭐ (critical!)
   - Check both policy declarations

**Why Free?**
- Your monetization is via subscriptions (IAP), not upfront payment
- Larger reach and better conversion funnel (free trial → paid)
- Industry standard for educational subscription apps
- Users can try your free tier (8 basic concepts) before upgrading

---

## ✅ Step 2: Set Up In-App Products (Subscriptions)

### Create Subscription Products

1. In Play Console, go to **Monetization → Products → Subscriptions**
2. Click **Create subscription**

You need to create **6 subscription products** (3 tiers × 2 billing periods):

| Tier | Period | Product ID | Name | Price (USD) | Env Variable |
|------|--------|------------|------|-------------|--------------|
| **Premium Player** | Monthly | `play_premium_player_monthly` | Premium Player Monthly | $4.99 | `VITE_PLAY_PREMIUM_PLAYER_MONTHLY_ID` |
| **Premium Player** | Yearly | `play_premium_player_yearly` | Premium Player Yearly | $47.88 | `VITE_PLAY_PREMIUM_PLAYER_YEARLY_ID` |
| **Premium Parent** | Monthly | `play_premium_parent_monthly` | Premium Parent Monthly | $7.99 | `VITE_PLAY_PREMIUM_PARENT_MONTHLY_ID` |
| **Premium Parent** | Yearly | `play_premium_parent_yearly` | Premium Parent Yearly | $76.88 | `VITE_PLAY_PREMIUM_PARENT_YEARLY_ID` |
| **Family Teacher** | Monthly | `play_family_teacher_monthly` | Family Teacher Monthly | $12.99 | `VITE_PLAY_FAMILY_TEACHER_MONTHLY_ID` |
| **Family Teacher** | Yearly | `play_family_teacher_yearly` | Family Teacher Yearly | $124.88 | `VITE_PLAY_FAMILY_TEACHER_YEARLY_ID` |

### Tier Features

**Premium Player** ($4.99/mo or $47.88/yr):
- Unlock all 80+ math concepts
- AI tutor with personalized hints
- Daily challenges and rewards
- Progress tracking
- Ad-free experience

**Premium Parent** ($7.99/mo or $76.88/yr):
- All Premium Player features
- Parent portal with analytics
- Performance insights and reports
- Goal setting and tracking
- Time limits and parental controls

**Family Teacher** ($12.99/mo or $124.88/yr):
- All Premium Parent features
- Up to 5 student accounts
- Team challenges and competitions
- Lesson assignment tools
- Comprehensive classroom analytics

### Base Plan Details (for each subscription)

**All subscriptions should have**:
- **Auto-renewing**: Yes
- **Free trial**: 7 days (recommended for conversion)
- **Grace period**: 3 days (recommended)
- **Billing period**: 1 month (P1M) for monthly, 1 year (P1Y) for yearly

### Subscription Features to Enable
- ✅ **Upgrades/Downgrades**: Allow users to switch between tiers and periods
- ✅ **Pausing**: Allow users to pause subscriptions (optional)
- ✅ **Account hold**: Enable grace period for payment issues
- ✅ **Reinstates**: Allow automatic restoration

### Pricing Notes
- Yearly plans offer a 20% discount vs paying monthly (Player saves $11.88, Parent saves $19.00, Family/Teacher saves $30.80)
- Set prices for all countries (Play Console suggests local pricing) – adjust for purchasing power if needed
- Consider introductory offers (e.g., first month $0.99) for conversion experiments later

---

## ✅ Step 3: Configure Digital Goods API

Your app uses the **Digital Goods API** (Chrome's standard for Play Billing in TWAs).

### Requirements
1. **TWA setup complete** (see TWA_SETUP.md)
2. **Asset Links verified** (see public/.well-known/assetlinks.json)
3. **HTTPS hosting** on Firebase (math-adventure-app.web.app)
4. **Product IDs published** and **Active** in Play Console

### Environment Variables
Update your `.env` file:

```bash
# Google Play Billing Product IDs (must match Play Console)
# Premium Player Tier
VITE_PLAY_PREMIUM_PLAYER_MONTHLY_ID=play_premium_player_monthly
VITE_PLAY_PREMIUM_PLAYER_YEARLY_ID=play_premium_player_yearly

# Premium Parent Tier
VITE_PLAY_PREMIUM_PARENT_MONTHLY_ID=play_premium_parent_monthly
VITE_PLAY_PREMIUM_PARENT_YEARLY_ID=play_premium_parent_yearly

# Family Teacher Tier
VITE_PLAY_FAMILY_TEACHER_MONTHLY_ID=play_family_teacher_monthly
VITE_PLAY_FAMILY_TEACHER_YEARLY_ID=play_family_teacher_yearly

# Firebase Functions URL (for verification)
VITE_FUNCTIONS_URL=https://us-central1-YOUR-PROJECT.cloudfunctions.net
```

---

## ✅ Step 4: Implement Backend Verification

Your Cloud Functions need to verify purchases with Google Play. Update `functions/index.js`:

### Add Service Account Permissions
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **IAM & Admin → Service Accounts**
3. Find your Firebase service account (default-compute@...)
4. Add role: **Android Publisher** (or Monetization Admin)

### Configure Functions Environment
```bash
firebase functions:config:set play.package="com.mathadventure.app"
```

### Verify Function Implementation
The `verifyPlayPurchase` function in `functions/index.js` should:
1. Receive `{ token, productId, email }`
2. Call Android Publisher API to validate token
3. Check subscription status (active/expired/canceled)
4. Update Firestore user document:
   ```javascript
   {
     entitlements: { premium: true },
     subscription: {
       platform: 'googleplay',
       status: 'active',
       productId: 'play_monthly_sub',
       expiresAt: timestamp,
       autoRenew: true
     }
   }
   ```
5. Return `{ success: true, entitlementGranted: true }`

---

## ✅ Step 5: Build and Package TWA

### Generate Signed APK
1. Create a keystore (if not already done):
   ```powershell
   keytool -genkey -v -keystore mathad-release.keystore -alias mathad -keyalg RSA -keysize 2048 -validity 10000
   ```
   Save the password securely!

2. Get SHA-256 fingerprint:
   ```powershell
   keytool -list -v -keystore mathad-release.keystore -alias mathad
   ```
   Copy the SHA-256 fingerprint (needed for Asset Links)

3. Update `public/.well-known/assetlinks.json` with your package name and SHA-256

4. Build and sign TWA using Bubblewrap:
   ```bash
   cd twa
   bubblewrap build
   # Sign the APK with your keystore
   ```

---

## ✅ Step 6: Testing Before Release

### Test Play Billing (Internal Testing)
1. **Add test accounts** in Play Console:
   - Go to **Setup → License testing**
   - Add your email and team emails
   - Set **License Test Response**: RESPOND_NORMALLY

2. **Upload to Internal Testing**:
   - Go to **Release → Testing → Internal testing**
   - Create release and upload APK
   - Add testers via email list

3. **Test purchase flow**:
   - Install from internal testing link
   - Verify Digital Goods API loads products
   - Complete test purchase (won't charge test accounts)
   - Verify backend updates Firestore entitlements

### Test Fallback (Square)
On a regular browser (not TWA):
- Verify it shows external checkout disclosure
- Opens Square checkout in new tab

---

## ✅ Step 7: Content Rating & Store Listing

### Content Rating
1. Go to **Policy → App content → Content rating**
2. Complete questionnaire:
   - **Target audience**: Children (ages 5-12)
   - **Interactive elements**: In-app purchases
   - **No**: Violence, sexual content, profanity, etc.
3. Submit for rating (expect ESRB: Everyone, PEGI: 3)

### Store Listing
Required assets:
- **Icon**: 512×512 PNG (use your logo)
- **Feature graphic**: 1024×500 (hero image)
- **Phone screenshots**: At least 2 (1080×1920 or similar)
- **7-inch tablet**: At least 1 screenshot
- **10-inch tablet**: At least 1 screenshot
- **App description**: Highlight free tier + premium features
- **Privacy policy URL**: Required for apps with login

**Example short description**:
> "Make math fun! 80+ games for grades K-8 with AI tutor, daily challenges, and rewards. Try free, upgrade for unlimited access."

---

## ✅ Step 8: Privacy & Data Safety

### Data Safety Section
Declare what data you collect:

**Data collected**:
- ✅ Email address (authentication)
- ✅ Name (profile)
- ✅ In-app activity (game progress)
- ✅ Purchase history (subscription status)

**Data sharing**:
- ❌ No sharing with third parties (unless using analytics)

**Security**:
- ✅ Data encrypted in transit (HTTPS)
- ✅ Data encrypted at rest (Firestore)
- ✅ Users can delete their account

**COPPA Compliance** (required for kids' apps):
- Target audience includes children
- Parental controls available
- No advertising
- Limited data collection

### Privacy Policy
Required URL. Include:
- What data you collect and why
- How data is stored (Firebase)
- Subscription/billing terms
- How parents can manage data
- Contact information

Example: `https://math-adventure-app.web.app/PrivacyPolicy`

---

## ✅ Step 9: Production Release

### Pre-launch Checklist
- [ ] Subscriptions published and **Active** in Play Console
- [ ] Asset Links verified (check via Digital Asset Links API)
- [ ] Backend verification function deployed and tested
- [ ] License testing completed with real devices
- [ ] All store listing assets uploaded
- [ ] Content rating received
- [ ] Data safety section complete
- [ ] Privacy policy live and linked

### Submit for Review
1. Go to **Release → Production**
2. Create new release
3. Upload signed APK/AAB
4. Add release notes
5. Review and rollout (start with 20% rollout, monitor)

### Post-Launch Monitoring
- Watch crash reports in Play Console
- Monitor subscription analytics
- Check backend logs for verification errors
- Respond to user reviews within 24-48 hours

---

## 🎯 Key Differences: Free App with IAP

### What You CAN Do ✅
- Offer free tier with limited features
- Use Google Play Billing for subscriptions (Digital Goods API)
- Offer 7-day free trial for conversions
- Link to Square as fallback for web users (with disclosure)
- Use promo codes for subscriptions

### What You CAN'T Do ❌
- Bypass Play Billing for in-app content unlocks
- Advertise external payment methods inside the app
- Charge upfront download fee (you chose "Free")
- Link directly to Square for in-app purchases (only as fallback)

---

## 🆘 Troubleshooting

### "Digital Goods API not available"
- Ensure TWA is signed with correct keystore
- Verify Asset Links JSON is deployed and accessible
- Check package name matches in manifest, Asset Links, and Play Console
- Only works in TWA context (not regular browser)

### "Product not found" in getDetails()
- Verify product IDs match exactly (case-sensitive)
- Ensure subscriptions are **Active** in Play Console
- Wait 2-4 hours after publishing products
- Check app is using same Google account as license testing

### Verification fails
- Service account needs Android Publisher role
- Package name in functions config must match TWA
- Token must be sent immediately (expires in ~5 min)
- Check Cloud Functions logs for detailed errors

---

## 📚 Additional Resources

- [Play Billing Overview](https://developer.android.com/google/play/billing/integrate)
- [Digital Goods API Spec](https://github.com/WICG/digital-goods/blob/main/explainer.md)
- [TWA Guide](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Play Console Help](https://support.google.com/googleplay/android-developer)

---

## 🎉 You're Ready!

With **Free + IAP** model:
- ✅ Users download at zero risk
- ✅ Your free tier drives engagement
- ✅ Google Play Billing handles payment securely
- ✅ Square fallback keeps web users covered
- ✅ Larger audience, better conversion potential

**Next step**: Select **"Free"** in Play Console and continue with app creation!
