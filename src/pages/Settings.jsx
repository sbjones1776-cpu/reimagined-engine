
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings as SettingsIcon,
  Palette,
  Volume2,
  Target,
  Brush,
  Moon,
  Sun,
  Check,
  Save,
  RotateCcw,
  Info,
  Sparkles,
  PaintBucket,
  Eraser,
  Plus,
  Minus,
  X,
  Divide,
  Trash2,
  AlertTriangle,
  Shield
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function Settings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  // Local state for settings
  const [theme, setTheme] = useState(user?.app_settings?.theme || "light");
  const [soundVolume, setSoundVolume] = useState(user?.app_settings?.sound_volume ?? 70);
  const [defaultOperation, setDefaultOperation] = useState(user?.app_settings?.default_operation || "addition");
  const [defaultLevel, setDefaultLevel] = useState(user?.app_settings?.default_level || "easy");
  const [defaultDrawingTool, setDefaultDrawingTool] = useState(user?.app_settings?.default_drawing_tool || "brush");
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user?.app_settings) {
      setTheme(user.app_settings.theme || "light");
      setSoundVolume(user.app_settings.sound_volume ?? 70);
      setDefaultOperation(user.app_settings.default_operation || "addition");
      setDefaultLevel(user.app_settings.default_level || "easy");
      setDefaultDrawingTool(user.app_settings.default_drawing_tool || "brush");
    }
  }, [user]);

  const checkForChanges = () => {
    const currentSettings = user?.app_settings || {};
    const hasChanged = 
      theme !== (currentSettings.theme || "light") ||
      soundVolume !== (currentSettings.sound_volume ?? 70) ||
      defaultOperation !== (currentSettings.default_operation || "addition") ||
      defaultLevel !== (currentSettings.default_level || "easy") ||
      defaultDrawingTool !== (currentSettings.default_drawing_tool || "brush");
    
    setHasChanges(hasChanged);
  };

  useEffect(() => {
    checkForChanges();
  }, [theme, soundVolume, defaultOperation, defaultLevel, defaultDrawingTool, user]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (settings) => {
      return await base44.auth.updateMe({
        app_settings: settings
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setSaveSuccess(true);
      setHasChanges(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const handleSave = () => {
    const settings = {
      theme,
      sound_volume: soundVolume,
      default_operation: defaultOperation,
      default_level: defaultLevel,
      default_drawing_tool: defaultDrawingTool,
    };
    
    saveSettingsMutation.mutate(settings);
  };

  const handleReset = () => {
    setTheme("light");
    setSoundVolume(70);
    setDefaultOperation("addition");
    setDefaultLevel("easy");
    setDefaultDrawingTool("brush");
  };

  const operations = [
    { id: "addition", name: "Addition", icon: Plus },
    { id: "subtraction", name: "Subtraction", icon: Minus },
    { id: "multiplication", name: "Multiplication", icon: X },
    { id: "division", name: "Division", icon: Divide },
  ];

  const levels = [
    { id: "easy", name: "Easy (K-2nd)", color: "bg-green-500" },
    { id: "medium", name: "Medium (3-5th)", color: "bg-yellow-500" },
    { id: "hard", name: "Hard (6-8th)", color: "bg-red-500" },
  ];

  const drawingTools = [
    { id: "brush", name: "Brush", icon: Brush, description: "Click & drag to paint" },
    { id: "fill", name: "Fill", icon: PaintBucket, description: "Fill connected areas" },
    { id: "eraser", name: "Eraser", icon: Eraser, description: "Remove colors" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              App Settings
            </h1>
            <p className="text-gray-600">Customize your Math Adventure experience</p>
          </div>
        </div>

        {saveSuccess && (
          <Alert className="bg-green-50 border-green-300 mb-4">
            <Check className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Settings saved successfully!</strong> Your preferences have been updated.
            </AlertDescription>
          </Alert>
        )}

        {hasChanges && (
          <Alert className="bg-blue-50 border-blue-300 mb-4">
            <Info className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              You have unsaved changes. Click "Save Settings" to apply them.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <Card className="border-4 border-purple-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-6 h-6 text-purple-600" />
              Appearance Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-4">Choose how the app looks</p>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setTheme("light")}
                className={`cursor-pointer border-4 rounded-xl p-6 transition-all ${
                  theme === "light"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Sun className="w-8 h-8 text-yellow-500" />
                  {theme === "light" && (
                    <Check className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1">Light Mode</h3>
                <p className="text-sm text-gray-600">Bright and colorful interface</p>
                <div className="mt-4 h-16 bg-gradient-to-r from-white to-gray-100 rounded-lg border-2 border-gray-300"></div>
              </div>

              <div
                onClick={() => setTheme("dark")}
                className={`cursor-pointer border-4 rounded-xl p-6 transition-all ${
                  theme === "dark"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Moon className="w-8 h-8 text-indigo-500" />
                  {theme === "dark" && (
                    <Check className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1">Dark Mode</h3>
                <p className="text-sm text-gray-600">Easy on the eyes at night</p>
                <div className="mt-4 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700"></div>
              </div>
            </div>
            
            <Alert className="mt-4 bg-blue-50 border-blue-300">
              <Info className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Dark Mode Active:</strong> The theme will apply throughout the app. Refresh the page if colors don't update immediately.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Sound Settings */}
        <Card className="border-4 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100">
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-blue-600" />
              Sound Effects
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-4">Adjust sound effects volume</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Volume2 className={`w-6 h-6 ${soundVolume === 0 ? 'text-gray-400' : 'text-blue-600'}`} />
                <Slider
                  value={[soundVolume]}
                  onValueChange={(value) => setSoundVolume(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Badge className="bg-blue-500 text-white text-lg px-4 py-1 min-w-[60px] text-center">
                  {soundVolume}%
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundVolume(0)}
                  className={soundVolume === 0 ? "bg-blue-100 border-blue-500" : ""}
                >
                  Mute
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundVolume(30)}
                  className={soundVolume === 30 ? "bg-blue-100 border-blue-500" : ""}
                >
                  Low
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundVolume(70)}
                  className={soundVolume === 70 ? "bg-blue-100 border-blue-500" : ""}
                >
                  Medium
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundVolume(100)}
                  className={soundVolume === 100 ? "bg-blue-100 border-blue-500" : ""}
                >
                  High
                </Button>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Sound effects play when you answer questions correctly or earn rewards!
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Default Math Settings */}
        <Card className="border-4 border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-green-600" />
              Default Game Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-6">Set your preferred operation and difficulty level</p>
            
            <div className="space-y-6">
              {/* Default Operation */}
              <div>
                <h3 className="font-bold text-lg mb-3">Default Operation</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {operations.map((op) => {
                    const Icon = op.icon;
                    return (
                      <div
                        key={op.id}
                        onClick={() => setDefaultOperation(op.id)}
                        className={`cursor-pointer border-4 rounded-xl p-4 transition-all text-center ${
                          defaultOperation === op.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${
                          defaultOperation === op.id ? "text-green-600" : "text-gray-600"
                        }`} />
                        <p className="font-semibold text-sm">{op.name}</p>
                        {defaultOperation === op.id && (
                          <Check className="w-5 h-5 mx-auto mt-2 text-green-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Default Level */}
              <div>
                <h3 className="font-bold text-lg mb-3">Default Difficulty Level</h3>
                <div className="grid grid-cols-3 gap-3">
                  {levels.map((lv) => (
                    <div
                      key={lv.id}
                      onClick={() => setDefaultLevel(lv.id)}
                      className={`cursor-pointer border-4 rounded-xl p-4 transition-all text-center ${
                        defaultLevel === lv.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className={`w-12 h-12 ${lv.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl`}>
                        {lv.id === "easy" ? "E" : lv.id === "medium" ? "M" : "H"}
                      </div>
                      <p className="font-semibold text-sm">{lv.name}</p>
                      {defaultLevel === lv.id && (
                        <Check className="w-5 h-5 mx-auto mt-2 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drawing Tool Preferences */}
        <Card className="border-4 border-orange-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
            <CardTitle className="flex items-center gap-2">
              <Brush className="w-6 h-6 text-orange-600" />
              Color by Numbers Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-4">Choose your default drawing tool</p>
            
            <div className="grid grid-cols-3 gap-4">
              {drawingTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => setDefaultDrawingTool(tool.id)}
                    className={`cursor-pointer border-4 rounded-xl p-6 transition-all ${
                      defaultDrawingTool === tool.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={`w-8 h-8 ${
                        defaultDrawingTool === tool.id ? "text-orange-600" : "text-gray-600"
                      }`} />
                      {defaultDrawingTool === tool.id && (
                        <Check className="w-6 h-6 text-orange-600" />
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{tool.name}</h3>
                    <p className="text-xs text-gray-600">{tool.description}</p>
                  </div>
                );
              })}
            </div>

            <Alert className="mt-4 bg-orange-50 border-orange-200">
              <Info className="w-4 h-4 text-orange-600" />
              <AlertDescription className="text-orange-800 text-sm">
                This tool will be selected by default when you start a Color by Numbers game.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto gap-2 text-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("Home"))}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saveSettingsMutation.isPending}
              className="flex-1 sm:flex-initial gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>

      {/* Data & Privacy Section */}
      <Card className="mt-8 border-2 border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">Request Account Deletion</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you'd like to delete your account and all associated data, you can submit a deletion request. 
                  This action will permanently remove:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Your profile and avatar customizations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>All game progress, scores, and achievements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Messages, goals, and team challenges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Subscription and payment information</span>
                  </li>
                </ul>
                <Alert className="bg-yellow-50 border-yellow-300 mb-4">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 text-sm">
                    <strong>Warning:</strong> Account deletion is permanent and cannot be undone. We will process your request within 30 days.
                  </AlertDescription>
                </Alert>
                <a
                  href={`mailto:support@math-adventure.com?subject=Account Deletion Request&body=Hello,%0D%0A%0D%0AI would like to request the deletion of my Math Adventure account.%0D%0A%0D%0AAccount Email: ${user?.email || ''}%0D%0AAccount Name: ${user?.full_name || ''}%0D%0A%0D%0APlease confirm that all my personal data and game progress will be permanently deleted.%0D%0A%0D%0AThank you.`}
                  className="inline-block"
                >
                  <Button 
                    variant="destructive" 
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Request Account Deletion
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="mt-8 border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Tips & Tricks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span>Your settings are saved automatically and sync across all your devices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span>Default game settings make it faster to start playing your favorite challenges</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span>You can change your drawing tool anytime while playing Color by Numbers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span>Turn down sound effects if you're playing in a quiet environment</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
