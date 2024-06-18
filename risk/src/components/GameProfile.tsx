import React, { useEffect, useState } from "react";
import User from "../models/Users/User";
import "./styles/GameProfile.css";

interface GameProfileProps {
    user: User;
    phase: string;
    territoryCount: number;
    isTurn: boolean;
    skipTurn: () => void;
}

const GameProfile: React.FC<GameProfileProps> = ({ user, phase, territoryCount, isTurn, skipTurn }) => {
    const totalDuration = 20;
    const [time, setTime] = useState<number>(totalDuration);
    const radius = 93;
    const strokeWidth = 8;
    const viewBoxSize = radius * 2 + strokeWidth * 2;
    const viewBoxOffset = strokeWidth / 2;

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
    
        if (isTurn) {
            setTime(totalDuration);
            interval = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime > 0) {
                        if (prevTime === 1) {
                            skipTurn();
                            clearInterval(interval);
                            return 0;
                        }
                        return prevTime - 1;
                    }
                    return prevTime;
                });
            }, 1000);
        }
    
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isTurn, skipTurn]);


    const getToolTip = (phase: string) => {
        if (!isTurn) {
            return "Waiting for your opponent to complete their turn"
        }

        switch(phase) {
            case 'draft':
                return 'Select a territory to place an amount of troops equal to your territory count';
            case 'attack':
                return 'Select a friendly territory to stage your attack from then select any highlighted enemy territory to attack'
            case 'fortify':
                return 'Select a donor territory to send troops to another territory';
            default:
                return 'ERROR';
        }
    }

    return (
        <div className="game_profile_container">
            <div className="phase_indicator" title={getToolTip(phase)}>
                <span className="phase_indicator_text">PHASE: {isTurn ? phase.toUpperCase() : "WAITING"}</span>
            </div>
            <svg className="game_profile_circle" width="186" height="186" viewBox={`${-viewBoxOffset} ${-viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="93.5" cy="93" r="93" fill="#D9D9D9" stroke={isTurn ? "white" : "black"} stroke-width={strokeWidth}/>
                <circle cx="93.5" cy="93" r="93" fill="transparent" stroke={!isTurn ? "black" : (time > 15 ? "green" : (time > 10 ? "yellow" : (time > 5 ? "orange" : "red")))} stroke-width={strokeWidth}
                        stroke-dasharray={`${2 * Math.PI * radius} ${2 * Math.PI * radius}`}
                        stroke-dashoffset={2 * Math.PI * radius * (1 - time / totalDuration)}
                        className="countdown-circle"/>
                <text x="93" y="93" fill="black" text-anchor="middle" dominant-baseline="middle" font-family="Raleway" font-size="54">
                    {isTurn ? time : '...'}
                </text>
            </svg>
            <span className="territory_count">Territories: {territoryCount} / 178</span>
            <div className="game_profile_background">
                <span className="game_profile_user_name">{user.userName}</span>
            </div>
        </div>
    );
};  

export default GameProfile;