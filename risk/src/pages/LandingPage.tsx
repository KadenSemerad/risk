import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import landing_page from "../assets/landing_page.png";
import LoadingComponent from "../components/LoadingComponent";
import { useAuth } from "../hooks/LoginHook";
import "./styles/LandingPage.css";

const LandingPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { getCurrentUser } = useAuth();

    useEffect(() => {
        setTimeout(() => {
            setIsLoggedIn(getCurrentUser() != null); 
            setLoading(false);
        }, 500);
    });

    const navigate = useNavigate();

    return (
        <div className="landing-page-container">
            {loading ? (
                <LoadingComponent text={"Loading..."}/>
            ) : (
                <>
                    <img src={landing_page} alt="Landing Page" className="landing-page-img"/>
                    <div className="info-container">
                        <h1 className="title">RISK</h1>
                        <p className="tagline">- THE GAME OF GLOBAL DOMINATION -</p>
                        {isLoggedIn ? (
                            <button className="landing-page-login-button" onClick={() => navigate('/home')}>
                                <span className="login-button-text">HOME</span>
                            </button>
                        ) : (
                            <button className="landing-page-login-button" onClick={() => navigate('/login/normal')}>
                                <span className="login-button-text">LOGIN</span>
                            </button>
                        )}
                        <button className="landing-page-sign-up-button" onClick={() => navigate('/register')}>
                            <span className="sign-up-button-text">SIGN UP</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LandingPage;
