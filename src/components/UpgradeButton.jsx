import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Crown, ExternalLink, Check, Sparkles, Zap, Shield, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { startUnifiedSubscription, isPlayBillingAvailable, initBilling, fallbackToExternalCheckout } from '@/api/billingService';
import { toast } from 'sonner';
import TierSelectionModal from './TierSelectionModal';

/**
 * UpgradeButton - Opens tier selection modal, then handles purchase
 * Shows Google-required disclosure for external checkout when needed
 */
export default function UpgradeButton({ variant = 'default', size = 'default', className = '', fullWidth = false, userEmail }) {
  const [showTierModal, setShowTierModal] = useState(false);
  const [showDisclosure, setShowDisclosure] = useState(false);
  const [playReady, setPlayReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  // Prepare billing detection on mount
  React.useEffect(() => {
    (async () => {
      try {
        await initBilling();
        setPlayReady(isPlayBillingAvailable());
      } catch {
        setPlayReady(false);
      }
    })();
  }, []);

  const handleTierSelected = async (selection) => {
    setSelectedTier(selection);
    setShowTierModal(false);
    
    // Check if we need disclosure (external checkout)
    if (!playReady) {
      setShowDisclosure(true);
      return;
    }
    
    // Direct to Play Billing
    await handlePurchase(selection);
  };

  const handlePurchase = async (selection) => {
    const { tier, plan, userEmail: email } = selection || selectedTier;
    const productKey = `${tier}_${plan}`;
    
    if (playReady) {
      setLoading(true);
      try {
        const result = await startUnifiedSubscription(productKey, email || userEmail);
        if (result?.success) {
          toast.success('Subscription activated! 🎉');
          setShowDisclosure(false);
        } else if (result?.canceled) {
          toast('Purchase canceled');
        } else if (result?.routedExternal) {
          toast('Opening external checkout...');
        } else if (result?.error) {
          toast.error(result.error || 'Purchase failed');
        }
      } catch (e) {
        console.error('Upgrade failed', e);
        toast.error(e.message || 'Purchase failed');
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // Fallback to external checkout
    fallbackToExternalCheckout();
    toast('Redirecting to secure checkout...');
    setShowDisclosure(false);
  };

  const premiumFeatures = [
    { icon: Zap, text: 'Unlimited Games', description: 'Play as much as you want' },
    { icon: Sparkles, text: 'AI Math Tutor', description: 'Get help 24/7' },
    { icon: Shield, text: 'Parent Portal', description: 'Full analytics & controls' },
    { icon: Star, text: 'Exclusive Rewards', description: 'Premium pets & badges' },
  ];

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowTierModal(true)}
        className={`${fullWidth ? 'w-full' : ''} ${className} bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700`}
      >
        <Crown className="w-4 h-4 mr-2" />
        Upgrade to Premium
      </Button>

      <TierSelectionModal
        open={showTierModal}
        onOpenChange={setShowTierModal}
        onSelectTier={handleTierSelected}
        userEmail={userEmail}
      />

      <Dialog open={showDisclosure} onOpenChange={setShowDisclosure}>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="w-6 h-6 text-purple-600" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            Unlock unlimited learning and exclusive features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Premium Features */}
          <div className="space-y-3">
            {premiumFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="border-purple-200">
                  <CardContent className="p-3 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{feature.text}</h4>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Google-Required Disclosure (shown only when using external checkout) */}
          {!playReady && (
            <Alert className="bg-blue-50 border-blue-200">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-800">
                <strong>Important:</strong> You will be redirected to an external website to complete your purchase. 
                This purchase is not affiliated with or managed by Google Play.
              </AlertDescription>
            </Alert>
          )}

          {/* Benefits Summary */}
          <div className="text-center text-xs text-gray-500">
            ✓ Cancel anytime • ✓ 7-day free trial • ✓ Secure checkout
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={() => handlePurchase()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
            disabled={loading}
          >
            {playReady ? 'Continue to Purchase' : 'Continue to Checkout'}
            {loading ? null : <ExternalLink className="w-4 h-4 ml-2" />}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowDisclosure(false)}
            className="w-full"
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
