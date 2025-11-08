
# Math Adventure 🎮⭐

A gamified math learning app for grades K-8 with rewards, daily challenges, leaderboards, and premium subscription features.

## 📱 Features

### Free Tier
- 3 games per day (resets at midnight)
- Access to 8 basic math concepts (addition, subtraction, etc.)
- Easy difficulty level
- Daily challenges
- Progress tracking
- Shop & rewards system
- Avatar customization
- Leaderboards

### Premium Subscription ($9.99/month or $79.99/year)
- ✨ Unlimited games
- ✨ 80+ math concepts across all grade levels
- ✨ AI Math Tutor with instant help
- ✨ Parent Portal with analytics & controls
- ✨ Team Challenges
- ✨ Priority support
- ✨ All difficulty levels

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v7
- **UI**: Shadcn UI + Tailwind CSS
- **Data**: React Query v5 + Firebase Firestore
- **Auth**: Firebase Authentication
- **Backend**: Firebase Cloud Functions
- **Payments**: Square (external checkout)
- **PWA**: Service Worker for offline support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase account
- Square developer account (for subscriptions)

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Fill in your Firebase and Square credentials
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password + Google)
3. Enable Firestore Database
4. Enable Cloud Functions
5. Copy credentials to `.env`

### Square Setup
1. Create Square developer account at https://developer.squareup.com
2. Create subscription plans in Square Dashboard
3. Copy Application ID, Location ID to `.env`
4. Configure webhooks (see DEPLOYMENT.md)

### Environment Variables
See `.env.example` for required variables:
- Firebase config (API key, project ID, etc.)
- Square credentials
- App URLs

## 📦 Project Structure

```
├── public/              # Static assets
│   ├── service-worker.js
│   └── manifest.json
├── src/
│   ├── api/            # Firebase service layer
│   │   ├── firebaseService.js
│   │   └── entities.js
│   ├── components/     # React components
│   │   ├── UpgradeButton.jsx
│   │   ├── daily/
│   │   ├── game/
│   │   ├── parent/
│   │   └── ui/         # Shadcn components
│   ├── hooks/          # Custom hooks
│   │   └── useFirebaseUser.js
│   ├── lib/            # Utilities
│   │   └── selectors.js
│   ├── pages/          # Route pages
│   │   ├── Home.jsx
│   │   ├── Game.jsx
│   │   ├── Subscribe.jsx
│   │   └── ...
│   └── main.jsx
├── functions/          # Cloud Functions
│   ├── index.js
│   └── package.json
└── firebase.json       # Firebase config
```

## 🔐 Authentication & Data

### User Profile Schema
```javascript
users/{email}
  ├── email: string
  ├── displayName: string
  ├── entitlements:
  │   └── premium: boolean
  ├── subscription:
  │   ├── id: string
  │   ├── status: 'ACTIVE' | 'CANCELED' | 'PAUSED'
  │   ├── platform: 'square' | 'manual'
  │   ├── planId: string
  │   └── chargedThroughDate: Timestamp
  ├── stars_spent: number
  ├── coins: number
  ├── owned_pets: string[]
  ├── unlocked_items: string[]
  └── parental_controls: object
```

### Premium Gates
Pages check `user?.entitlements?.premium` via the `useFirebaseUser` hook:
- **Home.jsx**: Limits concepts & difficulty for free tier
- **Game.jsx**: Blocks premium content
- **ParentPortal.jsx**: Premium-only feature

## 💳 Payment Flow (Hybrid)

Math Adventure supports a hybrid subscription purchase model:

### A. Google Play Billing (Android via TWA)
1. User taps "Upgrade to Premium" inside the Trusted Web Activity.
2. `UpgradeButton` detects Digital Goods API availability.
3. Play purchase dialog launches (in-app experience).
4. Purchase token → sent to `verifyPlayPurchase` Cloud Function.
5. Function validates token (Android Publisher API) & grants entitlement.
6. Firestore snapshot updates → premium unlocks instantly.

### B. External Checkout (Web / Non-Play)
1. Digital Goods API not available → disclosure modal shown.
2. User proceeds to external Square checkout.
3. Square processes subscription.
4. Webhook (`handleSquareWebhook`) updates Firestore.
5. Entitlement unlocks when status ACTIVE.

The flow automatically chooses Play Billing when available and falls back gracefully.

## 🧪 Testing

### Test Premium Access
Manually grant premium for testing:
```bash
curl -X POST https://your-project.cloudfunctions.net/grantPremiumAccess \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","expiresInDays":7}'
```

### Square Sandbox
Use test cards in Square sandbox mode:
- Card: 4111 1111 1111 1111
- CVV: 111
- Exp: 12/25

## 📱 Google Play Store (Hybrid)

### Compliance
- Play Billing inside TWA; external payments for non-Play browsers.
- Disclosure shown only for external (Square) path.
- Ensure product IDs match `.env` (VITE_PLAY_MONTHLY_ID / VITE_PLAY_YEARLY_ID).
- This project now assumes the app is hosted at https://math-adventure-app.web.app/ (no custom domain required).

### Submission Steps (Hybrid)
1. Create subscription products in Play Console.
2. Package web app as TWA targeting https://math-adventure-app.web.app/ (see `TWA_SETUP.md`).
3. Upload AAB (internal test → closed → production).
4. Provide privacy policy + hybrid billing explanation.
5. Test Play purchase & external fallback.
6. Submit for review.

See `DEPLOYMENT.md` and `TWA_SETUP.md` for detailed instructions.

## 🛠️ Development

### Key Components

**useFirebaseUser Hook**: Live user profile with Firestore subscription
```jsx
const { user, loading, error } = useFirebaseUser();
const isPremium = user?.entitlements?.premium;
```

**UpgradeButton**: Compliant upgrade button with disclosure
```jsx
import UpgradeButton from '@/components/UpgradeButton';
<UpgradeButton />
```

**Selectors**: Reusable computed values
```javascript
import { getAvailableStars, getUserCoins } from '@/lib/selectors';
const stars = getAvailableStars(progress, dailyChallenges, user);
```

### Cloud Functions
- `createSubscription`: Process Square payment → grant premium (external)
- `handleSquareWebhook`: Sync subscription status (Square)
- `verifyPlayPurchase`: Validate Google Play Billing token → grant premium
- `grantPremiumAccess`: Manual premium access (testing/support)

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- [TWA_SETUP.md](./TWA_SETUP.md)
- `.env.example`

Proprietary - All rights reserved

## 🆘 Support

For issues or questions:
- Check Cloud Functions logs
- Verify Square webhook delivery
- Test with Square sandbox mode first
- Contact support@mathadventure.com

---

Built with ❤️ for kids who love learning math!