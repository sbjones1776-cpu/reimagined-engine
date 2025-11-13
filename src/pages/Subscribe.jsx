import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/UserProvider.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Crown, Check, Loader2, CheckCircle } from 'lucide-react';

/**
 * Subscribe page - External checkout with Square Web Payments SDK
 * This page should be hosted on your domain (e.g., yourdomain.com/subscribe)
 * Can also be included in the app for in-app checkout flow
 */
export default function Subscribe() {
  const { user, loading: authLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = {
    monthly: {
      id: 'MONTHLY_PLAN_ID', // Replace with your Square plan ID
      name: 'Monthly',
      price: '$9.99',
      priceValue: 9.99,
      interval: 'per month',
      savings: null,
    },
    annual: {
      id: 'ANNUAL_PLAN_ID', // Replace with your Square plan ID
      name: 'Annual',
      price: '$79.99',
      priceValue: 79.99,
      interval: 'per year',
      savings: 'Save 33%',
    },
  };

  useEffect(() => {
    // Load Square Web Payments SDK
    const script = document.createElement('script');
    script.src = 'https://web.squarecdn.com/v1/square.js';
    script.async = true;
    script.onload = initializeSquare;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeSquare = async () => {
    if (!window.Square) {
      console.error('Square.js failed to load');
      return;
    }

    try {
      // Replace with your Square Application ID
      const applicationId = process.env.VITE_SQUARE_APP_ID || 'YOUR_SQUARE_APP_ID';
      const locationId = process.env.VITE_SQUARE_LOCATION_ID || 'YOUR_LOCATION_ID';

      const payments = window.Square.payments(applicationId, locationId);
      const card = await payments.card();
      await card.attach('#card-container');

      // Store card instance for later use
      window.squareCard = card;
    } catch (e) {
      console.error('Square initialization failed:', e);
      setError('Payment system failed to load. Please refresh and try again.');
    }
  };

  const handleSubscribe = async () => {
    if (!user?.email) {
      setError('Please sign in to subscribe');
      return;
    }

    if (!window.squareCard) {
      setError('Payment form not ready. Please wait a moment.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Tokenize card
      const result = await window.squareCard.tokenize();
      
      if (result.status !== 'OK') {
        throw new Error(result.errors?.[0]?.message || 'Card tokenization failed');
      }

      const sourceId = result.token;
      const plan = plans[selectedPlan];

      // Call your Cloud Function to create subscription
      const functionUrl = process.env.VITE_FUNCTIONS_URL || 'https://your-project.cloudfunctions.net';
      const response = await fetch(`${functionUrl}/createSubscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          planId: plan.id,
          sourceId: sourceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setSuccess(true);
      
      // Redirect back to app after 3 seconds
      setTimeout(() => {
        window.location.href = process.env.VITE_APP_URL || 'https://math-adventure-app.web.app/';
      }, 3000);

    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.message || 'Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Please sign in to subscribe</p>
            <Button onClick={() => window.location.href = '/'} className="mt-4">
              Go to App
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Premium! 🎉</h2>
            <p className="text-gray-600 mb-4">
              Your subscription is now active. Redirecting you back to the app...
            </p>
            <Loader2 className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 py-8 overflow-x-hidden">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Upgrade to Premium</h1>
          <p className="text-gray-600 break-words">Unlock unlimited learning for {user.email}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Plan Selection */}
          {Object.entries(plans).map(([key, plan]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all ${
                selectedPlan === key
                  ? 'border-purple-500 ring-2 ring-purple-200 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedPlan(key)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg break-words">{plan.name}</h3>
                    <p className="text-xl sm:text-2xl font-bold text-purple-600">{plan.price}</p>
                    <p className="text-sm text-gray-600 break-words">{plan.interval}</p>
                  </div>
                  {selectedPlan === key && (
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                {plan.savings && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    {plan.savings}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Square Card Container */}
            <div id="card-container" className="min-h-[100px]"></div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base sm:text-lg"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Subscribe - {plans[selectedPlan].price}</>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 break-words">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
              Your subscription will automatically renew. Cancel anytime.
            </p>
          </CardContent>
        </Card>

        {/* Features Reminder */}
        <Card className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="font-bold mb-3">Included in Premium:</h3>
            <ul className="space-y-2">
              {[
                'Unlimited games - play as much as you want',
                'AI Math Tutor with instant help',
                'Parent Portal with full analytics',
                'Team Challenges - create unlimited',
                'Exclusive rewards and badges',
                'Priority support',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm min-w-0">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="flex-1 min-w-0 break-words">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
