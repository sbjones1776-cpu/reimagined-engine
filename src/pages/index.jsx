import Layout from "./Layout.jsx";

import Home from "./Home";

import Game from "./Game";

import Progress from "./Progress";

import Avatar from "./Avatar";

import DailyChallenge from "./DailyChallenge";

import ParentPortal from "./ParentPortal";

import Shop from "./Shop";

import Leaderboards from "./Leaderboards";

import TeamChallenges from "./TeamChallenges";

import Subscription from "./Subscription";

import GenerateIcons from "./GenerateIcons";

import TestIconGeneration from "./TestIconGeneration";

import Landing from "./Landing";

import Messages from "./Messages";

import ColorByNumbers from "./ColorByNumbers";

import Settings from "./Settings";

import PrivacyPolicy from "./PrivacyPolicy";

import AITutor from "./AITutor";

import AdminTestAccount from "./AdminTestAccount";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

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

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
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
                
            </Routes>
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