// Centralized Square checkout links per tier and period
// To update: edit the URLs below or migrate to env vars if preferred.
// Tiers: 'premium_player' | 'premium_parent' | 'family_teacher'
// Periods: 'monthly' | 'yearly'

export const PAYMENT_LINKS = {
  premium_player: {
    monthly: "https://square.link/u/nFpI2tMT",
    yearly: "https://checkout.square.site/merchant/MLZ8SFCEGD55V/checkout/XKMFTRBKLNNDRTMQWSBJ4TOL",
  },
  premium_parent: {
    monthly: "https://square.link/u/mffPglOm",
    yearly: "https://checkout.square.site/merchant/MLZ8SFCEGD55V/checkout/LJ7EFZTE5IPACDT2HAO2H2IB",
  },
  family_teacher: {
    monthly: "https://square.link/u/bCQAOVfA",
    yearly: "https://checkout.square.site/merchant/MLZ8SFCEGD55V/checkout/VYNFU5WKRO4AU5KBQAG2S3NM",
  },
};

export function getPaymentLink(tier, period = 'monthly') {
  return PAYMENT_LINKS[tier]?.[period] || null;
}
