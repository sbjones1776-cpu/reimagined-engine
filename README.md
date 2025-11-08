
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

## 💳 Payment Flow

1. User clicks "Upgrade to Premium" → shows disclosure modal
2. User confirms → opens external checkout (Square)
3. Square processes payment → creates subscription
4. Square webhook calls Cloud Function
5. Function writes `entitlements.premium = true` to Firestore
6. App updates instantly via live Firestore subscription
7. Premium features unlock immediately

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

## 📱 Google Play Store

### Compliance
- App uses **external payments** (Square, not Google Play Billing)
- Must declare in Play Console → Monetization
- UpgradeButton shows Google-required disclosure
- External checkout opens in browser

### Submission Steps
1. Declare external payments in Play Console
2. Submit for Google review (1-3 days)
3. Upload APK/AAB
4. Fill in store listing with provided description
5. Submit for app review

See `DEPLOYMENT.md` for detailed deployment instructions.

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
- `createSubscription`: Process Square payment → grant premium
- `handleSquareWebhook`: Sync subscription status
- `grantPremiumAccess`: Manual premium access (testing/support)

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase configuration
- `.env.example` - Environment variables reference

## 🐛 Troubleshooting

### Premium not unlocking
1. Check Firestore: `users/{email}.entitlements.premium` should be `true`
2. Check Cloud Functions logs: `firebase functions:log`
3. Verify Square webhook is configured correctly
4. Check user is signed in with correct email

### Build errors
```bash
npm install
npm run build
```

### Firebase errors
- Verify Firestore rules allow writes to `users/{uid}`
- Check Firebase credentials in `.env`
- Ensure Firestore indexes are deployed

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues or questions:
- Check Cloud Functions logs
- Verify Square webhook delivery
- Test with Square sandbox mode first
- Contact support@mathadventure.com

---

Built with ❤️ for kids who love learning math!