/**
 * billingService.js
 * Unified web billing service that prefers Google Play Billing via Digital Goods API
 * and falls back to existing external (Square) checkout flow.
 *
 * Contract:
 *   initBilling(): Detects environment & preloads product details.
 *   isPlayBillingAvailable(): boolean
 *   listProducts(): [{ id, title, description, price, period, platform }]
 *   purchaseSubscription(productId): { success, platform, token? }
 *
 * Play Flow Overview:
 *   1. Detect window.getDigitalGoodsService & origin trial (must be served inside TWA).
 *   2. Query products (monthly/yearly) using getDetails(). Product IDs must match Play Console.
 *   3. Call purchase(productId) -> returns purchase token.
 *   4. Send token to backend verify function (to be implemented) which validates via Android Publisher API.
 *   5. Backend updates Firestore: entitlements.premium=true, subscription metadata.
 *
 * Fallback Flow (Square):
 *   - Opens external checkout page (existing implementation).
 *
 * Edge Cases:
 *   - Digital Goods API not available.
 *   - Product ID mismatch / not published yet (returns empty details).
 *   - User cancels purchase (catch & return { success:false, canceled:true }).
 *   - Network errors during verification.
 */

// Internal state
let playService = null;
let playProductsCache = null;
let initializing = false;
let initialized = false;

// Product mapping: Replace with your real Play product IDs (managed products or subs)
// These should correspond to subscription base plans or product IDs in Play Console.
const PRODUCT_CONFIG = {
  monthly: {
    id: import.meta.env.VITE_PLAY_MONTHLY_ID || 'play_monthly_sub',
    fallbackPlanId: 'MONTHLY_PLAN_ID', // Square plan variation ID
    period: 'P1M'
  },
  yearly: {
    id: import.meta.env.VITE_PLAY_YEARLY_ID || 'play_yearly_sub',
    fallbackPlanId: 'ANNUAL_PLAN_ID',
    period: 'P1Y'
  }
};

export function isPlayBillingAvailable() {
  return !!playService;
}

export async function initBilling() {
  if (initialized || initializing) return playProductsCache;
  initializing = true;

  // Detect Digital Goods API
  try {
    if (typeof window !== 'undefined' && window.getDigitalGoodsService) {
      playService = await window.getDigitalGoodsService('googleplay');
    }
  } catch (e) {
    console.debug('[billing] Digital Goods API not available or failed to init:', e.message);
    playService = null;
  }

  if (playService) {
    try {
      const productIds = Object.values(PRODUCT_CONFIG).map(p => p.id);
      const details = await playService.getDetails(productIds);
      // Normalize details
      playProductsCache = details.map(d => ({
        id: d.id,
        title: d.title,
        description: d.description,
        price: d.pricing?.price || d.pricing?.formattedPrice || '—',
        period: d.subscriptionPeriod || PRODUCT_CONFIG.monthly.period,
        platform: 'googleplay'
      }));
    } catch (err) {
      console.warn('[billing] Failed to fetch Play product details:', err);
      playProductsCache = [];
    }
  } else {
    playProductsCache = [];
  }

  initialized = true;
  initializing = false;
  return playProductsCache;
}

export function listProducts() {
  // Return play products if available else synthesized fallback info
  if (playProductsCache && playProductsCache.length) return playProductsCache;
  return Object.values(PRODUCT_CONFIG).map(cfg => ({
    id: cfg.id,
    title: cfg.id.includes('year') ? 'Annual Subscription' : 'Monthly Subscription',
    description: 'Access all premium learning features.',
    price: cfg.id.includes('year') ? '$79.99' : '$9.99',
    period: cfg.period,
    platform: playService ? 'googleplay' : 'external'
  }));
}

/**
 * purchaseSubscription(productId)
 * Attempts Play Billing; if unavailable, returns a signal to use external flow.
 * Returns: { success, platform, token?, externalRequired?, canceled?, error? }
 */
export async function purchaseSubscription(productId) {
  await initBilling();
  if (!playService) {
    return { success: false, platform: 'external', externalRequired: true };
  }
  try {
    const purchase = await playService.purchase(productId);
    if (!purchase) {
      return { success: false, platform: 'googleplay', canceled: true };
    }
    const token = purchase.purchaseToken || purchase.token; // API variant compatibility
    if (!token) {
      return { success: false, platform: 'googleplay', error: 'Missing purchase token' };
    }
    return { success: true, platform: 'googleplay', token };
  } catch (err) {
    // Distinguish cancellation vs error
    const canceled = /cancel/i.test(err.message);
    return { success: false, platform: 'googleplay', canceled, error: canceled ? undefined : err.message };
  }
}

/**
 * verifyPlayPurchase(token, productId, userEmail)
 * Sends purchase token to backend verification (to implement).
 */
export async function verifyPlayPurchase(token, productId, userEmail) {
  if (!token) throw new Error('Missing Play purchase token');
  const functionUrl = import.meta.env.VITE_FUNCTIONS_URL || 'https://your-project.cloudfunctions.net';
  const res = await fetch(`${functionUrl}/verifyPlayPurchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, productId, email: userEmail })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Play purchase verification failed');
  }
  return data; // Expected { success:true, entitlementGranted:true }
}

/**
 * fallbackToExternalCheckout()
 * Opens existing external subscription page (Square) with disclosure.
 */
export function fallbackToExternalCheckout() {
  const checkoutUrl = import.meta.env.VITE_CHECKOUT_URL || 'https://yourdomain.com/subscribe';
  window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
}

// Convenience combined flow
export async function startUnifiedSubscription(productKey, userEmail) {
  const cfg = PRODUCT_CONFIG[productKey];
  if (!cfg) throw new Error('Unknown product key');
  const result = await purchaseSubscription(cfg.id);
  if (result.externalRequired) {
    fallbackToExternalCheckout();
    return { routedExternal: true };
  }
  if (result.canceled) return { canceled: true };
  if (!result.success) return { error: result.error || 'Purchase failed' };
  // Verify
  const verify = await verifyPlayPurchase(result.token, cfg.id, userEmail);
  return { success: true, verify };
}

export const __internal = { PRODUCT_CONFIG };
