import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown, Check, Sparkles, Users, GraduationCap, Star, Shield, Target, MessageSquare, BarChart3, Clock, Lock, CreditCard, XCircle, AlertTriangle, CheckCircle, ExternalLink, Globe } from "lucide-react";
import { format } from "date-fns";
import UpgradeButton from "@/components/UpgradeButton";

export default function Subscription() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isExternalBrowser, setIsExternalBrowser] = useState(false);

  // Detect if user is in external browser or in-app
  useEffect(() => {
    // Check if we're in a standalone PWA or external browser
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                      || window.navigator.standalone 
                      || document.referrer.includes('android-app://');
    
    setIsExternalBrowser(!isStandalone);
  }, []);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      // TODO: Replace with Firebase query
      return { 
        email: 'user@example.com',
        subscription_tier: 'free',
        subscription_expires_at: null,
        subscription_auto_renew: false
      };
    },
    initialData: { 
      email: 'user@example.com',
      subscription_tier: 'free',
      subscription_expires_at: null,
      subscription_auto_renew: false
    },
  });

  // Check for success redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const tier = urlParams.get('tier');
    
    if (success === 'true' && tier) {
      // Show success message
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }, 1000);
    }
  }, [queryClient]);

  const currentTier = user?.subscription_tier || "free";
  const isSubscribed = currentTier !== "free";
  const subscriptionExpires = user?.subscription_expires_at ? new Date(user.subscription_expires_at) : null;
  const daysUntilRenewal = subscriptionExpires ? Math.ceil((subscriptionExpires - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  // Direct Square payment links for each plan
  // Payment links for monthly and yearly options
  const paymentLinks = {
    premium_player: {
      monthly: "https://square.link/u/nFpI2tMT",
      yearly: "https://checkout.square.site/merchant/MLZ8SFCEGD55V/checkout/XKMFTRBKLNNDRTMQWSBJ4TOL"
    },
    premium_parent: {
      monthly: "https://square.link/u/mffPglOm",
      yearly: "https://checkout.square.site/merchant/MLZ8SFCEGD55V/checkout/LJ7EFZTE5IPACDT2HAO2H2IB"
    },
    family_teacher: {
      monthly: "https://square.link/u/bCQAOVfA",
      yearly: "https://checkout.square.site/merchant/MLZ8SFCEGD55V/checkout/VYNFU5WKRO4AU5KBQAG2S3NM"
    }
  };

  const handleSubscribe = (tier, period = "monthly") => {
    if (!isExternalBrowser) {
      alert("Please open this page in your web browser to subscribe. Use the 'Open in Browser' button above.");
      return;
    }
    const url = paymentLinks[tier]?.[period];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('No payment link available for this plan and period.');
    }
  };

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      // TODO: Implement Firebase subscription cancellation
      console.log('Subscription cancel request');
      alert('Subscription cancellation is currently being migrated to Firebase. This feature will be available soon!');
      throw new Error('Subscription cancel pending implementation');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setShowCancelConfirm(false);
    },
  });

  const plans = [
    {
      id: "premium_player",
      name: "Premium Player",
      price: "$4.99",
      annualPrice: "$47.88",
      annualSavings: "Save $12",
      icon: Star,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Unlimited games & challenges",
        "Advanced avatar customization",
        "Exclusive pets & badges",
        "Ad-free experience",
        "Priority support",
        "Offline mode",
        "Custom themes",
      ],
      recommended: false,
    },
    {
      id: "premium_parent",
      name: "Premium Parent",
      price: "$7.99",
      annualPrice: "$76.88",
      annualSavings: "Save $19",
      icon: Shield,
      color: "from-purple-500 to-pink-500",
      features: [
        "All Premium Player features",
        "Advanced parental controls",
        "Detailed progress analytics",
        "Custom goal setting",
        "Time limit management",
        "Content filtering",
        "Weekly/monthly reports",
        "Direct messaging with child",
      ],
      recommended: true,
    },
    {
      id: "family_teacher",
      name: "Family/Teacher Plan",
      price: "$12.99",
      annualPrice: "$124.88",
      annualSavings: "$31",
      icon: Users,
      color: "from-orange-500 to-red-500",
      features: [
        "All Premium Parent features",
  "Up to 10 student accounts",
        "Classroom management tools",
        "Lesson assignment system",
        "Team challenges",
        "Bulk progress reports",
        "Multi-child dashboard",
        "Priority teacher support",
      ],
      recommended: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* In-App Browser Warning */}
      {!isExternalBrowser && (
        <Alert className="mb-8 bg-blue-50 border-blue-300">
          <Globe className="w-5 h-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <strong className="block mb-1">Subscriptions Available on Web</strong>
                <p className="text-sm">To subscribe or manage your subscription, please open this page in your web browser (Chrome, Safari, etc.)</p>
              </div>
              <Button 
                onClick={() => {
                  const url = window.location.href;
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Browser
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
            <Crown className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
          Unlock Premium Features
        </h1>
        <p className="text-xl text-gray-600 mb-2">Choose the perfect plan for your learning journey</p>
        <p className="text-md text-green-600 mb-2 font-semibold">Save 20% when you purchase any yearly plan!</p>
        {isExternalBrowser && (
          <p className="text-sm text-gray-500">Secure payment powered by Square</p>
        )}
      </div>

      {/* Current Subscription Status */}
      {isSubscribed && (
        <Card className="mb-12 border-4 border-green-400 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {currentTier === "premium_parent" ? "Premium Parent" : 
                       currentTier === "premium_player" ? "Premium Player" : 
                       "Family/Teacher Plan"}
                    </h3>
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  </div>
                  <div className="space-y-1">
                    {subscriptionExpires && (
                      <p className="text-gray-600">
                        {user?.subscription_auto_renew === false 
                          ? `Expires ${format(subscriptionExpires, 'MMMM d, yyyy')}`
                          : `Renews ${format(subscriptionExpires, 'MMMM d, yyyy')} • ${daysUntilRenewal} days left`
                        }
                      </p>
                    )}
                    {user?.subscription_auto_renew === false && (
                      <Badge variant="outline" className="bg-orange-50 border-orange-300 text-orange-700">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Subscription will not renew
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {user?.subscription_auto_renew !== false && isExternalBrowser && (
                <Button
                  variant="destructive"
                  onClick={() => setShowCancelConfirm(true)}
                  className="h-12"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert className="mb-8 bg-red-50 border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {new URLSearchParams(window.location.search).get('success') === 'true' && (
        <Alert className="mb-8 bg-green-50 border-green-200">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Success!</strong> Your subscription is being activated. This may take a few moments.
          </AlertDescription>
        </Alert>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentTier === plan.id;

          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 ${
                plan.recommended
                  ? "border-4 border-purple-400 shadow-2xl scale-105"
                  : "border-2 border-gray-200 hover:shadow-xl hover:scale-102"
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}

              <div className={`h-32 bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                <Icon className="w-16 h-16 text-white" />
              </div>

              <CardHeader>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-700">{plan.annualPrice}/year</span>
                      <Badge className="bg-green-500 text-white text-xs">{plan.annualSavings}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <Button disabled className="w-full h-12 bg-gray-400 cursor-not-allowed">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Current Plan
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleSubscribe(plan.id, "monthly")}
                      disabled={loading || !isExternalBrowser}
                      className={`w-full h-12 text-lg bg-gradient-to-r ${plan.color} hover:opacity-90 ${
                        !isExternalBrowser ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Processing...
                        </>
                      ) : !isExternalBrowser ? (
                        <>
                          <Lock className="w-5 h-5 mr-2" />
                          Open in Browser
                        </>
                      ) : (
                        <>
                          <Crown className="w-5 h-5 mr-2" />
                          Subscribe Monthly
                        </>
                      )}
                    </Button>
                    {isExternalBrowser && (
                      <Button
                        onClick={() => handleSubscribe(plan.id, "yearly")}
                        disabled={loading}
                        variant="outline"
                        className="w-full h-12"
                      >
                        {loading ? (
                          'Processing...'
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Subscribe Annually (Save 20%)
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <Card className="mb-12">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-2xl">Compare Features</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-4 font-bold">Feature</th>
                  <th className="text-center p-4 font-bold">Free</th>
                  <th className="text-center p-4 font-bold">Premium Player</th>
                  <th className="text-center p-4 font-bold bg-purple-50">Premium Parent</th>
                  <th className="text-center p-4 font-bold">Family/Teacher</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Math Games Access</td>
                  <td className="text-center p-4">
                    <Badge variant="outline">Limited</Badge>
                  </td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4 bg-purple-50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Daily Challenges</td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4 bg-purple-50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">AI Tutor Help</td>
                  <td className="text-center p-4">
                    <Badge variant="outline">Limited</Badge>
                  </td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4 bg-purple-50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Parental Controls</td>
                  <td className="text-center p-4">—</td>
                  <td className="text-center p-4">—</td>
                  <td className="text-center p-4 bg-purple-50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Progress Analytics</td>
                  <td className="text-center p-4">
                    <Badge variant="outline">Basic</Badge>
                  </td>
                  <td className="text-center p-4">
                    <Badge variant="outline">Basic</Badge>
                  </td>
                  <td className="text-center p-4 bg-purple-50">
                    <Badge className="bg-purple-500 text-white">Advanced</Badge>
                  </td>
                  <td className="text-center p-4">
                    <Badge className="bg-orange-500 text-white">Advanced</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Number of Students</td>
                  <td className="text-center p-4">1</td>
                  <td className="text-center p-4">1</td>
                  <td className="text-center p-4 bg-purple-50">1</td>
                  <td className="text-center p-4">
                    <Badge className="bg-orange-500 text-white">Up to 10</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-600">
              Yes! You can cancel your subscription at any time from this page. You'll continue to have access until the end of your billing period.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept all major credit cards (Visa, Mastercard, American Express) and debit cards through our secure payment provider, Square.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Is there a free trial?</h3>
            <p className="text-gray-600">
              The free version gives you access to basic features to try out the app. Premium features are available immediately upon subscription.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">What's the difference between monthly and annual plans?</h3>
            <p className="text-gray-600">
              Annual plans save you 20% compared to monthly subscriptions. You pay upfront for the year and get uninterrupted access to all premium features.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Can I upgrade or downgrade my plan?</h3>
            <p className="text-gray-600">
              Yes! Contact our support team and we'll help you switch plans. Changes typically take effect at the start of your next billing cycle.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full border-4 border-red-300">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-6 h-6" />
                Cancel Subscription?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700">
                Are you sure you want to cancel your subscription?
              </p>
              
              <Alert className="bg-yellow-50 border-yellow-300">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 text-sm">
                  You'll lose access to premium features when your current billing period ends on {subscriptionExpires ? format(subscriptionExpires, 'MMMM d, yyyy') : 'the end date'}.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => cancelSubscriptionMutation.mutate()}
                  disabled={cancelSubscriptionMutation.isPending}
                >
                  {cancelSubscriptionMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
