import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function TestIconGeneration() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runTest = async () => {
    setTesting(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Starting icon generation test...');
      
      const response = await base44.functions.invoke('generateAppIcons', {});
      
      console.log('✅ Function response:', response);
      
      if (response.data && response.data.success) {
        setResult({
          success: true,
          icons: response.data.icons,
          message: 'Icons generated successfully!',
        });
      } else {
        setError('Function returned but no icons generated');
      }
    } catch (err) {
      console.error('❌ Icon generation failed:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100">
          <CardTitle>🧪 Icon Generation Test</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              This page tests the icon generation function. Click the button below to generate test icons.
            </AlertDescription>
          </Alert>

          <Button
            onClick={runTest}
            disabled={testing}
            className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            {testing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Testing Icon Generation... (30 seconds)
              </>
            ) : (
              <>
                🧪 Run Icon Generation Test
              </>
            )}
          </Button>

          {error && (
            <Alert className="bg-red-50 border-red-200">
              <XCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Test Failed:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {result && result.success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>✅ Test Passed!</strong> Icons generated successfully!
              </AlertDescription>
            </Alert>
          )}

          {result && result.icons && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Generated Icons:</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                  <img
                    src={result.icons.icon_512}
                    alt="512x512 icon"
                    className="w-full rounded-lg shadow-lg mb-2"
                  />
                  <p className="text-sm font-bold text-center">512x512 Icon</p>
                  <p className="text-xs text-gray-600 text-center break-all mt-1">
                    {result.icons.icon_512}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                  <img
                    src={result.icons.icon_192}
                    alt="192x192 icon"
                    className="w-full rounded-lg shadow-lg mb-2"
                  />
                  <p className="text-sm font-bold text-center">192x192 Icon</p>
                  <p className="text-xs text-gray-600 text-center break-all mt-1">
                    {result.icons.icon_192}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Test Details:</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Function: generateAppIcons</li>
              <li>Expected: 2 icon URLs (192x192 and 512x512)</li>
              <li>AI Model: Image Generation via Base44 Core</li>
              <li>Timeout: ~30 seconds</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}