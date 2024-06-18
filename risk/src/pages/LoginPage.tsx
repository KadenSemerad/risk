import React from "react";
import DiceLogo from "../components/DiceLogo";
import LoginComponent from "../components/LoginComponent";
import "./styles/LoginPage.css";

const LoginPage: React.FC = () => {
    return (
        <div className="login-page">
            <DiceLogo/>
            <LoginComponent/>
        </div>
    );
};

export default LoginPage;