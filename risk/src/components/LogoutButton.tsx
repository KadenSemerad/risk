import React from "react";
import { useAuth } from "../hooks/LoginHook";
import { useNavigate } from "react-router-dom";
import "./styles/LogoutButton.css"

const LogoutButton: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    return (
        <div>
            <button className="logout-button" onClick={handleLogout}>logout</button>
        </div>
    );
}

export default LogoutButton;