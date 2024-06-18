import React from "react";
import "./styles/LoserPage.css"
import User from "../models/Users/User";
import { useAuth } from "../hooks/LoginHook";
import LoserNameRectangle from "../components/LoserNameComponent";

const LoserPage: React.FC = () => {
    const currentUser: User | null = useAuth().getCurrentUser();

    return (
        <>
        <div className="loser-page">
            <div className = "loser-container">
            <div className = "large-circle-loser"></div>
            <div className = "loser-title">
                <p className = "loser-message"> Loser</p>
            </div>
            <LoserNameRectangle userName = {currentUser?.userName || "Unknown"}/>
            </div>
        </div>
        </>
    );
};

export default LoserPage;