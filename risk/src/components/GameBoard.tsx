import React, { useState } from "react";
import Territory from "../models/Games/Territory";
import User from "../models/Users/User";
import { GameState } from "../utils/GameState";
import LoadingComponent from "./LoadingComponent";
import "./styles/GameBoard.css";

const OCEAN_TILE_COLOR: string = '-LIGHT-colors-light-blue';
const UNCLAIMED_TERRITORY_COLOR: string = 'lightgrey' ;
const PLAYER_TERRITORY_COLOR: string = '#195B53';
const ENEMY_TERRITORY_COLOR: string = '#C85032';

interface GameBoardProps {
    user: User;
    gameState: GameState;
    baseTerritoryId: number | null;
    setBaseTerritoryId: React.Dispatch<React.SetStateAction<number | null>>;
    setTargetTerritoryId: React.Dispatch<React.SetStateAction<number | null>>;
}

const GameBoard: React.FC<GameBoardProps> = ({ user, gameState, baseTerritoryId, setBaseTerritoryId, setTargetTerritoryId }) => {
    const gameBoard = gameState.gameBoard;
    const [highlightedTerritories, setHighlightedTerritories] = useState<(number[] | undefined) | null>(null);

    const getTerritoryColor = (territory: Territory | null, isHighlighted: boolean) => {
        if (!territory) {
            return {
                backgroundColor: OCEAN_TILE_COLOR,
                borderRadius: '15px',
            };
        }
    
        return {
            backgroundColor: territory.playerId === null
                ? UNCLAIMED_TERRITORY_COLOR
                : (territory.playerId === user.id ? PLAYER_TERRITORY_COLOR : ENEMY_TERRITORY_COLOR),
            borderRadius: '15px',
            cursor: isHighlighted || (territory.playerId === user.id && !highlightedTerritories) ? 'pointer' : 'default'
        };
    };

    const handleTerritoryClick = (territory: Territory | null) => {
        if (!territory) {
            setHighlightedTerritories(null);
            setBaseTerritoryId(null);
            setTargetTerritoryId(null);
            return;
        }
    
        if (territory.playerId === user.id && (!highlightedTerritories || !highlightedTerritories.includes(territory.id))) {
            setBaseTerritoryId(territory.id);
            setHighlightedTerritories(territory.adjacentTerritoryIds);
        } else if (highlightedTerritories && baseTerritoryId && highlightedTerritories.includes(territory.id) && baseTerritoryId !== territory.id) {
            setTargetTerritoryId(territory.id);
            setHighlightedTerritories([baseTerritoryId, territory.id]);
        }
    };
    

    const highlightAdjacentTerritories = (rowIndex: number, columnIndex: number, id: number | null) => {
        if (highlightedTerritories != null && gameBoard![rowIndex][columnIndex] !== null && id != null) {
            return highlightedTerritories.some(ht => ht === id);
        }
        return false;
    };
    

    if (!gameBoard) {
        return <LoadingComponent text="Loading..."/>;
    }

    return (
        <div className="game-board" style={{ 
            display: "grid",
            gridTemplateColumns: `repeat(${gameBoard[0].length}, 50px)`, 
            gap: '5px'
        }}>
            {gameBoard.map((row, rowIndex) => (
                row.map((territory, columnIndex) => (
                    <div 
                        key={`${rowIndex}-${columnIndex}`} 
                        className="territory" 
                        style={{ ...getTerritoryColor(territory, highlightAdjacentTerritories(rowIndex, columnIndex, territory ? territory.id : null)),
                            border: highlightAdjacentTerritories(rowIndex, columnIndex, territory ? territory.id : null) ? '4px solid white' : 'none'}}
                        onClick={() => handleTerritoryClick(territory)}
                    >
                        {territory && territory.troopCount > 0 && <span className="troop_count">{territory.troopCount}</span>}
                    </div>
                ))
            ))}
        </div>
    );
}

export default GameBoard;
