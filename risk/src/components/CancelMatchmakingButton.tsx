import React from "react";
import useMatchmaking from "../hooks/useMatchmaking";
import "./styles/CancelMatchmakingButton.css";

interface CancelMatchmakingButtonProps {
    userId: string;
    onCancelMatchmaking: () => void;
}

const CancelMatchmakingButton: React.FC<CancelMatchmakingButtonProps> = ({ userId, onCancelMatchmaking }) => {
    const { cancelMatchmaking } = useMatchmaking();

    const handleClick = async () => {
        await cancelMatchmaking(userId);
        onCancelMatchmaking();
    };

    return (
        <div>
            <button onClick={handleClick} className="cancel_matchmaking_button">CANCEL</button>
        </div>
    );
};

export default CancelMatchmakingButton;