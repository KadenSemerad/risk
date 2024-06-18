import React from "react";
import "./styles/WinnerPage.css"
import User from "../models/Users/User";
import { useAuth } from "../hooks/LoginHook";
import WinnerNameRectangle from "../components/WinnerNameComponent";

const WinnerPage: React.FC = () => {
    const currentUser: User | null = useAuth().getCurrentUser();
    
    return (
        <>
        <div className="winner-page">
            <div className = "winner-container">
            <div className = "large-circle"></div>
            <div className = "winner-title">
                <p className = "winner-message"> Congrats</p>
            </div>
            <WinnerNameRectangle userName = {currentUser?.userName || "Unknown"}/>
            </div>
        </div>
        </>
    );
};

export default WinnerPage;