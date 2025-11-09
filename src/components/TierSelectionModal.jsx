import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Users, GraduationCap, Sparkles, Shield, Star, Zap, MessageSquare, BarChart3, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * TierSelectionModal - Let users choose subscription tier and billing period
 * Displays three tiers with feature comparison and monthly/yearly toggle
 */
export default function TierSelectionModal({ open, onOpenChange, onSelectTier, userEmail }) {
  const [billingPeriod, setBillingPeriod] = useState('yearly'); // yearly as default (better value)

  const tiers = [
    {
      id: 'premium_player',
      name: 'Premium Player',
      icon: Crown,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Perfect for individual students',
      monthlyPrice: 4.99,
      yearlyPrice: 47.99, // 12 * 4.99 = 59.88; save $11.89 (20%)
      features: [
        'Unlimited games',
        '80+ math concepts',
        'All difficulty levels',
        'AI Math Tutor',
        'Progress tracking',
        'Exclusive rewards',
        'No ads',
      ],
      badge: null,
    },
    {
      id: 'premium_parent',
      name: 'Premium Parent',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'For parents monitoring 1-3 kids',
      monthlyPrice: 7.99,
      yearlyPrice: 76.88, // 12 * 7.99 = 95.88; savings 19.00 (20%)
      features: [
        'Everything in Premium Player',
        'Parent Portal access',
        'Up to 3 child accounts',
        'Performance analytics',
        'Parental controls',
        'Weekly progress reports',
        'Direct messaging with kids',
        'Custom learning goals',
      ],
      badge: 'Most Popular',
    },
    {
      id: 'family_teacher',
      name: 'Family / Teacher',
      icon: GraduationCap,
      gradient: 'from-green-500 to-emerald-500',
      description: 'For families or classrooms (4-10 students)',
      monthlyPrice: 12.99,
      yearlyPrice: 124.88, // 12 * 12.99 = 155.88; savings 30.80 (20%)
      features: [
        'Everything in Premium Parent',
        'Up to 10 child accounts',
        'Team challenges',
        'Classroom leaderboards',
        'Bulk assignment tools',
        'Advanced analytics dashboard',
        'Priority email support',
        'Lesson planning resources',
      ],
      badge: 'Best Value',
    },
  ];

  const handleSelectTier = (tierId) => {
    onSelectTier({ tier: tierId, plan: billingPeriod, userEmail });
  };

  const calculateSavings = (tier) => {
    const monthlyTotal = tier.monthlyPrice * 12;
    const savings = monthlyTotal - tier.yearlyPrice;
    // We expect ~20% savings per your structure; still compute dynamically.
    const percentage = ((savings / monthlyTotal) * 100).toFixed(0);
    return { savings: savings.toFixed(2), percentage };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">Choose Your Plan</DialogTitle>
          <DialogDescription className="text-center text-base">
            Select the perfect subscription for your learning journey
          </DialogDescription>
        </DialogHeader>

        {/* Billing Period Toggle */}
        <div className="flex justify-center my-6">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={cn(
                'px-6 py-2 rounded-md font-medium transition-all',
                billingPeriod === 'monthly'
                  ? 'bg-white shadow-sm text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={cn(
                'px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2',
                billingPeriod === 'yearly'
                  ? 'bg-white shadow-sm text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Yearly
              <Badge className="bg-green-500 text-white text-xs">Save 20%</Badge>
            </button>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const price = billingPeriod === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice;
            const savings = billingPeriod === 'yearly' ? calculateSavings(tier) : null;

            return (
              <Card
                key={tier.id}
                className={cn(
                  'relative overflow-hidden border-2 transition-all hover:shadow-xl',
                  tier.badge === 'Most Popular' ? 'border-blue-400' : 'border-gray-200'
                )}
              >
                {tier.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      {tier.badge}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  {/* Icon & Title */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className={cn('w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center mb-4', tier.gradient)}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">${price}</span>
                      <span className="text-gray-600">/{billingPeriod === 'yearly' ? 'year' : 'month'}</span>
                    </div>
                    {billingPeriod === 'yearly' && savings && (
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-green-50 border-green-300 text-green-700">
                          Save ${savings.savings} ({savings.percentage}%)
                        </Badge>
                      </div>
                    )}
                    {billingPeriod === 'monthly' && (
                      <p className="text-xs text-gray-500 mt-2">
                        ${(price * 12).toFixed(2)}/year if billed monthly
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectTier(tier.id)}
                    className={cn(
                      'w-full h-12 text-base font-semibold',
                      tier.badge === 'Most Popular'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    )}
                  >
                    Get Started
                  </Button>

                  {billingPeriod === 'yearly' && (
                    <p className="text-xs text-center text-gray-500 mt-3">
                      7-day free trial • Cancel anytime
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>All plans include a 7-day free trial. Cancel anytime.</p>
          <p className="mt-1">✓ Secure payment • ✓ Money-back guarantee • ✓ Instant access</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
