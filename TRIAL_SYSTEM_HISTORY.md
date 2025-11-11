# 7-Day Trial System (Historical Documentation)

Status: Deprecated / Removed as of 2025-11-10 (Banner component now a no-op; trial fields no longer created for new users.)  
Scope: Originally implemented for both Web (React + Firebase Hosting) and Android TWA (Trusted Web Activity) with unified Firestore-backed user documents.

---

## 1. Overview
The 7-day free trial granted full premium access to brand-new users immediately upon signup—without requiring payment. During the trial window users experienced unrestricted premium features (AI Tutor, expanded game operations/levels, premium shop items, Parent Portal, etc.). After expiration, access reverted to the free tier unless a subscription was purchased.

Key goals:
1. Frictionless onboarding (instant premium access).
2. Urgency via countdown and escalating visual states.
3. Seamless upgrade path ("Upgrade Now" button linking to subscription flow).

## 2. Firestore Data Model (per user document)
Originally added fields (now omitted for new accounts):
| Field | Type | Purpose |
|-------|------|---------|
| `trial_start_date` | Timestamp | When the trial began (on first profile creation). |
| `trial_expires_at` | Timestamp | Computed = `trial_start_date + 7 days`. |
| `trial_used` | Boolean | Hard stop: set true once expired to prevent re-issue. |

Other existing subscription fields continued to apply (`subscription_tier`, etc.). Trial logic only applied while `subscription_tier === 'free'`.

## 3. Derived User State (web-only convenience properties)
Calculated in the user hook before deprecation:
- `user.isOnTrial` — Active countdown (now always false for new users).
- `user.trialDaysRemaining` — Integer days (0–7 inclusive).
- `user.trialExpired` — True once `now >= trial_expires_at` and still free tier.
- `user.hasPremiumAccess` — True if trial active OR non-free subscription.

Currently (post-removal) only `hasPremiumAccess` remains, simplified to subscription check.

## 4. Helper Functions (historical signatures)
Located in `src/utils/trialHelpers.js` (now pared down):
- `isOnTrial(user)` — Returns true if within window and user remains on free tier.
- `isTrialExpired(user)` — Returns true once end timestamp passed.
- `getTrialDaysRemaining(user)` — Ceiling of (expiresAt - now) in days.
- `hasPremiumAccess(user)` — Trial OR paid subscription. (Now: only paid subscription.)
- `getTrialStatusMessage(user)` — Human-readable status (removed trial messaging; returns simplified text now).

## 5. Trial Banner Component
File: `src/components/TrialBanner.jsx`.

Behavior (when active historically):
- Visible if `user.isOnTrial` OR `user.trialExpired`.
- Style states:
  - Active (>2 days left): Blue theme.
  - Urgent (≤2 days left, not expired): Orange theme emphasizing countdown.
  - Expired: Red theme urging upgrade.
- CTA: "Upgrade Now" navigated to `/subscription` page.
- Dismiss: Session-level state allowing temporary hiding (not persisted).

Current state: Component returns `null` immediately (no-op) to avoid code removal ripple effects.

## 6. Android TWA Integration
The Android application (Trusted Web Activity) simply mirrored the hosted web experience. No native trial logic existed; updates propagated automatically via deployed web release. Therefore, trial enable/disable required only Firebase Hosting deployments—no Gradle version bump unless unrelated Android changes were present.

## 7. Expiration Logic Details
Computation: `trial_expires_at = trial_start_date + (7 * 24h)` at user profile creation.  
Edge Handling:
- Clock drift: Relied on client Date; Firestore server timestamps used only for creation. (Acceptable tolerance for short trial window.)
- Safeguard with `trial_used` prevents future reinstatement even if dates manipulated.
- Upgrade mid-trial: Subscription tier change short-circuited trial checks—premium access persisted without red "expired" banner.

## 8. Removal / Deprecation (2025-11-10)
Changes enacted:
1. Profile creation (`createUserProfile`) no longer sets any trial fields.
2. Helper functions simplified; trial conditional branches removed.
3. User state hook stopped deriving trial booleans and countdown.
4. `TrialBanner` component turned into a no-op placeholder.
5. Any trial promo components (e.g. `AppTrialPromo.jsx`) converted to no-op.
6. Upgrade logic relies solely on paid subscription detection.

## 9. Reactivation Steps (If Needed Later)
To re-enable the trial system:
1. Reintroduce trial fields in `createUserProfile` when absent:
   - On user creation: set `trial_start_date = serverTimestamp()` and `trial_expires_at = Timestamp.fromDate(new Date(Date.now() + 7*24*60*60*1000))`.
2. Restore full helper logic in `trialHelpers.js` (remove simplified return values).
3. Reinstate derived state in `useFirebaseUser` (compute trial flags and days remaining).
4. Remove the early `return null` in `TrialBanner.jsx` and re-enable UI conditions.
5. Audit premium gating components (`PremiumFeatureLock`) to allow trial path as premium.
6. Add analytics events (optional) for conversion funnel: trial start, day thresholds, expiration, upgrade.
7. Consider server enforcement for consistency (Cloud Functions scheduled job to mark `trial_used` on expiration). Optional but improves integrity.

## 10. Edge Cases & Considerations
- User signs up then never returns until after 7 days: Will land directly in expired free state—was handled by expired banner (now retired).
- Timezone variance: Using absolute UTC timestamps avoids timezone pitfalls; displayed days were calculated client-side.
- Multiple accounts: `trial_used` only tracked per email; no device fingerprinting performed.
- Data tampering: Client-only logic allowed potential local banner manipulation; premium access still required subscription tier changes validated by backend purchase verification.

## 11. Security & Integrity Notes
- Subscription elevation (`subscription_tier`) driven by backend purchase validation—trial logic never altered this field.
- Trial removal reduces surface area for misuse and simplifies premium enforcement.

## 12. Migration Impact
- Existing user documents retaining legacy trial fields are benign; helper functions now ignore them for premium calculation.
- No schema migration required—fields may naturally phase out over time.

## 13. Future Improvements (If Reintroduced)
- Convert countdown to server authoritative calculation to prevent client clock exploits.
- Add push notification / email nudge on day 6.
- Progressive feature soft limits during trial (e.g., gamified warnings) instead of abrupt banner escalation.
- A/B test trial length (3 vs 7 vs 14 days) and measure conversion.

## 14. Quick Reference (Historical API Contract)
Inputs: `user` Firestore document.  
Outputs (derived): `isOnTrial (bool)`, `trialDaysRemaining (0–7)`, `trialExpired (bool)`, `hasPremiumAccess (bool)`.  
Error Modes: Missing timestamps → treat as no trial; upgraded tier supersedes trial; expired sets `trial_used`.

## 15. Current Minimal State (Post-Removal)
Active code paths now treat all users without a paid subscription as strictly "free" with gating handled by `PremiumFeatureLock`. The historical trial system is preserved here solely for knowledge continuity.

---
Maintainer Note: This document should remain in the repository to clarify why dormant components (e.g., `TrialBanner.jsx` returning `null`) still exist and how to restore functionality if business strategy changes.
