import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Crown, UserPlus } from "lucide-react";

export default function AdminTestAccount() {
  const [email, setEmail] = useState("googlereview@mathadventure.com");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleGrantAccess = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Find the user by email
      const allUsers = await base44.entities.User.list();
      const user = allUsers.find(u => u.email === email);

      if (!user) {
        throw new Error(`User with email ${email} not found. Please create the account first.`);
      }

      // Grant full premium access
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year from now

      await base44.entities.User.update(user.id, {
        subscription_tier: "family_teacher",
        subscription_started_at: new Date().toISOString(),
        subscription_expires_at: expiresAt.toISOString(),
        subscription_auto_renew: false,
        is_family_teacher: true,
        is_premium_parent: true,
        is_premium_player: true,
        coins: 500,
        total_stars_earned: 100,
      });

      setSuccess({
        email,
        expiresAt: expiresAt.toISOString(),
        tier: "family_teacher"
      });
    } catch (err) {
      console.error('Error granting access:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card className="border-4 border-purple-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Crown className="w-6 h-6" />
            Test Account Manager
          </CardTitle>
          <p className="text-sm opacity-90 mt-2">
            Quickly grant premium access to test accounts for Google Play Review
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Instructions */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              <strong>Steps:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                <li>First, manually create the account in your app (sign up)</li>
                <li>Enter the account email below</li>
                <li>Click "Grant Premium Access"</li>
                <li>Use this account for Google Play Console review</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-base font-semibold mb-2 block">
                Test Account Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="googlereview@mathadventure.com"
                className="h-12 text-base"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the email of an existing account
              </p>
            </div>

            <Button
              onClick={handleGrantAccess}
              disabled={loading || !email}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Grant Premium Access
                </>
              )}
            </Button>
          </div>

          {/* Success Message */}
          {success && (
            <Alert className="bg-green-50 border-green-300">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong className="block mb-2">✅ Success! Premium Access Granted</strong>
                <div className="space-y-1 text-sm">
                  <p><strong>Email:</strong> {success.email}</p>
                  <p><strong>Tier:</strong> Family/Teacher (Full Access)</p>
                  <p><strong>Expires:</strong> {new Date(success.expiresAt).toLocaleDateString()}</p>
                  <p className="mt-3 pt-3 border-t border-green-200">
                    <strong>Test Credentials:</strong><br />
                    Email: {success.email}<br />
                    Password: (The password you set during signup)
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="bg-red-50 border-red-300">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong className="block mb-1">Error</strong>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Info Box */}
          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <h3 className="font-bold text-purple-900 mb-2">What This Does:</h3>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>✓ Sets subscription tier to Family/Teacher</li>
              <li>✓ Grants all premium features</li>
              <li>✓ Sets expiration to 1 year from now</li>
              <li>✓ Adds 500 coins and 100 stars</li>
              <li>✓ Disables auto-renewal</li>
            </ul>
          </div>

          {/* Google Play Instructions */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">📋 For Google Play Console:</h3>
            <p className="text-sm text-gray-700 mb-2">
              Provide these instructions to reviewers:
            </p>
            <pre className="bg-white p-3 rounded text-xs border overflow-x-auto">
{`TEST ACCOUNT CREDENTIALS:
Email: ${email}
Password: (Your password)

INSTRUCTIONS:
1. Open Math Adventure app
2. Click "Sign In / Sign Up"  
3. Use credentials above
4. All premium features are unlocked

ACCOUNT FEATURES:
- Family/Teacher subscription active
- All premium content accessible
- Parental controls available
- No payment required

CONTACT:
support@math-adventure.com`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}