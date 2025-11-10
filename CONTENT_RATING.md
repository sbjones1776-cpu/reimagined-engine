# Play Console – Content rating (IARC) cheat sheet

Use this checklist while completing the Content rating questionnaire in Google Play Console.

## Contact and category
- Contact email: `support@math-adventure.com`
- Category: `Game` (educational game)
- Accept IARC Terms and Conditions: Yes

## Audience and themes
- Target audience includes children (ages 5–12)
- Educational content: Yes (math learning, tutoring)
- Contains any of the following? Select No to all below:
  - Violence, gore, or realistic weapons: No
  - Sexual or suggestive content, nudity: No
  - Profanity or crude humor: No
  - Drugs, alcohol, tobacco: No
  - Horror/fear themes: No
  - Discrimination or hate speech: No
  - Gambling or simulated gambling: No

Expected result (IARC): ESRB Everyone / PEGI 3 (or regional equivalents)

## Interactive elements
- In-app purchases: Yes (subscriptions; no loot boxes)
- Ads: No (no third‑party ads)
- User to user communication: No (no chat/DM/UGC)
- Users can interact or exchange content: No
- Shares location or requires location: No
- Shares personal information: No (standard Firebase auth profile only; see Data safety for details)
- Account required to access some features: Yes (sign‑in to save progress, access Parent Portal)

Notes:
- Leaderboards and team challenges, if enabled, do not include open chat or free‑form user content; display names only. If your build includes any chat/UGC, answer “Yes” for user interaction and add details.

## Regional specifics occasionally asked by IARC
- Online gameplay enabling player communication: No
- Real‑money prizes or contests: No
- Therapy/medical treatment claims: No

## Data safety (separate section in Play Console)
- Data collected: email, display name, gameplay progress, purchase status
- Data sharing: No third‑party sharing
- Security: encrypted in transit and at rest (Firebase)
- Parental controls and deletion: supported

## Paste‑ready summary
Educational math game for children. No violence, sexual content, profanity, drugs, or gambling. No ads. Some features require sign‑in to save progress. Subscriptions available via Google Play Billing. No user‑to‑user communication or user‑generated content.

---

If any product decision changes (ads, chat, UGC), update this file and re‑run the questionnaire to avoid rating violations.