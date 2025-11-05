import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Sparkles, CheckCircle, Loader2, Image, Upload, FileImage, AlertTriangle, ExternalLink } from "lucide-react";

export default function GenerateIcons() {
  const [loading, setLoading] = useState(false);
  const [icons, setIcons] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setIcons(null);

    try {
      console.log('Calling generateAppIcons function...');
      const response = await base44.functions.invoke('generateAppIcons', {});
      console.log('Response:', response);
      
      if (response.data.success && response.data.icons) {
        setIcons(response.data.icons);
      } else if (response.data.error) {
        setError(response.data.message || response.data.error);
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      console.error('Error generating icons:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate icons. AI image generation may be temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert('Failed to download icon. Please right-click the image and save manually.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <Image className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Generate App Icons
        </h1>
        <p className="text-xl text-gray-600">Create beautiful icons for your PWA</p>
      </div>

      <Card className="border-2 border-purple-200 shadow-lg mb-8">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            AI Icon Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>AI-Powered Design:</strong> This will generate professional app icons using AI based on your Math Adventure theme.
                It creates both 192x192 and 512x512 pixel versions automatically.
              </AlertDescription>
            </Alert>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
              <h3 className="font-bold text-lg mb-3">What You'll Get:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span><strong>icon-192.png</strong> - For mobile devices (192x192px)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span><strong>icon-512.png</strong> - For high-res displays (512x512px)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Purple-pink gradient matching your app theme</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Math symbols and playful design elements</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Professional quality, optimized for visibility</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Icons... (takes ~30 seconds)
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Icons with AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert className="mb-8 bg-orange-50 border-orange-300">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div>
              <strong>Generation Failed:</strong> {error}
            </div>
            <p className="text-sm mt-2">Don't worry! You can create icons manually using the instructions below.</p>
          </AlertDescription>
        </Alert>
      )}

      {icons && (
        <Card className="border-4 border-green-300 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50 mb-8">
          <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-6 h-6" />
              Icons Generated Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* 512x512 Icon */}
              <div className="bg-white p-6 rounded-xl border-2 border-green-200 text-center">
                <div className="mb-4">
                  <img
                    src={icons.icon_512}
                    alt="512x512 icon"
                    className="w-64 h-64 mx-auto rounded-2xl shadow-lg"
                  />
                </div>
                <h3 className="font-bold text-lg mb-2">icon-512.png</h3>
                <p className="text-sm text-gray-600 mb-4">High Resolution (512x512px)</p>
                <Button
                  onClick={() => handleDownload(icons.icon_512, 'icon-512.png')}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download 512x512
                </Button>
              </div>

              {/* 192x192 Icon */}
              <div className="bg-white p-6 rounded-xl border-2 border-green-200 text-center">
                <div className="mb-4 flex items-center justify-center" style={{ height: '256px' }}>
                  <img
                    src={icons.icon_192}
                    alt="192x192 icon"
                    className="w-48 h-48 rounded-2xl shadow-lg"
                  />
                </div>
                <h3 className="font-bold text-lg mb-2">icon-192.png</h3>
                <p className="text-sm text-gray-600 mb-4">Standard Resolution (192x192px)</p>
                <Button
                  onClick={() => handleDownload(icons.icon_192, 'icon-192.png')}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download 192x192
                </Button>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200 mb-4">
              <AlertDescription className="text-blue-800">
                <div className="flex items-start gap-3">
                  <Upload className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold mb-2">📝 Next Steps:</p>
                    <ol className="space-y-2 ml-1 text-sm">
                      <li>1. Download both icons using the buttons above</li>
                      <li>2. Upload them to your app's <strong>public</strong> folder in Base44</li>
                      <li>3. Make sure they're named exactly <code className="bg-blue-100 px-1 rounded">icon-192.png</code> and <code className="bg-blue-100 px-1 rounded">icon-512.png</code></li>
                      <li>4. Your PWA will automatically use them!</li>
                    </ol>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Don't like the design? Generate again for a new variation!
              </p>
              <Button
                onClick={handleGenerate}
                variant="outline"
                disabled={loading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate New Icons
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Instructions */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Manual Option: Create Icons Yourself
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            If AI generation doesn't work, you can create beautiful icons manually:
          </p>
          
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-purple-600" />
                Option 1: Use Canva (Easiest)
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Go to <a href="https://www.canva.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline font-semibold">canva.com</a> (free account)</li>
                <li>Create two custom sizes: <strong>512x512px</strong> and <strong>192x192px</strong></li>
                <li>Add purple-pink gradient background (#9333ea → #ec4899)</li>
                <li>Add white math symbols: <span className="text-2xl">➕➖✖️➗</span></li>
                <li>Make the design playful and kid-friendly</li>
                <li>Download as PNG files</li>
                <li>Rename to <code className="bg-gray-100 px-2 py-1 rounded">icon-512.png</code> and <code className="bg-gray-100 px-2 py-1 rounded">icon-192.png</code></li>
                <li>Upload to your app's public folder</li>
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-600" />
                Option 2: Use Figma
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Go to <a href="https://www.figma.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">figma.com</a></li>
                <li>Create frames: 512×512px and 192×192px</li>
                <li>Apply gradient background (purple to pink)</li>
                <li>Add math symbols in white</li>
                <li>Export as PNG @ 1x scale</li>
                <li>Rename and upload to public folder</li>
              </ol>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold mb-2">✨ Design Tips:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Keep it simple - icons need to be recognizable at small sizes</li>
                <li>Use high contrast (white on purple/pink works great)</li>
                <li>Round the corners slightly for a modern look</li>
                <li>Make sure symbols are centered and balanced</li>
                <li>Test how it looks at different sizes before finalizing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}