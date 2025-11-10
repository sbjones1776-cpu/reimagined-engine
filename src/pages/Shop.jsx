import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/Logo";
import { ShoppingBag, Star, Coins, Lock, Sparkles, Crown, Package, Palette, Zap } from "lucide-react";
import PetDisplay from "../components/rewards/PetDisplay";
import BadgeDisplay from "../components/rewards/BadgeDisplay";
import DailyLoginRewards from "../components/rewards/DailyLoginRewards";
import { useUser } from '@/hooks/UserProvider.jsx';
import { getUserGameProgress, updateUserProfile } from '@/api/firebaseService';
import { useToast } from '@/components/ui/use-toast';
import { getAvailableStarsFromGame, getTotalGameStars, getUserCoins } from '@/lib/selectors';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import PremiumFeatureLock from '@/components/PremiumFeatureLock';

const shopItems = {
  pets: [
    { id: "dragon", name: "Dragon", emoji: "🐉", price: 50, gradient: "from-red-400 to-orange-500", evolveLevel: 5, description: "Breathe fire and soar!", premium: true },
    { id: "unicorn", name: "Unicorn", emoji: "🦄", price: 50, gradient: "from-pink-400 to-purple-500", evolveLevel: 5, description: "Magical and sparkly!", premium: true },
    { id: "owl", name: "Owl", emoji: "🦉", price: 50, gradient: "from-indigo-400 to-purple-500", evolveLevel: 5, description: "Wise and clever!" },
    { id: "fox", name: "Fox", emoji: "🦊", price: 50, gradient: "from-orange-400 to-red-500", evolveLevel: 5, description: "Cunning and quick!" },
    { id: "cat", name: "Cat", emoji: "🐱", price: 50, gradient: "from-gray-400 to-slate-500", evolveLevel: 5, description: "Playful and curious!" },
    { id: "dog", name: "Dog", emoji: "🐶", price: 50, gradient: "from-yellow-400 to-orange-500", evolveLevel: 5, description: "Loyal and friendly!" },
  ],
  avatarItems: [
    // Hair styles
    { id: "curly", name: "Curly Hair", emoji: "🦱", price: 20, category: "hair", type: "avatar_hair_style" },
    { id: "spiky", name: "Spiky Hair", emoji: "⚡", price: 20, category: "hair", type: "avatar_hair_style" },
    { id: "ponytail", name: "Ponytail", emoji: "🎀", price: 25, category: "hair", type: "avatar_hair_style" },
    { id: "braids", name: "Braids", emoji: "🧵", price: 25, category: "hair", type: "avatar_hair_style" },
    { id: "afro", name: "Afro", emoji: "🌀", price: 30, category: "hair", type: "avatar_hair_style" },
    { id: "mohawk", name: "Mohawk", emoji: "🔥", price: 30, category: "hair", type: "avatar_hair_style" },
    { id: "bun", name: "Bun", emoji: "🍔", price: 25, category: "hair", type: "avatar_hair_style" },
    
    // Hair colors
    { id: "red", name: "Red Hair", emoji: "❤️", price: 15, category: "hair", type: "avatar_hair_color" },
    { id: "blue", name: "Blue Hair", emoji: "💙", price: 15, category: "hair", type: "avatar_hair_color" },
    { id: "pink", name: "Pink Hair", emoji: "💗", price: 15, category: "hair", type: "avatar_hair_color" },
    { id: "purple", name: "Purple Hair", emoji: "💜", price: 15, category: "hair", type: "avatar_hair_color" },
    { id: "green", name: "Green Hair", emoji: "💚", price: 15, category: "hair", type: "avatar_hair_color" },
    { id: "orange", name: "Orange Hair", emoji: "🧡", price: 15, category: "hair", type: "avatar_hair_color" },
    { id: "white", name: "White Hair", emoji: "🤍", price: 20, category: "hair", type: "avatar_hair_color", premium: true },
    { id: "rainbow", name: "Rainbow Hair", emoji: "🌈", price: 40, category: "hair", type: "avatar_hair_color", premium: true },
    
    // Clothing
    { id: "hoodie", name: "Hoodie", emoji: "🧥", price: 30, category: "clothing", type: "avatar_shirt" },
    { id: "tank_top", name: "Tank Top", emoji: "👙", price: 25, category: "clothing", type: "avatar_shirt" },
    { id: "sweater", name: "Sweater", emoji: "🧶", price: 30, category: "clothing", type: "avatar_shirt" },
    { id: "jersey", name: "Jersey", emoji: "⚽", price: 35, category: "clothing", type: "avatar_shirt" },
    { id: "button_up", name: "Button Up", emoji: "👔", price: 35, category: "clothing", type: "avatar_shirt" },
    { id: "graphic_tee", name: "Graphic Tee", emoji: "🎨", price: 30, category: "clothing", type: "avatar_shirt" },
    { id: "t_shirt_stripe", name: "Striped Tee", emoji: "👔", price: 25, category: "clothing", type: "avatar_shirt" },
    { id: "polo", name: "Polo Shirt", emoji: "👕", price: 30, category: "clothing", type: "avatar_shirt" },
    
    { id: "shorts", name: "Shorts", emoji: "🩳", price: 25, category: "clothing", type: "avatar_pants" },
    { id: "skirt", name: "Skirt", emoji: "👗", price: 25, category: "clothing", type: "avatar_pants" },
    { id: "dress_pants", name: "Dress Pants", emoji: "👔", price: 30, category: "clothing", type: "avatar_pants" },
    { id: "joggers", name: "Joggers", emoji: "🏃", price: 30, category: "clothing", type: "avatar_pants" },
    { id: "overalls", name: "Overalls", emoji: "👖", price: 35, category: "clothing", type: "avatar_pants" },
    { id: "leggings", name: "Leggings", emoji: "🩱", price: 25, category: "clothing", type: "avatar_pants" },
    { id: "cargo_pants", name: "Cargo Pants", emoji: "🎒", price: 30, category: "clothing", type: "avatar_pants" },
    
    { id: "boots", name: "Boots", emoji: "🥾", price: 30, category: "clothing", type: "avatar_shoes" },
    { id: "sandals", name: "Sandals", emoji: "🩴", price: 20, category: "clothing", type: "avatar_shoes" },
    { id: "dress_shoes", name: "Dress Shoes", emoji: "👞", price: 35, category: "clothing", type: "avatar_shoes" },
    { id: "high_tops", name: "High Tops", emoji: "👟", price: 35, category: "clothing", type: "avatar_shoes" },
    { id: "cleats", name: "Cleats", emoji: "⚽", price: 35, category: "clothing", type: "avatar_shoes" },
    { id: "slippers", name: "Slippers", emoji: "🩴", price: 20, category: "clothing", type: "avatar_shoes" },
    
    // Accessories
    { id: "baseball_cap", name: "Baseball Cap", emoji: "🧢", price: 25, category: "accessories", type: "avatar_hat" },
    { id: "beanie", name: "Beanie", emoji: "🎩", price: 25, category: "accessories", type: "avatar_hat" },
    { id: "sun_hat", name: "Sun Hat", emoji: "👒", price: 25, category: "accessories", type: "avatar_hat" },
    { id: "wizard_hat", name: "Wizard Hat", emoji: "🧙", price: 40, category: "accessories", type: "avatar_hat" },
    { id: "party_hat", name: "Party Hat", emoji: "🎉", price: 30, category: "accessories", type: "avatar_hat" },
    { id: "graduation_cap", name: "Graduation Cap", emoji: "🎓", price: 35, category: "accessories", type: "avatar_hat" },
    { id: "crown", name: "Crown", emoji: "👑", price: 50, category: "accessories", type: "avatar_hat" },
    { id: "top_hat", name: "Top Hat", emoji: "🎩", price: 35, category: "accessories", type: "avatar_hat" },
    { id: "cowboy_hat", name: "Cowboy Hat", emoji: "🤠", price: 30, category: "accessories", type: "avatar_hat" },
    
    { id: "regular", name: "Glasses", emoji: "👓", price: 25, category: "accessories", type: "avatar_glasses" },
    { id: "sunglasses", name: "Sunglasses", emoji: "😎", price: 30, category: "accessories", type: "avatar_glasses" },
    { id: "reading", name: "Reading Glasses", emoji: "🤓", price: 25, category: "accessories", type: "avatar_glasses" },
    { id: "safety_goggles", name: "Safety Goggles", emoji: "🥽", price: 30, category: "accessories", type: "avatar_glasses" },
    { id: "3d_glasses", name: "3D Glasses", emoji: "🕶️", price: 30, category: "accessories", type: "avatar_glasses" },
    { id: "heart_shaped", name: "Heart Glasses", emoji: "😍", price: 35, category: "accessories", type: "avatar_glasses" },
    { id: "star_shaped", name: "Star Glasses", emoji: "🤩", price: 35, category: "accessories", type: "avatar_glasses" },
    
    { id: "backpack", name: "Backpack", emoji: "🎒", price: 30, category: "accessories", type: "avatar_accessory" },
    { id: "cape", name: "Cape", emoji: "🦸", price: 40, category: "accessories", type: "avatar_accessory" },
    { id: "scarf", name: "Scarf", emoji: "🧣", price: 25, category: "accessories", type: "avatar_accessory" },
    { id: "bow_tie", name: "Bow Tie", emoji: "🎀", price: 25, category: "accessories", type: "avatar_accessory" },
    { id: "necklace", name: "Necklace", emoji: "📿", price: 30, category: "accessories", type: "avatar_accessory" },
    { id: "watch", name: "Watch", emoji: "⌚", price: 35, category: "accessories", type: "avatar_accessory" },
    { id: "headphones", name: "Headphones", emoji: "🎧", price: 35, category: "accessories", type: "avatar_accessory" },
    { id: "earrings", name: "Earrings", emoji: "💎", price: 30, category: "accessories", type: "avatar_accessory" },
    { id: "bracelet", name: "Bracelet", emoji: "📿", price: 25, category: "accessories", type: "avatar_accessory" },
    
    // Backgrounds
    { id: "stars", name: "Starry Background", emoji: "⭐", price: 40, category: "backgrounds", type: "avatar_background" },
    { id: "rainbow", name: "Rainbow Background", emoji: "🌈", price: 40, category: "backgrounds", type: "avatar_background" },
    { id: "clouds", name: "Cloudy Background", emoji: "☁️", price: 35, category: "backgrounds", type: "avatar_background" },
    { id: "space", name: "Space Background", emoji: "🚀", price: 45, category: "backgrounds", type: "avatar_background" },
    { id: "underwater", name: "Underwater Background", emoji: "🌊", price: 45, category: "backgrounds", type: "avatar_background" },
    { id: "forest", name: "Forest Background", emoji: "🌲", price: 40, category: "backgrounds", type: "avatar_background" },
    { id: "city", name: "City Background", emoji: "🏙️", price: 40, category: "backgrounds", type: "avatar_background" },
    { id: "beach", name: "Beach Background", emoji: "🏖️", price: 40, category: "backgrounds", type: "avatar_background" },
    
    // Eyes
    { id: "cool", name: "Cool Eyes", emoji: "😎", price: 20, category: "facial", type: "avatar_eyes" },
    { id: "star", name: "Star Eyes", emoji: "🤩", price: 25, category: "facial", type: "avatar_eyes" },
    { id: "heart", name: "Heart Eyes", emoji: "😍", price: 25, category: "facial", type: "avatar_eyes" },
    { id: "sleepy", name: "Sleepy Eyes", emoji: "😴", price: 20, category: "facial", type: "avatar_eyes" },
    { id: "angry", name: "Determined Eyes", emoji: "😠", price: 20, category: "facial", type: "avatar_eyes" },
    { id: "surprised", name: "Surprised Eyes", emoji: "😲", price: 20, category: "facial", type: "avatar_eyes" },
    { id: "wink", name: "Winking Eyes", emoji: "😉", price: 25, category: "facial", type: "avatar_eyes" },
    
    // Face expressions
    { id: "laughing", name: "Laughing Face", emoji: "😆", price: 20, category: "facial", type: "avatar_face" },
    { id: "determined", name: "Determined Face", emoji: "😤", price: 20, category: "facial", type: "avatar_face" },
    { id: "neutral", name: "Neutral Face", emoji: "😐", price: 15, category: "facial", type: "avatar_face" },
    { id: "tongue_out", name: "Playful Face", emoji: "😛", price: 20, category: "facial", type: "avatar_face" },
  ],
  badges: [
  { id: "first_game", name: "First Game", emoji: "🎮", gradient: "from-green-400 to-emerald-500", description: "Completed your first game!", requirement: "Play 1 game", isAppIcon: true },
    { id: "star_collector", name: "Star Collector", emoji: "⭐", gradient: "from-yellow-400 to-orange-500", description: "Earned 50 stars!", requirement: "Earn 50 stars" },
    { id: "speed_demon", name: "Speed Demon", emoji: "⚡", gradient: "from-blue-400 to-cyan-500", description: "Complete a game in under 60 seconds", requirement: "Complete game < 60s" },
    { id: "perfectionist", name: "Perfectionist", emoji: "💯", gradient: "from-pink-400 to-purple-500", description: "Get 100% accuracy", requirement: "100% accuracy" },
    { id: "daily_warrior", name: "Daily Warrior", emoji: "🗓️", gradient: "from-red-400 to-orange-500", description: "Complete 7 daily challenges", requirement: "7 daily challenges" },
  ],
  powerUps: [
    { id: "time_freeze", name: "Time Freeze", emoji: "⏰", price: 10, coins: true, description: "Stop the timer for 10 seconds" },
    { id: "hint_helper", name: "Hint Helper", emoji: "💡", price: 5, coins: true, description: "Get a hint on a problem" },
    { id: "skip_question", name: "Skip Question", emoji: "⏭️", price: 8, coins: true, description: "Skip one difficult question" },
    { id: "double_stars", name: "Double Stars", emoji: "⭐⭐", price: 15, coins: true, description: "Earn 2x stars for next game" },
  ],
};

