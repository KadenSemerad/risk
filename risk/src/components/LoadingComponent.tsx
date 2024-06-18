import React, { useEffect, useRef } from "react";
import Dice from "react-dice-roll";
import "./styles/LoadingComponent.css";

interface LoadingComponentProps {
    text: string
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ text }) => {
    const diceRef = useRef<any>(null);

    useEffect(() => {
        if (diceRef.current) {
            const randomNumber = Math.floor(Math.random() * 6) + 1;
            diceRef.current.rollDice(randomNumber);
        }
    }, []);

    return (
        <div className="loading-component-container">
            <Dice ref={diceRef} rollingTime={100000} size={50}/>
            <h2 className="dice-loading-text">{text}</h2>
        </div>
    );
}

export default LoadingComponent;