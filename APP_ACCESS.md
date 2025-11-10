# Google Play – App access instructions

Use this text in the Play Console “App access” section. This ensures reviewers can access all restricted areas (login-only and subscription-gated features) without making purchases or contacting you.

---

Select: All or some functionality in my app is restricted

Reason: Some features require sign-in (saving progress, messages, Parent Portal) and premium content requires a subscription. We provide a test account with full access and no 2‑step verification.

Access details for Google Play reviewers

- App name: Math Adventure
- Login required: Yes (email + password)
- 2‑step verification: No
- Location restrictions: No
- Subscription required for premium content: Yes, but the test account below already has premium entitlements (no purchase needed)

Test account credentials

- Email: googlereview@mathadventure.com
- Password: Review2025!

How to sign in and access all features

1) Open the app.
2) Tap “Sign In / Sign Up”.
3) Enter the credentials above and sign in.
4) You now have full access:
   - All math concepts and difficulties unlocked
   - AI Tutor, Daily Challenges, Rewards/Shop
   - Parent Portal and analytics
   - Team Challenges, Messages, Settings
   - No payment or trial required

Notes

- The app also offers a free tier without sign-in; however, some features (parent analytics, premium concepts) are gated. The reviewer account above is provisioned with full access for review.
- No additional actions on another device are required.

Developer checklist (do this before submitting)

- Create the account googlereview@mathadventure.com in Firebase Authentication and set the password to Review2025! (email/password provider).
- Grant premium access to this account so reviewers can see all restricted features:
  - Option A (in-app): open https://your-app-domain/AdminTestAccount, enter the email above, click “Grant Premium Access”.
  - Option B (Firestore): update users/{id} with entitlements and/or subscription fields to indicate premium is active.
- Confirm you can sign in on a clean device with the credentials above and that premium areas are unlocked.

If needed for web testing (not required for Play review)

- Web URL: https://math-adventure-app.web.app/

---

Paste-ready summary for Play Console

Some functionality requires sign‑in and a premium subscription. Use the following test account with full access:

Email: googlereview@mathadventure.com
Password: Review2025!

Steps: Open app → “Sign In / Sign Up” → Sign in with the credentials above. All premium content (AI tutor, all concepts/difficulties, Parent Portal, challenges, messages) is unlocked for this account. No two‑step verification, no location restrictions, and no purchase or trial is required.