export default function Shop() {
  const queryClient = useQueryClient();
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("pets");
  const [showPremiumLock, setShowPremiumLock] = useState(false);
  const [premiumItem, setPremiumItem] = useState(null);
  const { toast } = useToast();

  const { user, loading: authLoading } = useUser();
  const { user: enrichedUser } = useFirebaseUser();

  const { data: progress = [] } = useQuery({
    queryKey: ['gameProgress', user?.email],
    queryFn: () => getUserGameProgress(user.email),
    enabled: !!user?.email,
  });

  const purchaseMutation = useMutation({
    mutationFn: async ({ itemId, price, type, coins }) => {
      if (!user?.email) throw new Error('Not signed in');

      // Recompute funds on client
      const totalStars = progress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
      const spentStars = user?.stars_spent || 0;
      const availableStars = totalStars - spentStars;
      const currentCoins = user?.coins || 0;

      if (coins) {
        if (currentCoins < price) throw new Error('Not enough coins');
        const nextPowerUps = { ...(user.power_ups || {}) };
        nextPowerUps[itemId] = (nextPowerUps[itemId] || 0) + 1;
        await updateUserProfile(user.email, {
          coins: currentCoins - price,
          power_ups: nextPowerUps,
        });
        return;
      }

      // Star-based purchase
      if (availableStars < price) throw new Error('Not enough stars');

      if (type === 'pet') {
        const owned = new Set(user?.owned_pets || []);
        if (!owned.has(itemId)) owned.add(itemId);
        await updateUserProfile(user.email, {
          stars_spent: spentStars + price,
          owned_pets: Array.from(owned),
        });
        return;
      }

      // avatar item (default)
      const unlocked = new Set(user?.unlocked_items || []);
      if (!unlocked.has(itemId)) unlocked.add(itemId);
      await updateUserProfile(user.email, {
        stars_spent: spentStars + price,
        unlocked_items: Array.from(unlocked),
      });
    },
    onMutate: async (vars) => {
      // Cancel outgoing queries so we don't overwrite optimistic data
      await queryClient.cancelQueries({ queryKey: ['currentUser'] });
      await queryClient.cancelQueries({ queryKey: ['gameProgress', user?.email] });

      const prevUser = queryClient.getQueryData(['currentUser']);
      const prevProgress = queryClient.getQueryData(['gameProgress', user?.email]);

      if (!prevUser) return { prevUser, prevProgress };

      const { itemId, price, type, coins } = vars;
      const draftUser = { ...prevUser };

      if (coins) {
        // Coin purchase: decrement coins, increment power ups count
        draftUser.coins = (draftUser.coins || 0) - price;
        if (draftUser.coins < 0) draftUser.coins = 0; // guard
        const pu = { ...(draftUser.power_ups || {}) };
        pu[itemId] = (pu[itemId] || 0) + 1;
        draftUser.power_ups = pu;
      } else if (type === 'pet') {
        draftUser.stars_spent = (draftUser.stars_spent || 0) + price;
        const owned = new Set(draftUser.owned_pets || []);
        owned.add(itemId);
        draftUser.owned_pets = Array.from(owned);
      } else {
        // avatar item
        draftUser.stars_spent = (draftUser.stars_spent || 0) + price;
        const unlocked = new Set(draftUser.unlocked_items || []);
        unlocked.add(itemId);
        draftUser.unlocked_items = Array.from(unlocked);
      }

      // Optimistically update user cache
      queryClient.setQueryData(['currentUser'], draftUser);

      return { prevUser, prevProgress };
    },
    onError: (err, _vars, context) => {
      // Rollback on error
      if (context?.prevUser) {
        queryClient.setQueryData(['currentUser'], context.prevUser);
      }
      toast({
        title: 'Purchase Failed',
        description: err.message.includes('Not enough') ? err.message : 'Could not complete purchase.',
      });
    },
    onSuccess: () => {
      setPurchaseSuccess(true);
      setTimeout(() => setPurchaseSuccess(false), 2500);
    },
    onSettled: () => {
      // Revalidate to ensure server truth wins
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['gameProgress', user?.email] });
    }
  });

  const activatePetMutation = useMutation({
    mutationFn: async (petId) => {
      if (!user?.email) throw new Error('Not signed in');
      const owned = new Set(user?.owned_pets || []);
      if (!owned.has(petId)) throw new Error('Pet not owned');
      await updateUserProfile(user.email, { active_pet: petId });
    },
    onMutate: async (petId) => {
      await queryClient.cancelQueries({ queryKey: ['currentUser'] });
      const prevUser = queryClient.getQueryData(['currentUser']);
      if (!prevUser) return { prevUser };
      const draft = { ...prevUser };
      // Optimistically set active pet if owned
      const owned = new Set(draft.owned_pets || []);
      if (owned.has(petId)) {
        draft.active_pet = petId;
        queryClient.setQueryData(['currentUser'], draft);
      }
      return { prevUser };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevUser) {
        queryClient.setQueryData(['currentUser'], context.prevUser);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const handlePurchase = (item, type = "avatar", coins = false) => {
    purchaseMutation.mutate({ 
      itemId: item.id, 
      price: item.price, 
      type,
      coins 
    });
  };

  const handleActivatePet = (petId) => {
    activatePetMutation.mutate(petId);
  };

  const isOwned = (itemId, type = "avatar") => {
    if (type === "pet") {
      return (user?.owned_pets || []).includes(itemId);
    }
    return (user?.unlocked_items || []).includes(itemId) || 
           (user?.purchased_items || []).includes(itemId);
  };

  const getAvailableStars = () => getAvailableStarsFromGame(progress, user);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Premium Feature Lock */}
      {showPremiumLock && (
        <PremiumFeatureLock
          featureName={premiumItem?.name || "Premium Item"}
          description="This exclusive item is available to premium subscribers. Upgrade to unlock all premium pets, avatar items, and more!"
          isOpen={showPremiumLock}
          onClose={() => {
            setShowPremiumLock(false);
            setPremiumItem(null);
          }}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Rewards Shop
        </h1>
        <p className="text-xl text-gray-600">Spend your stars and coins on awesome items!</p>
      </div>

      {/* Currency Display */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card className="border-4 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6 text-center">
            <Star className="w-12 h-12 mx-auto mb-2 text-yellow-500 fill-yellow-500" />
            <div className="text-4xl font-bold text-yellow-600 mb-1">{getAvailableStars()}</div>
            <p className="text-gray-600">Available Stars</p>
            <p className="text-xs text-gray-500 mt-1">
              Total: {getTotalGameStars(progress)} | Spent: {user?.stars_spent || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-6 text-center">
            <Coins className="w-12 h-12 mx-auto mb-2 text-blue-500" />
            <div className="text-4xl font-bold text-blue-600 mb-1">{getUserCoins(user)}</div>
            <p className="text-gray-600">Coins</p>
            <p className="text-xs text-gray-500 mt-1">For power-ups and boosts</p>
          </CardContent>
        </Card>
      </div>

      {purchaseSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Sparkles className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Purchase successful! Item added to your collection 🎉
          </AlertDescription>
        </Alert>
      )}

      {/* Daily Login Rewards */}
      <div className="mb-8">
        <DailyLoginRewards />
      </div>

      {/* Shop Tabs */}
      <Card className="border-2 border-purple-200">
        <CardContent className="p-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="pets">
                <Sparkles className="w-4 h-4 mr-2" />
                Pets
              </TabsTrigger>
              <TabsTrigger value="avatar">
                <Palette className="w-4 h-4 mr-2" />
                Avatar
              </TabsTrigger>
              <TabsTrigger value="badges">
                <Crown className="w-4 h-4 mr-2" />
                Badges
              </TabsTrigger>
              <TabsTrigger value="powerups">
                <Zap className="w-4 h-4 mr-2" />
                Power-Ups
              </TabsTrigger>
            </TabsList>

            {/* Pets Tab */}
            <TabsContent value="pets" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopItems.pets.map((pet) => {
                  const owned = isOwned(pet.id, "pet");
                  const isActive = user?.active_pet === pet.id;
                  const canAfford = getAvailableStars() >= pet.price;
                  const isPremiumLocked = pet.premium && !enrichedUser?.hasPremiumAccess;

                  return (
                    <Card key={pet.id} className={`border-2 ${isActive ? 'border-purple-500 ring-2 ring-purple-200' : isPremiumLocked ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>
                            {pet.name}
                            {pet.premium && <Crown className="w-4 h-4 inline ml-1 text-purple-500" />}
                          </span>
                          {isActive && <Badge className="bg-purple-500">Active</Badge>}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-center mb-4">
                          <PetDisplay 
                            pet={pet} 
                            experience={user?.pet_experience?.[pet.id] || 0}
                            size="large"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{pet.description}</p>
                        
                        {owned ? (
                          isActive ? (
                            <Button disabled className="w-full" variant="outline">
                              Currently Active
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleActivatePet(pet.id)}
                              className="w-full bg-purple-500 hover:bg-purple-600"
                            >
                              Set as Active
                            </Button>
                          )
                        ) : isPremiumLocked ? (
                          <Button
                            onClick={() => {
                              setPremiumItem(pet);
                              setShowPremiumLock(true);
                            }}
                            variant="outline"
                            className="w-full border-purple-400 text-purple-600"
                          >
                            <Crown className="w-4 h-4 mr-2" />
                            Premium Only
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handlePurchase(pet, "pet")}
                            disabled={!canAfford || purchaseMutation.isPending}
                            className={`w-full ${canAfford ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}`}
                          >
                            {canAfford ? (
                              <>
                                <Star className="w-4 h-4 mr-2 fill-white" />
                                Buy for {pet.price} Stars
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Need {pet.price - getAvailableStars()} more stars
                              </>
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Avatar Items Tab */}
            <TabsContent value="avatar" className="space-y-6">
              <Tabs defaultValue="hair">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="hair">Hair</TabsTrigger>
                  <TabsTrigger value="clothing">Clothing</TabsTrigger>
                  <TabsTrigger value="accessories">Accessories</TabsTrigger>
                  <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
                  <TabsTrigger value="facial">Facial</TabsTrigger>
                </TabsList>

                {['hair', 'clothing', 'accessories', 'backgrounds', 'facial'].map(category => (
                  <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {shopItems.avatarItems.filter(item => item.category === category).map((item) => {
                        const owned = isOwned(item.id);
                        const canAfford = getAvailableStars() >= item.price;
                        const isPremiumLocked = item.premium && !enrichedUser?.hasPremiumAccess;

                        return (
                          <Card key={item.id} className={`border-2 ${owned ? 'border-green-300 bg-green-50' : isPremiumLocked ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}>
                            <CardContent className="p-4 text-center">
                              <div className="text-4xl mb-2">{item.emoji}</div>
                              <h3 className="font-bold text-sm mb-2">
                                {item.name}
                                {item.premium && <Crown className="w-3 h-3 inline ml-1 text-purple-500" />}
                              </h3>
                              
                              {owned ? (
                                <Badge className="bg-green-500 text-white">Owned</Badge>
                              ) : isPremiumLocked ? (
                                <Button
                                  onClick={() => {
                                    setPremiumItem(item);
                                    setShowPremiumLock(true);
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="w-full border-purple-400 text-purple-600"
                                >
                                  <Crown className="w-3 h-3 mr-1" />
                                  Premium
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handlePurchase(item)}
                                  disabled={!canAfford || purchaseMutation.isPending}
                                  size="sm"
                                  className={`w-full ${canAfford ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}`}
                                >
                                  {canAfford ? (
                                    <>
                                      <Star className="w-3 h-3 mr-1 fill-white" />
                                      {item.price}
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3 h-3 mr-1" />
                                      {item.price}
                                    </>
                                  )}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges" className="space-y-6">
              <Alert className="bg-blue-50 border-blue-300">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Badges are earned by completing specific achievements. Keep playing to unlock them all!
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopItems.badges.map((badge) => (
                  <Card key={badge.id} className="border-2 border-gray-200">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-3">
                        <BadgeDisplay badge={badge} size="large" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{badge.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {badge.requirement}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Power-Ups Tab */}
            <TabsContent value="powerups" className="space-y-6">
              <Alert className="bg-cyan-50 border-cyan-300">
                <Coins className="w-4 h-4 text-cyan-600" />
                <AlertDescription className="text-cyan-800">
                  Power-ups are purchased with coins and can be used during games to help you succeed!
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {shopItems.powerUps.map((powerUp) => {
                  const canAfford = getUserCoins(user) >= powerUp.price;
                  const owned = (user?.power_ups || {})[powerUp.id] || 0;

                  return (
                    <Card key={powerUp.id} className="border-2 border-cyan-200">
                      <CardContent className="p-6 text-center">
                        <div className="text-5xl mb-3">{powerUp.emoji}</div>
                        <h3 className="font-bold mb-2">{powerUp.name}</h3>
                        <p className="text-xs text-gray-600 mb-3">{powerUp.description}</p>
                        
                        {owned > 0 && (
                          <Badge className="bg-green-500 text-white mb-2">
                            Owned: {owned}
                          </Badge>
                        )}

                        <Button
                          onClick={() => handlePurchase(powerUp, "powerup", true)}
                          disabled={!canAfford || purchaseMutation.isPending}
                          size="sm"
                          className={`w-full ${canAfford ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : ''}`}
                        >
                          {canAfford ? (
                            <>
                              <Coins className="w-4 h-4 mr-2" />
                              Buy for {powerUp.price}
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              Need {powerUp.price - getUserCoins(user)} coins
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Earn More Section */}
      <Card className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            How to Earn More
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="flex justify-center mb-2"><Logo size="sm" variant="circle" /></div>
            <h3 className="font-bold mb-1">Play Games</h3>
            <p className="text-sm text-gray-600">Earn up to 3 stars per game</p>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl mb-2">📅</div>
            <h3 className="font-bold mb-1">Daily Challenges</h3>
            <p className="text-sm text-gray-600">Get bonus rewards every day</p>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="font-bold mb-1">Achievements</h3>
            <p className="text-sm text-gray-600">Unlock items by achieving goals</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
