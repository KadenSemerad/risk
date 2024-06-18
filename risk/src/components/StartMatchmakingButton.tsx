import React, { useEffect, useState } from "react";
import useMatchmaking from "../hooks/useMatchmaking";
import CancelMatchmakingButton from "./CancelMatchmakingButton";
import "./styles/StartMatchmakingButton.css";

interface StartMatchmakingButtonProps {
    userId: string;
}

export const StartMatchmakingButton: React.FC<StartMatchmakingButtonProps> = ({ userId }) => {
    const { startMatchmaking } = useMatchmaking();
    const [matchmaking, setMatchmaking] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState({ minutes: 0, seconds: 0 });

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;
        if (matchmaking) {
            intervalId = setInterval(() => {
                setTimeElapsed(prevTime => {
                    const newSeconds = prevTime.seconds + 1;
                    const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
                    return { minutes: newMinutes, seconds: newSeconds % 60 };
                });
            }, 1000);
        } else {
            clearInterval(intervalId!);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [matchmaking]);

    const handleClick = async () => {
        setMatchmaking(true);
        await startMatchmaking(userId);
    };

    const handleCancellation = () => {
        setMatchmaking(false);
        setTimeElapsed({ minutes: 0, seconds: 0 });
    };

    return (
        <div>
            {matchmaking ? (
                <div>
                    <button className="start_matchmaking_button" disabled>
                        {timeElapsed.minutes}:{timeElapsed.seconds < 10 ? "0" + timeElapsed.seconds : timeElapsed.seconds}
                    </button>
                    <CancelMatchmakingButton userId={userId} onCancelMatchmaking={handleCancellation} />
                </div>
            ) : (
                <button onClick={handleClick} className="start_matchmaking_button">START MATCHMAKING</button>
            )}
        </div>
    );
};

export default StartMatchmakingButton;
