import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * PremiumFeatureLock - Shows upgrade prompt for locked premium features
 * @param {Object} props
 * @param {string} props.featureName - Name of the locked feature
 * @param {string} props.description - Description of what's locked
 * @param {boolean} props.isOpen - Control visibility
 * @param {function} props.onClose - Close handler
 */
export default function PremiumFeatureLock({ 
  featureName = 'Premium Feature',
  description = 'This feature requires a premium subscription.',
  isOpen = true,
  onClose 
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full border-4 border-purple-300 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Lock className="w-6 h-6" />
            Premium Feature
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{featureName}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">Premium Features Include:</h4>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>✨ Unlimited games & challenges</li>
              <li>🤖 AI Tutor with hints & explanations</li>
              <li>🎨 Advanced avatar customization</li>
              <li>🏆 Exclusive pets & badges</li>
              <li>📊 Parent portal & analytics</li>
              <li>🎯 Ad-free experience</li>
            </ul>
          </div>

          <div className="flex gap-3">
            {onClose && (
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Maybe Later
              </Button>
            )}
            <Button
              onClick={() => navigate('/subscription')}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
