import * as signalR from "@microsoft/signalr";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Territory from '../models/Games/Territory';
import { GameState } from '../utils/GameState';
import { TurnManager } from '../utils/TurnManager';
import "./styles/TurnIndicator.css";

interface TurnIndicatorProps {
    gameState: GameState;
    connection: signalR.HubConnection;
    turnManager: TurnManager;
    baseTerritoryId: number | null;
    targetTerritoryID: number | null;
    opponentId: string;
    isTurn: boolean;
    setIsTurn: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
    phase: string | null;
}

const TurnIndicator: React.FC<TurnIndicatorProps> = ({ gameState, connection, turnManager, baseTerritoryId, targetTerritoryID, opponentId, isTurn, setIsTurn, onRefresh, phase }) => {
    const [fortifyAmount, setFortifyAmount] = useState<number>(0);
    const navigate = useNavigate();
    
    const handleDraft = () => {
        const draftCount: number = turnManager.getDraftCount();
        const territory: Territory = gameState.gameBoard!.flat().find(t => t?.id === baseTerritoryId)!;
        turnManager.handleDraftPlacement(draftCount, territory);
        sessionStorage.setItem('gameState', JSON.stringify(gameState));
        sessionStorage.setItem('turnManager', JSON.stringify(turnManager));
        onRefresh();
        connection.invoke('SendTurn', opponentId, gameState.gameBoard);
    };

    const handleAttack = () => {
        const baseTerritory: Territory = gameState.gameBoard!.flat().find(t => t?.id === baseTerritoryId)!;
        const targetTerritory: Territory = gameState.gameBoard!.flat().find(t => t?.id === targetTerritoryID)!;
        const won: boolean = turnManager.handleBattle(baseTerritory, targetTerritory);
        if (won) {
            toast.success('You won the attack!');
            connection.invoke('SendAttackResult', opponentId, false);
        } else {
            toast.error('You lost the attack!')
            connection.invoke('SendAttackResult', opponentId, true);
        }
        sessionStorage.setItem('gameState', JSON.stringify(gameState));
        sessionStorage.setItem('turnManager', JSON.stringify(turnManager));
        onRefresh();
        connection.invoke('SendTurn', opponentId, gameState.gameBoard);
        checkForWin();
    };

    const handleFortify = () => {
        const baseTerritory: Territory = gameState.gameBoard!.flat().find(t => t?.id === baseTerritoryId)!;
        const targetTerritory: Territory = gameState.gameBoard!.flat().find(t => t?.id === targetTerritoryID)!;
        turnManager.handleFortify(baseTerritory, targetTerritory, fortifyAmount);
        setFortifyAmount(0);
        setIsTurn(false);
        sessionStorage.setItem('gameState', JSON.stringify(gameState));
        sessionStorage.setItem('turnManager', JSON.stringify(turnManager));
        onRefresh();
        connection.invoke('SendTurn', opponentId, gameState.gameBoard);
        connection.invoke('SendTurnOver', opponentId);
    };

    const checkForWin = () => {
        if (turnManager.getDraftCount() === gameState.gameBoard?.flat().length) {
            connection.invoke('SendGameResult');
            toast.success('Victory!');
            navigate('/winner');
        }
    }

    return (
        <div>
            {isTurn && phase === "draft" && <button onClick={handleDraft} className="indicator-button">Draft</button>}
            {isTurn && phase === "attack" && <button onClick={handleAttack} className="indicator-button">Attack</button>}
            {isTurn && phase === "fortify" && (
                <>
                    <input type="number" value={fortifyAmount} onChange={(e) => setFortifyAmount(parseInt(e.target.value))} className="fortify-input"/>
                    <button onClick={handleFortify} className="indicator-button">Fortify</button>
                </>
            )}
        </div>
    );
}

export default TurnIndicator;
