import React, { useState } from "react";
import landing_page from "../assets/landing_page.png";
import AddFriendButton from "../components/AddFriendButton";
import { StartMatchmakingButton } from "../components/StartMatchmakingButton";
import { useAuth } from "../hooks/LoginHook";
import LeaderboardModal from "../modals/LeaderboardModal";
import MainMenuModal from "../modals/MainMenuModal";
import User from "../models/Users/User";
import "./styles/HomePage.css";

const HomePage: React.FC = () => {
    const currentUser: User | null = useAuth().getCurrentUser();
    const [openMenuModal, setOpenMenuModal] = useState<boolean>(false);
    const [openLeaderboardModal, setOpenLeaderboardModal] = useState<boolean>(false);

    const toggleMenuModal = ()=>{
        setOpenMenuModal(!openMenuModal);
    }
    const toggleLeaderboardModal = () => {
        setOpenLeaderboardModal(!openLeaderboardModal);
    }

    if (!currentUser) {
        return (
            <div>
                <h1>You are not logged in</h1>
            </div>
        );
    }

    sessionStorage.clear()

    return (
        <> 
        <img src={landing_page} alt="Landing Page" className="landing-page-img"/>
        <div className="home-page">
            <h1 className="title">RISK</h1>
            
            <div className="buttons-container">
                <AddFriendButton />
                <button className="leaderboard-button" onClick={toggleLeaderboardModal}>
                </button>
                <StartMatchmakingButton userId={currentUser.id} />
                <button className="menu-button" onClick={toggleMenuModal}>
                </button>
            </div>
            <MainMenuModal isOpen={openMenuModal} onClose={toggleMenuModal} />
            <LeaderboardModal isOpen={openLeaderboardModal} onClose={toggleLeaderboardModal} />
           </div>
        </>
    );
}

export default HomePage;