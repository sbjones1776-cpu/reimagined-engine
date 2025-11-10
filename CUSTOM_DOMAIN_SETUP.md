# Custom Domain Setup Guide

## Issue: 404 Error After Subscription

If you're seeing a 404 error after completing a subscription, it's because the app is trying to redirect to `math-adventure.com`, which isn't configured yet.

## Quick Fix (Use Firebase Hosting URL)

The app is currently deployed at: **`https://math-adventure-app.web.app/`**

### 1. Update Environment Variables

Create a `.env` file in the project root (if it doesn't exist) with:

```bash
# Firebase Production URLs
VITE_APP_URL=https://math-adventure-app.web.app
VITE_CHECKOUT_URL=https://math-adventure-app.web.app/subscribe
VITE_FUNCTIONS_URL=https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net

# Add your Firebase config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=math-adventure-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... etc
```

### 2. Rebuild and Deploy

```powershell
npm run build
firebase deploy --only hosting
```

---

## Long-term Solution: Configure Custom Domain

If you want to use `math-adventure.com` instead of the Firebase subdomain:

### Step 1: Add Custom Domain in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Hosting** → **Custom domains**
4. Click **Add custom domain**
5. Enter `math-adventure.com` (and optionally `www.math-adventure.com`)
6. Firebase will provide DNS records to configure

### Step 2: Configure DNS

You'll need to add these records to your domain registrar (e.g., GoDaddy, Namecheap):

**For apex domain (math-adventure.com):**
```
Type: A
Host: @
Value: 151.101.1.195
Value: 151.101.65.195
```

**For www subdomain:**
```
Type: CNAME
Host: www
Value: math-adventure-app.web.app
```

**Note:** DNS propagation can take 24-48 hours.

### Step 3: Wait for SSL Certificate

Firebase automatically provisions an SSL certificate for your custom domain. This can take a few hours after DNS verification.

### Step 4: Update Environment Variables

Once the domain is live, update `.env`:

```bash
VITE_APP_URL=https://math-adventure.com
VITE_CHECKOUT_URL=https://math-adventure.com/subscribe
```

### Step 5: Update Google Play Store Listing

If using TWA (Trusted Web Activity) for Android:

1. Update `twa-manifest.json`:
   ```json
   {
     "host": "math-adventure.com",
     "startUrl": "https://math-adventure.com/",
     "webManifestUrl": "https://math-adventure.com/manifest.json"
   }
   ```

2. Update Digital Asset Links at `https://math-adventure.com/.well-known/assetlinks.json`

3. Rebuild the Android app:
   ```powershell
   bubblewrap update
   bubblewrap build
   ```

4. Upload new AAB to Google Play Console

---

## Current Status

✅ **Working URL:** `https://math-adventure-app.web.app/`  
⚠️ **Not configured:** `math-adventure.com` (returns 404)

### Immediate Action Required

1. **Option A (Fastest):** Remove the `CNAME` files and stick with Firebase default URL
2. **Option B (Better branding):** Follow the custom domain setup steps above

---

## Testing

After making changes:

1. Clear browser cache
2. Test subscription flow:
   - Go to app → Subscribe → Complete payment
   - Verify redirect works correctly
   - Check that premium features unlock

---

## Troubleshooting

### Still getting 404?

- Check browser developer console for the exact redirect URL
- Verify `.env` file exists and contains production URLs
- Make sure you rebuilt the app after updating `.env`
- Check that environment variables are being loaded (add `console.log(import.meta.env.VITE_APP_URL)`)

### Domain not working after DNS setup?

- DNS changes take time (24-48 hours)
- Use [DNS Checker](https://dnschecker.org) to verify propagation
- Ensure SSL certificate is provisioned in Firebase Console

---

## Related Files

- `.env` - Environment variables (create this file based on `.env.example`)
- `src/pages/Subscribe.jsx` - Subscription redirect logic
- `CNAME` - GitHub Pages / custom domain configuration
- `twa-manifest.json` - Android TWA configuration
- `public/manifest.json` - PWA manifest (should match your actual domain)
