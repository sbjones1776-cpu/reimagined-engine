import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Crown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUser } from '@/hooks/UserProvider';

export default function TrialBanner() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = React.useState(false);

  // Don't show if dismissed, no user, or user has paid subscription
  if (dismissed || !user || (user.subscription_tier && user.subscription_tier !== 'free')) {
    return null;
  }

  // Only show during active trial or just after expiration
  const showBanner = user.isOnTrial || user.trialExpired;
  
  if (!showBanner) return null;

  const isExpired = user.trialExpired;
  const daysLeft = user.trialDaysRemaining || 0;

  return (
    <Alert 
      className={`mb-4 ${
        isExpired 
          ? 'bg-red-50 border-red-300' 
          : daysLeft <= 2 
          ? 'bg-orange-50 border-orange-300' 
          : 'bg-blue-50 border-blue-300'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {isExpired ? (
            <Crown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          ) : (
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          )}
          <AlertDescription className={isExpired ? 'text-red-800' : 'text-blue-800'}>
            <div className="space-y-2">
              {isExpired ? (
                <>
                  <p className="font-semibold text-lg">Your 7-day trial has ended</p>
                  <p className="text-sm">
                    You're now on the free plan with limited access. Upgrade to continue enjoying premium features like unlimited games, AI tutor, and more!
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-lg">
                    {daysLeft === 0 ? '⏰ Trial ends today!' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left in your trial`}
                  </p>
                  <p className="text-sm">
                    You're currently enjoying premium features. Upgrade now to keep unlimited access after your trial ends!
                  </p>
                </>
              )}
            </div>
          </AlertDescription>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/subscription')}
            className={`${
              isExpired 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white whitespace-nowrap`}
            size="sm"
          >
            <Crown className="w-4 h-4 mr-1" />
            Upgrade Now
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
}
