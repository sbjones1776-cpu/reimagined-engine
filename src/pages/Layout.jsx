// Trigger redeploy: trivial comment for workflow


import React, { useState, useEffect } from "react";
// Firebase migration
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app as firebaseApp } from "@/firebaseConfig"; // TODO: Ensure firebaseConfig.js is set up
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
// TODO: Refactor to use Firebase or new backend. Base44 import removed.
import { Home, Trophy, Calendar, User as UserIcon, ShoppingBag, Menu, X, Crown, Coins, Award, Users, GraduationCap, Sparkles, LogOut, Settings, BarChart3, CreditCard, ChevronDown, XCircle, Mail, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SimpleAuth from "@/components/SimpleAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import AvatarDisplay from "../components/avatar/AvatarDisplay";
import PetDisplay from "../components/rewards/PetDisplay";
import InstallPrompt from "../components/InstallPrompt";
import { format, startOfDay } from "date-fns";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Firebase user state
  const [user, setUser] = useState(null);
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // TODO: Map Firebase user to expected user object shape
        setUser({
          email: firebaseUser.email,
          full_name: firebaseUser.displayName,
          avatar_skin_tone: "medium", // TODO: fetch from Firestore
          coins: 0, // TODO: fetch from Firestore
          // ...other fields
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Get theme preference
  // Get theme preference from localStorage (Settings auto-saves there)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('app.theme') === 'dark';
  });

  // Listen for theme changes from localStorage (when Settings page changes theme)
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(localStorage.getItem('app.theme') === 'dark');
    };
    
    // Check theme on mount and whenever storage changes
    checkTheme();
    window.addEventListener('storage', checkTheme);
    
    // Also check periodically in case Settings changes on same tab
    const interval = setInterval(checkTheme, 500);
    
    return () => {
      window.removeEventListener('storage', checkTheme);
      clearInterval(interval);
    };
  }, []);

  // PWA meta tags (SW registration handled globally in main.jsx to avoid duplicates)
  useEffect(() => {
    // Add manifest link to head if not already present
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);

    // Add PWA meta tags
    const themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    // Dynamically set content based on isDarkMode
    themeColorMeta.content = isDarkMode ? "#1e293b" : "#9333ea";
    document.head.appendChild(themeColorMeta);

    const appleCapableMeta = document.createElement('meta');
    appleCapableMeta.name = 'apple-mobile-web-app-capable';
    appleCapableMeta.content = 'yes';
    document.head.appendChild(appleCapableMeta);

    const appleStatusStyleMeta = document.createElement('meta');
    appleStatusStyleMeta.name = 'apple-mobile-web-app-status-bar-style';
    appleStatusStyleMeta.content = 'default';
    document.head.appendChild(appleStatusStyleMeta);

    const appleTitleMeta = document.createElement('meta');
    appleTitleMeta.name = 'apple-mobile-web-app-title';
    appleTitleMeta.content = 'Math Adventure';
    document.head.appendChild(appleTitleMeta);

    // Add apple touch icon
    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
  // TODO: Refactor to use Firebase or new backend
  // appleIcon.href = '/icons/apple-touch-icon.png'; // Use your own hosted icon
    document.head.appendChild(appleIcon);

    // Cleanup function
    return () => {
      // Leave manifest and primary meta tags in place to avoid flicker if layout unmounts
      if (appleIcon.parentNode) appleIcon.remove();
    };
  }, [isDarkMode]); // Added isDarkMode as a dependency to ensure theme-color updates if user settings change

  // Check for unread messages
  // Firebase unread messages (stub)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  useEffect(() => {
    if (!user?.email) return;
    // TODO: Fetch unread messages from Firestore
    // Example: fetch from 'messages' collection where child_email == user.email && is_read == false
    setUnreadMessageCount(0); // Replace with actual count
  }, [user?.email]);

  // Compute data needed for hooks BEFORE any early return (to preserve hook order).
  const todayDate = format(startOfDay(new Date()), "yyyy-MM-dd");
  const { data: todaysChallenges = [] } = useQuery({
    queryKey: ['dailyChallenges', todayDate],
    initialData: [],
    enabled: !!user,
  });

  // Landing page just shows children; still we invoked hooks above.
  if (currentPageName === "Landing") {
    return <>{children}</>;  
  }

  // Simple auth gate (always after hooks) keeps hook order stable.
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="w-28 h-28 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-2xl mx-auto mb-6">
            <span className="text-6xl">🎮</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 drop-shadow-2xl">Math Adventure</h1>
          <p className="text-lg text-white mb-6 drop-shadow-lg">Sign in or create an account to start.</p>
          <SimpleAuth />
        </div>
      </div>
    );
  }

  const hasCompletedToday = todaysChallenges.some(c => c.created_by === user?.email);

  const avatarData = user ? {
    avatar_skin_tone: user.avatar_skin_tone || "medium",
    avatar_hair_style: user.avatar_hair_style || "short",
    avatar_hair_color: user.avatar_hair_color || "brown",
    avatar_eyes: user.avatar_eyes || "normal",
    avatar_outfit: user.avatar_outfit || "casual",
    avatar_accessory: user.avatar_accessory || "none",
  } : null;

  const activePet = user?.active_pet;
  const petData = activePet ? {
    id: activePet,
    name: "Pet",
    emoji: activePet === "dragon" ? "🐉" : activePet === "owl" ? "🦉" : activePet === "fox" ? "🦊" : "🦄",
    gradient: activePet === "dragon" ? "from-red-400 to-orange-500" : activePet === "owl" ? "from-indigo-400 to-purple-500" : activePet === "fox" ? "from-orange-400 to-red-500" : "from-pink-400 to-purple-500",
    evolveLevel: 5,
  } : null;

  const subscriptionTier = user?.subscription_tier || "free";
  const isSubscribed = subscriptionTier !== "free";

  const handleLogout = () => {
    const auth = getAuth(firebaseApp);
    signOut(auth);
  };

  const NavLink = ({ to, icon: Icon, label, badge, badgeColor = "red", isDarkMode }) => {
    const isActive = location.pathname === createPageUrl(to);
    return (
      <Link
        to={createPageUrl(to)}
        onClick={() => setMobileMenuOpen(false)}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
          isActive
            ? "bg-purple-500 text-white shadow-lg"
            : isDarkMode
              ? "text-gray-300 hover:bg-slate-700"
              : "text-gray-600 hover:bg-purple-50"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
        {badge && (
          <Badge className={`absolute -top-1 -right-1 bg-${badgeColor}-500 text-white text-xs px-1.5 py-0.5 ${badgeColor === 'red' ? 'animate-pulse' : ''}`}>
            {badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'}`}>
      {/* PWA related meta tags are now handled in useEffect for better SSR compatibility and direct DOM manipulation */}

      <style>{`
        :root {
          --primary: 168 85% 55%;
          --secondary: 280 65% 60%;
          --accent: 45 95% 55%;
          --success: 142 76% 45%;
        }

        @media all and (display-mode: standalone) {
          body {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
          }
        }

        ${isDarkMode ? `
          * {
            scrollbar-width: thin;
            scrollbar-color: #475569 #1e293b;
          }

          *::-webkit-scrollbar {
            width: 8px;
          }

          *::-webkit-scrollbar-track {
            background: #1e293b;
          }

          *::-webkit-scrollbar-thumb {
            background: #475569;
            border-radius: 4px;
          }

          *::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
        ` : ''}
      `}</style>

      <header className={`${isDarkMode ? 'bg-slate-800/90' : 'bg-white/80'} backdrop-blur-md shadow-sm sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
                <span className="text-2xl transform -rotate-12">🎮</span>
              </div>
              <div>
                <h1 className={`text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${isDarkMode && 'from-purple-400 to-pink-400'}`}>
                  Math Adventure
                </h1>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
              <NavLink to="Home" icon={Home} label="Home" isDarkMode={isDarkMode} />
              <NavLink
                to="DailyChallenge"
                icon={Calendar}
                label="Daily"
                badge={!hasCompletedToday ? "!" : null}
                isDarkMode={isDarkMode}
              />
              <NavLink to="Progress" icon={Trophy} label="Progress" isDarkMode={isDarkMode} />
              <NavLink
                to="AITutor"
                icon={Brain}
                label="AI Tutor"
                isDarkMode={isDarkMode}
              />
              <NavLink
                to="Messages"
                icon={Mail}
                label="Messages"
                badge={unreadMessageCount > 0 ? unreadMessageCount : null}
                badgeColor="blue"
                isDarkMode={isDarkMode}
              />
              <NavLink to="Shop" icon={ShoppingBag} label="Shop" isDarkMode={isDarkMode} />
              <NavLink
                to="ParentPortal"
                icon={GraduationCap}
                label="Parents"
                badge={user?.is_parent_mode ? "ON" : null}
                badgeColor="blue"
                isDarkMode={isDarkMode}
              />
            </nav>

            <div className="flex items-center gap-2">
              {user && (
                <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-2 rounded-xl shadow-md">
                  <Coins className="w-4 h-4" />
                  <span className="font-bold text-sm">{user.coins || 0}</span>
                </div>
              )}
              {user && (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="hidden md:inline-flex"
                >
                  Sign out
                </Button>
              )}

              {subscriptionTier !== "free" ? (
                <button
                  onClick={() => window.open(createPageUrl("Subscription"), '_blank', 'noopener,noreferrer')}
                  className="hidden md:block"
                >
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1.5 cursor-pointer">
                    <Crown className="w-3 h-3 mr-1" />
                    {subscriptionTier === "family_teacher" ? "Family" : subscriptionTier === "premium_player" ? "Premium" : "Parent"}
                  </Badge>
                </button>
              ) : (
                <button
                  onClick={() => window.open(createPageUrl("Subscription"), '_blank', 'noopener,noreferrer')}
                  className="hidden md:block"
                >
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 py-1.5 cursor-pointer animate-pulse">
                    <Crown className="w-3 h-3 mr-1" />
                    Upgrade
                  </Badge>
                </button>
              )}

              {user && (
                <div className="hidden lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={`${isDarkMode ? 'hover:bg-slate-700 text-gray-50' : 'hover:bg-purple-50 text-gray-900'} h-auto p-2`}>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {avatarData && (
                              <div className="scale-75 origin-center">
                                <AvatarDisplay avatarData={avatarData} size="small" />
                              </div>
                            )}
                            {petData && (
                              <div className="scale-50 origin-center -ml-2">
                                <PetDisplay
                                  pet={petData}
                                  experience={user?.pet_experience?.[activePet] || 0}
                                  size="small"
                                />
                              </div>
                            )}
                          </div>
                          <div className="text-left hidden xl:block">
                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}>{user.full_name || 'Player'}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{user.email}</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={`${isDarkMode ? 'bg-slate-800 border-slate-700 text-gray-50' : 'bg-white'} w-56`}>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}>{user.full_name || 'Player'}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className={isDarkMode ? 'bg-slate-700' : ''} />
                      <DropdownMenuItem asChild className={isDarkMode ? 'focus:bg-slate-700' : ''}>
                        <Link to={createPageUrl("Avatar")} className="cursor-pointer">
                          <UserIcon className="w-4 h-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className={isDarkMode ? 'focus:bg-slate-700' : ''}>
                        <Link to={createPageUrl("Messages")} className="cursor-pointer">
                          <Mail className="w-4 h-4 mr-2" />
                          Messages
                          {unreadMessageCount > 0 && (
                            <Badge className="ml-auto bg-blue-500 text-white text-xs">
                              {unreadMessageCount}
                            </Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className={isDarkMode ? 'focus:bg-slate-700' : ''}>
                        <Link to={createPageUrl("Progress")} className="cursor-pointer">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Progress & Stats
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className={isDarkMode ? 'focus:bg-slate-700' : ''}>
                        <Link to={createPageUrl("Shop")} className="cursor-pointer">
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Rewards Shop
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className={isDarkMode ? 'focus:bg-slate-700' : ''}>
                        <Link to={createPageUrl("ParentPortal")} className="cursor-pointer">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Parent Portal
                          {user?.is_parent_mode && (
                            <Badge className="ml-2 bg-blue-500 text-white text-xs">ON</Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className={isDarkMode ? 'bg-slate-700' : ''} />
                      <DropdownMenuItem asChild className={isDarkMode ? 'focus:bg-slate-700' : ''}>
                        <Link to={createPageUrl("Settings")} className="cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          App Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className={isDarkMode ? 'focus:bg-slate-700' : ''}>
                        <Link to={createPageUrl("Subscription")} className="cursor-pointer">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Manage Subscription
                        </Link>
                      </DropdownMenuItem>
                      {isSubscribed && user?.subscription_auto_renew !== false && (
                        <DropdownMenuItem asChild className={isDarkMode ? 'focus:bg-slate-700' : ''}>
                          <Link to={createPageUrl("Subscription")} className="cursor-pointer text-orange-600 focus:text-orange-600">
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel Subscription
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className={isDarkMode ? 'bg-slate-700' : ''} />
                      <DropdownMenuItem onClick={handleLogout} className={`${isDarkMode ? 'text-red-400 focus:bg-slate-700 focus:text-red-400' : 'text-red-600 focus:text-red-600'} cursor-pointer`}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden ${isDarkMode ? 'text-gray-50 hover:bg-slate-700' : ''}`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`lg:hidden mt-4 pb-4 space-y-2 border-t pt-4 ${isDarkMode ? 'border-slate-700' : ''}`}>
              {user && (
                <div className={`${isDarkMode ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-gray-50' : 'bg-gradient-to-r from-purple-50 to-pink-50'} p-4 rounded-xl mb-4`}>
                  <div className="flex items-center gap-3 mb-3">
                    {avatarData && (
                      <div className="scale-90 origin-center">
                        <AvatarDisplay avatarData={avatarData} size="small" />
                      </div>
                    )}
                    <div>
                      <p className={`font-bold ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}>{user.full_name || 'Player'}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                      <Coins className="w-3 h-3 mr-1" />
                      {user.coins || 0} Coins
                    </Badge>
                    {subscriptionTier !== "free" && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        {subscriptionTier === "family_teacher" ? "Family" : subscriptionTier === "premium_player" ? "Premium" : "Parent"}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <NavLink to="Home" icon={Home} label="Home" isDarkMode={isDarkMode} />
              <NavLink
                to="DailyChallenge"
                icon={Calendar}
                label="Daily Challenge"
                badge={!hasCompletedToday ? "!" : null}
                isDarkMode={isDarkMode}
              />
              <NavLink to="Progress" icon={Trophy} label="Progress" isDarkMode={isDarkMode} />
              <NavLink to="AITutor" icon={Brain} label="AI Tutor" isDarkMode={isDarkMode} />
              <NavLink
                to="Messages"
                icon={Mail}
                label="Messages"
                badge={unreadMessageCount > 0 ? unreadMessageCount : null}
                badgeColor="blue"
                isDarkMode={isDarkMode}
              />
              <NavLink to="Leaderboards" icon={Award} label="Leaderboards" isDarkMode={isDarkMode} />
              <NavLink to="Shop" icon={ShoppingBag} label="Shop" isDarkMode={isDarkMode} />
              <NavLink to="TeamChallenges" icon={Users} label="Team Challenges" isDarkMode={isDarkMode} />
              <NavLink
                to="ParentPortal"
                icon={GraduationCap}
                label="Parent Portal"
                badge={user?.is_parent_mode ? "ON" : null}
                badgeColor="blue"
                isDarkMode={isDarkMode}
              />
              <NavLink to="Avatar" icon={UserIcon} label="Profile" isDarkMode={isDarkMode} />

              <div className={`pt-2 mt-2 border-t ${isDarkMode ? 'border-slate-700' : ''}`}>
                <Link to={createPageUrl("Settings")} onClick={() => setMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-50 hover:bg-gray-700' : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">App Settings</span>
                  </div>
                </Link>
              </div>

              <div className={`pt-2 border-t ${isDarkMode ? 'border-slate-700' : ''}`}>
                <Link to={createPageUrl("GenerateIcons")} onClick={() => setMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white ${isDarkMode ? 'hover:from-blue-600 hover:to-cyan-600' : ''}`}>
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">Generate PWA Icons</span>
                    <Badge className="bg-green-400 text-white text-xs">New!</Badge>
                  </div>
                </Link>
              </div>

              <div className={`pt-2 border-t ${isDarkMode ? 'border-slate-700' : ''}`}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.open(createPageUrl("Subscription"), '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full"
                >
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                    subscriptionTier !== "free"
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse"
                  }`}>
                    <Crown className="w-5 h-5" />
                    <span className="font-medium">
                      {subscriptionTier !== "free" ? "Manage Subscription" : "Upgrade to Premium"}
                    </span>
                  </div>
                </button>
              </div>

              {user && (
                <div className={`pt-2 border-t ${isDarkMode ? 'border-slate-700' : ''}`}>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl ${isDarkMode ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40' : 'bg-red-50 text-red-600 hover:bg-red-100'} transition-colors`}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Bottom Navigation (Mobile) */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-t'} backdrop-blur-md shadow-lg z-40`}>
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          <Link
            to={createPageUrl("Home")}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all ${
              location.pathname === createPageUrl("Home")
                ? "bg-purple-500 text-white"
                : isDarkMode ? "text-gray-300 hover:bg-slate-700" : "text-gray-600"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          <Link
            to={createPageUrl("DailyChallenge")}
            className={`relative flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all ${
              location.pathname === createPageUrl("DailyChallenge")
                ? "bg-purple-500 text-white"
                : isDarkMode ? "text-gray-300 hover:bg-slate-700" : "text-gray-600"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-medium">Daily</span>
            {!hasCompletedToday && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </Link>

          <Link
            to={createPageUrl("AITutor")}
            className={`relative flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all ${
              location.pathname === createPageUrl("AITutor")
                ? "bg-purple-500 text-white"
                : isDarkMode ? "text-gray-300 hover:bg-slate-700" : "text-gray-600"
            }`}
          >
            <Brain className="w-5 h-5" />
            <span className="text-xs font-medium">Tutor</span>
          </Link>

          <Link
            to={createPageUrl("Shop")}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all ${
              location.pathname === createPageUrl("Shop")
                ? "bg-purple-500 text-white"
                : isDarkMode ? "text-gray-300 hover:bg-slate-700" : "text-gray-600"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-medium">Shop</span>
          </Link>

          <Link
            to={createPageUrl("Avatar")}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all ${
              location.pathname === createPageUrl("Avatar")
                ? "bg-purple-500 text-white"
                : isDarkMode ? "text-gray-300 hover:bg-slate-700" : "text-gray-600"
            }`}
          >
            {avatarData ? (
              <div className="scale-50 origin-center -my-2">
                <AvatarDisplay avatarData={avatarData} size="small" />
              </div>
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </div>

      <InstallPrompt />

      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>

      <footer className={`${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white/60 border-gray-200'} backdrop-blur-sm mt-12 py-8 border-t`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Keep practicing and have fun! 🌟</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>© 2025 Math Adventure. All rights reserved.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to={createPageUrl("PrivacyPolicy")}
                className={`text-sm ${isDarkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`}
              >
                Privacy Policy
              </Link>
              <span className={isDarkMode ? 'text-gray-600' : 'text-gray-300'}>•</span>
              <Link
                to={createPageUrl("Subscription")}
                className={`text-sm ${isDarkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`}
              >
                Pricing
              </Link>
              <span className={isDarkMode ? 'text-gray-600' : 'text-gray-300'}>•</span>
              <a
                href="mailto:support@math-adventure.com"
                className={`text-sm ${isDarkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

