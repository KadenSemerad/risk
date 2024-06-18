import React from "react";
import dice_logo from "../assets/dice_logo.png";
import "./styles/DiceLogo.css";

const DiceLogo: React.FC = () => {
    return (
        <div className="logo-container">
                <img src={dice_logo} alt="Dice Logo" className="dice-logo"/>
                <span className="logo-text">RISK</span>
            </div>
    );
};

export default DiceLogo;