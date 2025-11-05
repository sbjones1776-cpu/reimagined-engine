import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Download, Smartphone, Share } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 3 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show manual instructions after 3 seconds
    if (iOS) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstalled(true);
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || sessionStorage.getItem('installPromptDismissed')) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-8 md:max-w-md lg:bottom-8"
        >
          <Card className="border-4 border-purple-400 shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-lg mb-1">Install Math Adventure</h3>
                  
                  {isIOS ? (
                    <>
                      <p className="text-sm text-gray-600 mb-3">
                        Add to your home screen for the best experience!
                      </p>
                      <div className="bg-white p-4 rounded-lg border-2 border-purple-200 text-sm space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Share className="w-4 h-4 text-blue-600" />
                          </div>
                          <p className="font-semibold text-purple-700">How to install on iPhone/iPad:</p>
                        </div>
                        
                        <ol className="space-y-2 text-gray-700 ml-2">
                          <li className="flex gap-3">
                            <span className="font-bold text-purple-600 flex-shrink-0">1.</span>
                            <span>Tap the <strong>Share button</strong> <Share className="inline w-4 h-4" /> at the bottom of your screen (or top in Safari)</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-bold text-purple-600 flex-shrink-0">2.</span>
                            <span>Scroll down and tap <strong>"Add to Home Screen"</strong> <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs">📱+</span></span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-bold text-purple-600 flex-shrink-0">3.</span>
                            <span>Tap <strong>"Add"</strong> in the top right corner</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-bold text-purple-600 flex-shrink-0">4.</span>
                            <span>The app icon will appear on your home screen!</span>
                          </li>
                        </ol>

                        <div className="bg-blue-50 p-2 rounded mt-3">
                          <p className="text-xs text-blue-700">
                            💡 <strong>Tip:</strong> Once installed, open the app from your home screen for the full-screen experience!
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-3">
                        Install the app for quick access and offline play!
                      </p>
                      <div className="bg-white p-3 rounded-lg border-2 border-purple-200 mb-3">
                        <p className="text-xs text-gray-600 mb-2">✨ Benefits:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Works offline</li>
                          <li>• Faster loading</li>
                          <li>• Full-screen experience</li>
                          <li>• Home screen access</li>
                        </ul>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleInstallClick}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Install App
                        </Button>
                        <Button
                          onClick={handleDismiss}
                          variant="outline"
                        >
                          Later
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}