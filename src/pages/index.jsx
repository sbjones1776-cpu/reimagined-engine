import React, { lazy, Suspense } from 'react';
import Layout from "./Layout.jsx";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Lazy load Home and Landing too to shrink unauthenticated bundle
const Home = lazy(() => import('./Home'));
const Landing = lazy(() => import('./Landing'));

// Lazy load all other pages for better code splitting
const Game = lazy(() => import("./Game"));
const Progress = lazy(() => import("./Progress"));
const Avatar = lazy(() => import("./Avatar"));
const DailyChallenge = lazy(() => import("./DailyChallenge"));
const ParentPortal = lazy(() => import("./ParentPortal"));
const Shop = lazy(() => import("./Shop"));
const Leaderboards = lazy(() => import("./Leaderboards"));
const TeamChallenges = lazy(() => import("./TeamChallenges"));
const Subscription = lazy(() => import("./Subscription"));
const GenerateIcons = lazy(() => import("./GenerateIcons"));
const TestIconGeneration = lazy(() => import("./TestIconGeneration"));
const Messages = lazy(() => import("./Messages"));
const ColorByNumbers = lazy(() => import("./ColorByNumbers"));
const Settings = lazy(() => import("./Settings"));
const PrivacyPolicy = lazy(() => import("./PrivacyPolicy"));
const AITutor = lazy(() => import("./AITutor"));
const AdminTestAccount = lazy(() => import("./AdminTestAccount"));
const Subscribe = lazy(() => import("./Subscribe"));

const PAGES = {
    
    Home: Home,
    
    Game: Game,
    
    Progress: Progress,
    
    Avatar: Avatar,
    
    DailyChallenge: DailyChallenge,
    
    ParentPortal: ParentPortal,
    
    Shop: Shop,
    
    Leaderboards: Leaderboards,
    
    TeamChallenges: TeamChallenges,
    
    Subscription: Subscription,
    
    GenerateIcons: GenerateIcons,
    
    TestIconGeneration: TestIconGeneration,
    
    Landing: Landing,
    
    Messages: Messages,
    
    ColorByNumbers: ColorByNumbers,
    
    Settings: Settings,
    
    PrivacyPolicy: PrivacyPolicy,
    
    AITutor: AITutor,
    
    AdminTestAccount: AdminTestAccount,
    
    Subscribe: Subscribe,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Loading fallback component for lazy-loaded routes
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading...</p>
        </div>
    </div>
);

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Suspense fallback={<PageLoader />}>
                <Routes>            
                    
                        <Route path="/" element={<Home />} />
                    
                    
                    <Route path="/Home" element={<Home />} />
                
                <Route path="/Game" element={<Game />} />
                
                <Route path="/Progress" element={<Progress />} />
                
                <Route path="/Avatar" element={<Avatar />} />
                
                <Route path="/DailyChallenge" element={<DailyChallenge />} />
                
                <Route path="/ParentPortal" element={<ParentPortal />} />
                
                <Route path="/Shop" element={<Shop />} />
                
                <Route path="/Leaderboards" element={<Leaderboards />} />
                
                <Route path="/TeamChallenges" element={<TeamChallenges />} />
                
                <Route path="/Subscription" element={<Subscription />} />
                
                <Route path="/GenerateIcons" element={<GenerateIcons />} />
                
                <Route path="/TestIconGeneration" element={<TestIconGeneration />} />
                
                <Route path="/Landing" element={<Landing />} />
                
                <Route path="/Messages" element={<Messages />} />
                
                <Route path="/ColorByNumbers" element={<ColorByNumbers />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                
                <Route path="/AITutor" element={<AITutor />} />
                
                <Route path="/AdminTestAccount" element={<AdminTestAccount />} />
                
                <Route path="/Subscribe" element={<Subscribe />} />
                
                </Routes>
            </Suspense>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}