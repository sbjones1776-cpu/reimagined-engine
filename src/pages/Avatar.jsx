import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app as firebaseApp } from "@/firebaseConfig";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from '@/hooks/UserProvider.jsx';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, Save, User as UserIcon, Users, ShoppingBag, Crown, CreditCard, XCircle, AlertTriangle, CheckCircle, Shirt, Footprints, Glasses as GlassesIcon, Watch, Smile, Palette } from "lucide-react";
import AvatarDisplay from "../components/avatar/AvatarDisplay";
import CustomizationSection from "../components/avatar/CustomizationSection";
import PetDisplay from "../components/rewards/PetDisplay";
import FacePreview from "../components/avatar/FacePreview";
import { format } from "date-fns";
import { getUserGameProgress } from '@/api/firebaseService';

export default function Avatar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: userLoading } = useUser();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [avatarData, setAvatarData] = useState({
    avatar_skin_tone: "medium",
    avatar_hair_style: "short",
    avatar_hair_color: "brown",
    avatar_eyes: "normal",
    avatar_face: "smile",
    avatar_shirt: "t_shirt_basic",
    avatar_pants: "jeans",
    avatar_shoes: "sneakers",
    avatar_hat: "none",
    avatar_glasses: "none",
    avatar_accessory: "none",
    avatar_background: "plain",
    pet_hat: "none",
    pet_accessory: "none",
    unlocked_items: ["t_shirt_basic", "jeans", "sneakers", "short", "long", "black", "brown", "blonde", "normal", "happy", "light", "medium", "tan", "dark", "smile", "big_smile", "plain"],
    parent_email: "",
  });

  useEffect(() => {
    if (user) {
      setAvatarData({
        avatar_skin_tone: user.avatar_skin_tone || "medium",
        avatar_hair_style: user.avatar_hair_style || "short",
        avatar_hair_color: user.avatar_hair_color || "brown",
        avatar_eyes: user.avatar_eyes || "normal",
        avatar_face: user.avatar_face || "smile",
        avatar_shirt: user.avatar_shirt || "t_shirt_basic",
        avatar_pants: user.avatar_pants || "jeans",
        avatar_shoes: user.avatar_shoes || "sneakers",
        avatar_hat: user.avatar_hat || "none",
        avatar_glasses: user.avatar_glasses || "none",
        avatar_accessory: user.avatar_accessory || "none",
        avatar_background: user.avatar_background || "plain",
        pet_hat: user.pet_hat || "none",
        pet_accessory: user.pet_accessory || "none",
        unlocked_items: user.unlocked_items || ["t_shirt_basic", "jeans", "sneakers", "short", "long", "black", "brown", "blonde", "normal", "happy", "light", "medium", "tan", "dark", "smile", "big_smile", "plain"],
        parent_email: user.parent_email || "",
      });
    }
  }, [user]);

  // Firebase avatar update
  const handleSave = async () => {
    if (!user) return;
    const db = getFirestore(firebaseApp);
    await setDoc(doc(db, "users", user.email), {
      ...avatarData,
      full_name: user.full_name,
      email: user.email,
      updatedAt: Date.now(),
    }, { merge: true });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // React Query mutations (previously referenced but not defined)
  const updateAvatarMutation = useMutation({
    mutationFn: async (partial) => {
      if (!user) return;
      const db = getFirestore(firebaseApp);
      await setDoc(doc(db, 'users', user.email), { ...partial }, { merge: true });
      return partial;
    },
    onSuccess: (partial) => {
      // Optimistically update local state
      setAvatarData(prev => ({ ...prev, ...partial }));
      // Invalidate any queries that depend on user
      queryClient.invalidateQueries({ queryKey: ['user', user.email] });
    }
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const db = getFirestore(firebaseApp);
      await setDoc(doc(db, 'users', user.email), {
        subscription_cancels_at: user.subscription_expires_at,
        subscription_auto_renew: false
      }, { merge: true });
      return true;
    },
    onSuccess: () => {
      setShowCancelConfirm(false);
      queryClient.invalidateQueries({ queryKey: ['user', user.email] });
    }
  });

  // Firebase cancel subscription (stub)
  const cancelSubscription = async () => {
    if (!user) return;
    const db = getFirestore(firebaseApp);
    await setDoc(doc(db, "users", user.email), {
      subscription_cancels_at: user.subscription_expires_at,
      subscription_auto_renew: false
    }, { merge: true });
    setShowCancelConfirm(false);
  };

  const handleChange = (field, value) => {
    setAvatarData(prev => ({ ...prev, [field]: value }));
  };

  // Removed duplicate handleSave declaration

  const isUnlocked = (item) => {
    // Trial users get access to all customization options
    if (user?.hasPremiumAccess) return true;
    return (avatarData.unlocked_items || []).includes(item) || 
           (user?.purchased_items || []).includes(item);
  };

  // Calculate unlockable items based on progress
  const getUnlockableItems = () => {
    const gamesPlayed = progress.length;
    const totalStars = progress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
    const hasThreeStars = progress.some(p => p.stars_earned === 3);
    const hasPerfectScore = progress.some(p => (p.correct_answers / p.total_questions) === 1);
    const hasCompletedHard = progress.some(p => p.level === "hard" && p.stars_earned >= 2);
    
    const unlockables = [];
    
    // Achievement-based unlocks
    if (gamesPlayed >= 3 && !isUnlocked("hoodie")) unlockables.push({ item: "hoodie", reason: "Play 3 games", emoji: "👕" });
    if (gamesPlayed >= 5 && !isUnlocked("curly")) unlockables.push({ item: "curly", reason: "Play 5 games", emoji: "🦱" });
    if (gamesPlayed >= 7 && !isUnlocked("baseball_cap")) unlockables.push({ item: "baseball_cap", reason: "Play 7 games", emoji: "🧢" });
    if (gamesPlayed >= 10 && !isUnlocked("shorts")) unlockables.push({ item: "shorts", reason: "Play 10 games", emoji: "🩳" });
    if (gamesPlayed >= 15 && !isUnlocked("boots")) unlockables.push({ item: "boots", reason: "Play 15 games", emoji: "🥾" });
    if (totalStars >= 10 && !isUnlocked("spiky")) unlockables.push({ item: "spiky", reason: "Earn 10 stars", emoji: "⚡" });
    if (totalStars >= 20 && !isUnlocked("sunglasses")) unlockables.push({ item: "sunglasses", reason: "Earn 20 stars", emoji: "😎" });
    if (totalStars >= 30 && !isUnlocked("stars")) unlockables.push({ item: "stars", reason: "Earn 30 stars", emoji: "⭐" });
    if (hasThreeStars && !isUnlocked("star")) unlockables.push({ item: "star", reason: "Get 3 stars in one game", emoji: "🤩" });
    if (hasPerfectScore && !isUnlocked("heart")) unlockables.push({ item: "heart", reason: "Perfect score", emoji: "😍" });
    if (hasCompletedHard && !isUnlocked("crown")) unlockables.push({ item: "crown", reason: "Complete hard level", emoji: "👑" });
    
    return unlockables.slice(0, 3);
  };

  // Fetch real game progress for unlockables
  const { data: progress = [], isFetching: progressLoading } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: () => getUserGameProgress(user.email),
    enabled: !!user?.email
  });
  const newUnlockables = getUnlockableItems();

  const activePet = user?.active_pet;
  const petData = activePet ? {
    id: activePet,
    name: activePet.charAt(0).toUpperCase() + activePet.slice(1),
    emoji: activePet === "dragon" ? "🐉" : activePet === "owl" ? "🦉" : activePet === "fox" ? "🦊" : activePet === "unicorn" ? "🦄" : "🐱",
    gradient: activePet === "dragon" ? "from-red-400 to-orange-500" : activePet === "owl" ? "from-indigo-400 to-purple-500" : activePet === "fox" ? "from-orange-400 to-red-500" : "from-pink-400 to-purple-500",
  } : null;

  const currentTier = user?.subscription_tier || "free";
  const isSubscribed = currentTier !== "free";
  const subscriptionExpires = user?.subscription_expires_at ? new Date(user.subscription_expires_at) : null;
  const daysUntilRenewal = subscriptionExpires ? Math.ceil((subscriptionExpires - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your avatar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Customize Your Avatar
          </h1>
          {(user?.hasPremiumAccess && (user?.subscription_tier === 'free' || user?.isOnTrial)) && (
            <Badge className="bg-green-500 text-white">
              Premium (Trial){typeof user?.trialDaysRemaining === 'number' ? ` • ${user.trialDaysRemaining} day${user.trialDaysRemaining === 1 ? '' : 's'} left` : ''}
            </Badge>
          )}
        </div>
        <p className="text-xl text-gray-600">Express yourself with tons of options!</p>
        {/* Display name editor */}
        <div className="mt-4 mx-auto max-w-sm">
          <Label className="text-sm text-gray-600">Display name</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={user?.full_name || ''}
              onChange={async (e) => {
                const newName = e.target.value;
                const db = getFirestore(firebaseApp);
                if (user?.email) {
                  await setDoc(doc(db, 'users', user.email), { full_name: newName }, { merge: true });
                }
              }}
              placeholder="Your name"
            />
            <Button
              variant="outline"
              onClick={async () => {
                // Force a small confirmation alert
                alert('Name saved');
              }}
            >Save</Button>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Sparkles className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Avatar saved successfully! 🎉
          </AlertDescription>
        </Alert>
      )}

      {/* Unlockables Alert */}
      {newUnlockables.length > 0 && (
        <Alert className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300">
          <Sparkles className="w-5 h-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <strong className="text-lg">🎉 New Items Unlocked!</strong>
                <div className="flex gap-3 mt-2">
                  {newUnlockables.map((unlock, i) => (
                    <Badge key={i} className="bg-yellow-500 text-white text-sm">
                      {unlock.emoji} {unlock.item.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              <Link to={createPageUrl("Shop")}>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Shop
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Subscription Status Card */}
      {isSubscribed && (
        <Card className="mb-8 border-4 border-yellow-400 shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      {currentTier === "premium_parent" ? "Premium Parent" : 
                       currentTier === "premium_player" ? "Premium Player" : 
                       "Family/Teacher Plan"}
                    </h3>
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active{user?.subscription_tier === 'free' ? ' (Trial)' : ''}
                    </Badge>
                  </div>
                  <p className="text-gray-600 flex flex-wrap gap-2 items-center">
                    {subscriptionExpires && `Renews ${format(subscriptionExpires, 'MMM d, yyyy')} • ${daysUntilRenewal} days left`}
                    {!subscriptionExpires && user?.isOnTrial && typeof user?.trialDaysRemaining === 'number' && (
                      <span className="text-sm text-yellow-700">
                        Trial: {user.trialDaysRemaining} day{user.trialDaysRemaining === 1 ? '' : 's'} left
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  className="h-12"
                  onClick={() => navigate(createPageUrl("Subscription"))}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
                {user?.subscription_auto_renew !== false && (
                  <Button 
                    variant="destructive"
                    onClick={() => setShowCancelConfirm(true)}
                    className="h-12"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Avatar Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-4 border-purple-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="flex items-center justify-between">
                <span>Your Avatar</span>
                <Badge variant="secondary" className="bg-white text-purple-600">
                  {(avatarData.unlocked_items?.length || 0) + (user?.purchased_items?.length || 0)} Items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <AvatarDisplay 
                  avatarData={avatarData} 
                  size="large" 
                  showPet={!!activePet}
                  petData={petData}
                />
              </div>

              {/* Pet Customization Preview */}
              {activePet && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    {petData.name}'s Accessories
                  </h4>
                  <div className="flex justify-center gap-4">
                    <PetDisplay
                      pet={petData}
                      experience={user?.pet_experience?.[activePet] || 0}
                      size="medium"
                      showAccessories={true}
                      hatType={avatarData.pet_hat}
                      accessoryType={avatarData.pet_accessory}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-12 text-lg"
                disabled={updateAvatarMutation.isPending}
              >
                <Save className="w-5 h-5 mr-2" />
                {updateAvatarMutation.isPending ? "Saving..." : "Save Avatar"}
              </Button>

              <Link to={createPageUrl("Shop")}>
                <Button
                  variant="outline"
                  className="w-full mt-3 h-12 border-2 border-purple-300 hover:bg-purple-50"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Get More Items
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Customization Options */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Customization Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="appearance" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
                  <TabsTrigger value="appearance">
                    <Smile className="w-4 h-4 mr-1" />
                    Face
                  </TabsTrigger>
                  <TabsTrigger value="hair">
                    <Palette className="w-4 h-4 mr-1" />
                    Hair
                  </TabsTrigger>
                  <TabsTrigger value="clothing">
                    <Shirt className="w-4 h-4 mr-1" />
                    Clothing
                  </TabsTrigger>
                  <TabsTrigger value="footwear">
                    <Footprints className="w-4 h-4 mr-1" />
                    Shoes
                  </TabsTrigger>
                  <TabsTrigger value="accessories">
                    <GlassesIcon className="w-4 h-4 mr-1" />
                    Access.
                  </TabsTrigger>
                  <TabsTrigger value="pet">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Pet
                  </TabsTrigger>
                </TabsList>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6">
                  {/* Adorable Face Presets */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      Quick Pick - Adorable Faces!
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { id: 'happy_kid', eyes: 'normal', face: 'big_smile', label: '😄 Happy' },
                        { id: 'playful', eyes: 'wink', face: 'tongue_out', label: '😜 Playful' },
                        { id: 'sweet_smile', eyes: 'normal', face: 'smile', label: '😊 Sweet' },
                        { id: 'excited', eyes: 'normal', face: 'open_smile', label: '😃 Excited' },
                        { id: 'sleepy_cute', eyes: 'sleepy', face: 'smile', label: '😌 Sleepy' },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            handleChange('avatar_eyes', preset.eyes);
                            handleChange('avatar_face', preset.face);
                          }}
                          className="relative p-6 rounded-xl border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-400 hover:shadow-xl transition-all group"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                              <FacePreview type="face" value={preset.face} size={56} />
                            </div>
                            <span className="text-sm font-bold text-gray-700">{preset.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <CustomizationSection
                    title="Skin Tone"
                    options={[
                      { id: "light", label: "Light", color: "#FFE0BD" },
                      { id: "medium", label: "Medium", color: "#F4C89A" },
                      { id: "tan", label: "Tan", color: "#D4A574" },
                      { id: "dark", label: "Dark", color: "#8D5524" },
                    ]}
                    selected={avatarData.avatar_skin_tone}
                    onChange={(value) => handleChange("avatar_skin_tone", value)}
                    isUnlocked={() => true}
                    type="color"
                  />

                  <CustomizationSection
                    title="Eyes"
                    options={[
                      { id: "normal", label: "Round", emoji: "👀" },
                      { id: "happy", label: "Happy", emoji: "😊" },
                      { id: "wink", label: "Wink", emoji: "�" },
                      { id: "sleepy", label: "Sleepy", emoji: "😴" },
                    ]}
                    selected={avatarData.avatar_eyes}
                    onChange={(value) => handleChange("avatar_eyes", value)}
                    isUnlocked={isUnlocked}
                    previewType="eyes"
                  />

                  <CustomizationSection
                    title="Face Expression"
                    options={[
                      { id: "smile", label: "Smile", emoji: "😊" },
                      { id: "big_smile", label: "Big Smile", emoji: "😄" },
                      { id: "grin", label: "Grin", emoji: "�" },
                      { id: "open_smile", label: "Open Smile", emoji: "�" },
                      { id: "neutral", label: "Neutral", emoji: "😐" },
                      { id: "tongue_out", label: "Playful", emoji: "😛" },
                    ]}
                    selected={avatarData.avatar_face}
                    onChange={(value) => handleChange("avatar_face", value)}
                    isUnlocked={isUnlocked}
                    previewType="mouth"
                  />

                  <CustomizationSection
                    title="Background"
                    options={[
                      { id: "plain", label: "Plain", emoji: "⬜" },
                      { id: "stars", label: "Stars", emoji: "⭐" },
                      { id: "rainbow", label: "Rainbow", emoji: "🌈" },
                      { id: "clouds", label: "Clouds", emoji: "☁️" },
                      { id: "space", label: "Space", emoji: "🚀" },
                      { id: "underwater", label: "Underwater", emoji: "🌊" },
                      { id: "forest", label: "Forest", emoji: "🌲" },
                      { id: "city", label: "City", emoji: "🏙️" },
                      { id: "beach", label: "Beach", emoji: "🏖️" },
                    ]}
                    selected={avatarData.avatar_background}
                    onChange={(value) => handleChange("avatar_background", value)}
                    isUnlocked={isUnlocked}
                  />
                </TabsContent>

                {/* Hair Tab */}
                <TabsContent value="hair" className="space-y-6">
                  <CustomizationSection
                    title="Hair Style"
                    options={[
                      { id: "short", label: "Short", emoji: "💇" },
                      { id: "long", label: "Long", emoji: "💁" },
                      { id: "curly", label: "Curly", emoji: "🦱" },
                      { id: "spiky", label: "Spiky", emoji: "⚡" },
                      { id: "bald", label: "Bald", emoji: "🧑‍🦲" },
                      { id: "ponytail", label: "Ponytail", emoji: "🎀" },
                      { id: "braids", label: "Braids", emoji: "🧵" },
                      { id: "afro", label: "Afro", emoji: "🌀" },
                      { id: "mohawk", label: "Mohawk", emoji: "🔥" },
                      { id: "bun", label: "Bun", emoji: "🍔" },
                    ]}
                    selected={avatarData.avatar_hair_style}
                    onChange={(value) => handleChange("avatar_hair_style", value)}
                    isUnlocked={isUnlocked}
                  />

                  <CustomizationSection
                    title="Hair Color"
                    options={[
                      { id: "black", label: "Black", color: "#000000" },
                      { id: "brown", label: "Brown", color: "#8B4513" },
                      { id: "blonde", label: "Blonde", color: "#FFD700" },
                      { id: "red", label: "Red", color: "#DC143C" },
                      { id: "blue", label: "Blue", color: "#4169E1" },
                      { id: "pink", label: "Pink", color: "#FF69B4" },
                      { id: "purple", label: "Purple", color: "#9370DB" },
                      { id: "green", label: "Green", color: "#32CD32" },
                      { id: "orange", label: "Orange", color: "#FF8C00" },
                      { id: "white", label: "White", color: "#F5F5F5" },
                      { id: "rainbow", label: "Rainbow", emoji: "🌈" },
                    ]}
                    selected={avatarData.avatar_hair_color}
                    onChange={(value) => handleChange("avatar_hair_color", value)}
                    isUnlocked={isUnlocked}
                    type="color"
                  />
                </TabsContent>

                {/* Clothing Tab */}
                <TabsContent value="clothing" className="space-y-6">
                  <CustomizationSection
                    title="Shirts & Tops"
                    options={[
                      { id: "t_shirt_basic", label: "Basic Tee", emoji: "👕" },
                      { id: "t_shirt_stripe", label: "Striped Tee", emoji: "👔" },
                      { id: "polo", label: "Polo Shirt", emoji: "👕" },
                      { id: "hoodie", label: "Hoodie", emoji: "🧥" },
                      { id: "tank_top", label: "Tank Top", emoji: "👙" },
                      { id: "sweater", label: "Sweater", emoji: "🧶" },
                      { id: "jersey", label: "Jersey", emoji: "⚽" },
                      { id: "button_up", label: "Button Up", emoji: "👔" },
                      { id: "graphic_tee", label: "Graphic Tee", emoji: "🎨" },
                    ]}
                    selected={avatarData.avatar_shirt}
                    onChange={(value) => handleChange("avatar_shirt", value)}
                    isUnlocked={isUnlocked}
                  />

                  <CustomizationSection
                    title="Pants & Bottoms"
                    options={[
                      { id: "jeans", label: "Jeans", emoji: "👖" },
                      { id: "shorts", label: "Shorts", emoji: "🩳" },
                      { id: "skirt", label: "Skirt", emoji: "👗" },
                      { id: "dress_pants", label: "Dress Pants", emoji: "👔" },
                      { id: "joggers", label: "Joggers", emoji: "🏃" },
                      { id: "overalls", label: "Overalls", emoji: "👖" },
                      { id: "leggings", label: "Leggings", emoji: "🩱" },
                      { id: "cargo_pants", label: "Cargo Pants", emoji: "🎒" },
                    ]}
                    selected={avatarData.avatar_pants}
                    onChange={(value) => handleChange("avatar_pants", value)}
                    isUnlocked={isUnlocked}
                  />
                </TabsContent>

                {/* Footwear Tab */}
                <TabsContent value="footwear" className="space-y-6">
                  <CustomizationSection
                    title="Shoes"
                    options={[
                      { id: "sneakers", label: "Sneakers", emoji: "👟" },
                      { id: "boots", label: "Boots", emoji: "🥾" },
                      { id: "sandals", label: "Sandals", emoji: "🩴" },
                      { id: "dress_shoes", label: "Dress Shoes", emoji: "👞" },
                      { id: "high_tops", label: "High Tops", emoji: "👟" },
                      { id: "cleats", label: "Cleats", emoji: "⚽" },
                      { id: "slippers", label: "Slippers", emoji: "🩴" },
                      { id: "bare_feet", label: "Bare Feet", emoji: "🦶" },
                    ]}
                    selected={avatarData.avatar_shoes}
                    onChange={(value) => handleChange("avatar_shoes", value)}
                    isUnlocked={isUnlocked}
                  />
                </TabsContent>

                {/* Accessories Tab */}
                <TabsContent value="accessories" className="space-y-6">
                  <CustomizationSection
                    title="Hats & Headwear"
                    options={[
                      { id: "none", label: "None", emoji: "🚫" },
                      { id: "baseball_cap", label: "Baseball Cap", emoji: "🧢" },
                      { id: "beanie", label: "Beanie", emoji: "🎩" },
                      { id: "sun_hat", label: "Sun Hat", emoji: "👒" },
                      { id: "wizard_hat", label: "Wizard Hat", emoji: "🧙" },
                      { id: "party_hat", label: "Party Hat", emoji: "🎉" },
                      { id: "graduation_cap", label: "Graduation Cap", emoji: "🎓" },
                      { id: "crown", label: "Crown", emoji: "👑" },
                      { id: "top_hat", label: "Top Hat", emoji: "🎩" },
                      { id: "cowboy_hat", label: "Cowboy Hat", emoji: "🤠" },
                    ]}
                    selected={avatarData.avatar_hat}
                    onChange={(value) => handleChange("avatar_hat", value)}
                    isUnlocked={isUnlocked}
                  />

                  <CustomizationSection
                    title="Glasses & Eyewear"
                    options={[
                      { id: "none", label: "None", emoji: "🚫" },
                      { id: "regular", label: "Regular", emoji: "👓" },
                      { id: "sunglasses", label: "Sunglasses", emoji: "😎" },
                      { id: "reading", label: "Reading", emoji: "🤓" },
                      { id: "safety_goggles", label: "Safety Goggles", emoji: "🥽" },
                      { id: "3d_glasses", label: "3D Glasses", emoji: "🕶️" },
                      { id: "heart_shaped", label: "Heart Glasses", emoji: "😍" },
                      { id: "star_shaped", label: "Star Glasses", emoji: "🤩" },
                    ]}
                    selected={avatarData.avatar_glasses}
                    onChange={(value) => handleChange("avatar_glasses", value)}
                    isUnlocked={isUnlocked}
                  />

                  <CustomizationSection
                    title="Other Accessories"
                    options={[
                      { id: "none", label: "None", emoji: "🚫" },
                      { id: "backpack", label: "Backpack", emoji: "🎒" },
                      { id: "cape", label: "Cape", emoji: "🦸" },
                      { id: "scarf", label: "Scarf", emoji: "🧣" },
                      { id: "bow_tie", label: "Bow Tie", emoji: "🎀" },
                      { id: "necklace", label: "Necklace", emoji: "📿" },
                      { id: "watch", label: "Watch", emoji: "⌚" },
                      { id: "headphones", label: "Headphones", emoji: "🎧" },
                      { id: "earrings", label: "Earrings", emoji: "💎" },
                      { id: "bracelet", label: "Bracelet", emoji: "📿" },
                    ]}
                    selected={avatarData.avatar_accessory}
                    onChange={(value) => handleChange("avatar_accessory", value)}
                    isUnlocked={isUnlocked}
                  />
                </TabsContent>

                {/* Pet Accessories Tab */}
                <TabsContent value="pet" className="space-y-6">
                  {activePet ? (
                    <>
                      <Alert className="bg-purple-50 border-purple-300">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <AlertDescription className="text-purple-800">
                          <strong>Dress up your {petData.name}!</strong> Customize your pet's look with hats and accessories.
                        </AlertDescription>
                      </Alert>

                      <CustomizationSection
                        title="Pet Hats"
                        options={[
                          { id: "none", label: "None", emoji: "🚫" },
                          { id: "tiny_cap", label: "Tiny Cap", emoji: "🧢" },
                          { id: "bow", label: "Bow", emoji: "🎀" },
                          { id: "crown", label: "Crown", emoji: "👑" },
                          { id: "santa_hat", label: "Santa Hat", emoji: "🎅" },
                          { id: "party_hat", label: "Party Hat", emoji: "🎉" },
                        ]}
                        selected={avatarData.pet_hat}
                        onChange={(value) => handleChange("pet_hat", value)}
                        isUnlocked={isUnlocked}
                      />

                      <CustomizationSection
                        title="Pet Accessories"
                        options={[
                          { id: "none", label: "None", emoji: "🚫" },
                          { id: "collar", label: "Collar", emoji: "📿" },
                          { id: "bow_tie", label: "Bow Tie", emoji: "🎀" },
                          { id: "bandana", label: "Bandana", emoji: "🧣" },
                          { id: "scarf", label: "Scarf", emoji: "🧣" },
                          { id: "wings", label: "Wings", emoji: "🪽" },
                          { id: "cape", label: "Cape", emoji: "🦸" },
                        ]}
                        selected={avatarData.pet_accessory}
                        onChange={(value) => handleChange("pet_accessory", value)}
                        isUnlocked={isUnlocked}
                      />
                    </>
                  ) : (
                    <Card className="text-center py-12">
                      <CardContent>
                        <div className="text-6xl mb-4">🐾</div>
                        <h3 className="text-2xl font-bold mb-2">No Pet Yet!</h3>
                        <p className="text-gray-600 mb-4">Get a pet from the shop to customize it!</p>
                        <Link to={createPageUrl("Shop")}>
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Visit Shop
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Parent Linking Section */}
      <Card className="mt-8 border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Parent/Teacher Access
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-600">
              Allow a parent or teacher to monitor your progress and help you set learning goals.
            </p>
            {/* How parent/teacher access works */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-900 space-y-2">
                <p className="font-semibold">How it works</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Enter a parent or teacher's email and tap Save — we'll send them an invite.</li>
                  <li>They can create/sign in to a free account and link to your profile.</li>
                  <li>They can see your stars, recent games, concepts practiced, and goals.</li>
                  <li>They cannot change your avatar, play as you, or make purchases.</li>
                  <li>You can remove or change the email anytime, or manage access in the Parent Portal.</li>
                </ul>
                <p className="text-xs text-blue-800">Tip: If the invite doesn’t arrive, ask them to check spam or try again.</p>
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="parent_email">Parent/Teacher Email</Label>
              <div className="flex gap-2">
                <Input
                  id="parent_email"
                  type="email"
                  value={avatarData.parent_email || ""}
                  onChange={(e) => handleChange("parent_email", e.target.value)}
                  placeholder="parent@example.com"
                />
                <Button
                  onClick={() => updateAvatarMutation.mutate({ parent_email: avatarData.parent_email })}
                  disabled={updateAvatarMutation.isPending}
                >
                  Save
                </Button>
              </div>
              <div className="flex items-center gap-3">
                {user?.parent_email && (
                  <p className="text-sm text-green-600">
                    ✓ Linked to: {user.parent_email}
                  </p>
                )}
                <Link to={createPageUrl("ParentPortal")} className="text-sm text-blue-600 hover:text-blue-700 underline">
                  Manage in Parent Portal
                </Link>
              </div>
            </div>
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