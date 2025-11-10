import React, { useMemo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Smartphone, Sparkles } from 'lucide-react';
import { PLAY_STORE_URL } from '@/lib/links';
import { analytics } from '@/firebaseConfig';
import { logEvent } from 'firebase/analytics';

/**
 * AppTrialPromo - Banner promoting Android app 7-day free trial
 * Use on web pages where we want to highlight Play Store trial availability.
 */
export default function AppTrialPromo({ compact = false, className = '', utmContent = 'app_trial_promo' }) {
  const urlWithUtm = useMemo(() => {
    try {
      const u = new URL(PLAY_STORE_URL);
      u.searchParams.set('utm_source', 'webapp');
      u.searchParams.set('utm_medium', 'banner');
      u.searchParams.set('utm_campaign', 'android_free_trial');
      u.searchParams.set('utm_content', utmContent);
      return u.toString();
    } catch {
      return PLAY_STORE_URL;
    }
  }, [utmContent]);

  const handleClick = () => {
    try {
      if (analytics) {
        logEvent(analytics, 'promo_click', {
          promo_name: 'android_free_trial',
          promo_position: utmContent,
          destination: 'google_play',
          platform: 'android',
          source: 'webapp',
        });
      }
    } catch {/* no-op */}
  };
  return (
    <Alert className={`bg-purple-50 border-purple-200 ${className}`}>
      <AlertDescription className="flex flex-col md:flex-row gap-3 md:items-center justify-between text-purple-900">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <div className="font-semibold">
              7-Day Free Trial in our Android App
            </div>
            {!compact && (
              <p className="text-sm text-purple-800">
                Download from Google Play and get a 7-day free trial on any plan. Web subscriptions do not include a trial.
              </p>
            )}
          </div>
        </div>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 whitespace-nowrap">
          <a href={urlWithUtm} onClick={handleClick} target="_blank" rel="noopener noreferrer" aria-label="Get the Android app on Google Play for a 7-day free trial">
            <Sparkles className="w-4 h-4 mr-2" /> Get the App
          </a>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
