import { describe, it, expect, vi, beforeEach } from 'vitest'

// We'll import dynamically inside tests after setting up environment mocks

const mockDetails = [{
  id: 'play_monthly_sub',
  title: 'Monthly',
  description: 'Monthly plan',
  pricing: { formattedPrice: '$9.99' },
  subscriptionPeriod: 'P1M'
}]

describe('billingService hybrid behavior', () => {
  beforeEach(() => {
    vi.resetModules()
    // clean window mocks
    delete window.getDigitalGoodsService
    vi.restoreAllMocks()
  })

  it('falls back to external when Digital Goods API is unavailable', async () => {
    // import module fresh
    const mod = await import('../billingService.js')
    const { purchaseSubscription } = mod

    const res = await purchaseSubscription('some_product')
    expect(res.externalRequired).toBe(true)
    expect(res.platform).toBe('external')
  })

  it('uses Play Billing when Digital Goods API is available', async () => {
    // Mock Digital Goods API
    window.getDigitalGoodsService = vi.fn(async () => ({
      getDetails: vi.fn(async () => mockDetails),
      purchase: vi.fn(async (productId) => {
        expect(productId).toBeDefined()
        return { purchaseToken: 'tok_123' }
      })
    }))

    // Mock fetch verification
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    })

    // Set env required by code
    // Vitest with Vite exposes import.meta.env; ensure function URL exists
    // We'll just rely on default in code if not provided.

    const mod = await import('../billingService.js')
    const { startUnifiedSubscription } = mod

    const out = await startUnifiedSubscription('monthly', 'test@example.com')
    expect(out.success).toBe(true)
    expect(fetchSpy).toHaveBeenCalled()
  })
})
