# Trusted Web Activity (TWA) Setup Guide

Use this guide to package your existing web app as an Android app that launches in a Trusted Web Activity, enabling Google Play Billing via the Digital Goods API.

## Prerequisites
- Android Studio installed
- Java 17
- Node.js & npm
- Verified web origin (HTTPS) matching your production domain

## 1) Install Bubblewrap CLI

```powershell
npm install -g @bubblewrap/cli
```

## 2) Generate TWA Project

```powershell
bubblewrap init --manifest=https://YOUR_DOMAIN/manifest.json
```

Answer prompts:
- Package ID: com.yourcompany.mathadventure
- Application name: Math Adventure
- Start URL: https://YOUR_DOMAIN/
- Launcher name, colors, etc. as preferred.

This creates an Android project in `./android/`.

## 3) Configure Digital Goods API

The Digital Goods API is available inside TWA. Ensure your web app detects it via `window.getDigitalGoodsService('googleplay')`. No extra Android UI is needed.

Optional: If an origin trial or specific Play policy applies, include the required meta tags on the web origin. Check current Play policy docs.

## 4) Link App and Site

In Play Console → Setup → Advanced settings → App signing, ensure your app’s signing key is used. Follow Bubblewrap prompts to set up Digital Asset Links so your TWA has verified relations with your site.

Bubblewrap can generate the assetlinks.json for you, or edit the template added to this repo at `public/.well-known/assetlinks.json`:
```
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourcompany.mathadventure",
      "sha256_cert_fingerprints": [
        "YOUR_SHA256_CERT_FINGERPRINT"
      ]
    }
  }
]
```
Replace `package_name` with your final app id and `sha256_cert_fingerprints` with your app signing key fingerprint from Play Console.

We also added a Bubblewrap manifest template at `twa/twa-manifest.template.json` you can keep alongside this repo to track app settings.
```powershell
bubblewrap update
bubblewrap build
```
Then host `/.well-known/assetlinks.json` at your domain with the provided content.

## 5) Build AAB

```powershell
cd android
./gradlew bundleRelease
```
The output AAB is at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## 6) Play Billing Products

In Play Console:
- Create subscription products (monthly/yearly)
- Note product IDs and set in your `.env`:
  - `VITE_PLAY_MONTHLY_ID`
  - `VITE_PLAY_YEARLY_ID`

## 7) Cloud Functions Verification

Deploy the `verifyPlayPurchase` function, and set the Play package name:
```powershell
firebase functions:config:set play.package="com.yourcompany.mathadventure"
firebase deploy --only functions
```
Ensure the Cloud Functions service account has Android Publisher API access.

## 8) Test

- Install the TWA app on a test device via internal testing.
- Sign in to the app, tap Upgrade.
- Confirm Play purchase dialog appears.
- After purchase, entitlement should be granted immediately.

## 9) Release

- Upload the AAB to Play Console (Internal → Closed → Production rollout).
- Complete store listing, content rating, and privacy policy.
- Submit for review.

## Troubleshooting
- If the app opens in a Custom Tab instead of TWA, verify Digital Asset Links.
- If Play Billing doesn’t appear, make sure the test device uses a tester account and that products are active.
- Check Cloud Functions logs for verification failures.
