import * as signalR from "@microsoft/signalr";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import GameBoard from '../components/GameBoard';
import GameProfile from "../components/GameProfile";
import LoadingComponent from "../components/LoadingComponent";
import TurnIndicator from "../components/TurnIndicator";
import { useAuth } from "../hooks/LoginHook";
import Game from "../models/Games/Game";
import Territory from '../models/Games/Territory';
import User from "../models/Users/User";
import { GameState } from "../utils/GameState";
import { TurnManager } from "../utils/TurnManager";
import "./styles/GamePage.css";

const GamePage: React.FC = () => {
    const navigate = useNavigate();
    const gameDataString: string | null = sessionStorage.getItem("game");
    const game: Game | null = gameDataString ? JSON.parse(gameDataString) : null;
    const user: User | null = useAuth().getCurrentUser();
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [gameStateInitialized, setGameStateInitialized] = useState<boolean>(false);
    const [turnManagerInitialized, setTurnManagerInitialized] = useState<boolean>(false);
    const [turnManager, setTurnManager] = useState<TurnManager | null>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [baseTerritoryId, setBaseTerritoryId] = useState<number | null>(null);
    const [targetTerritoryID, setTargetTerritoryId] = useState<number | null>(null);
    const [isTurn, setIsTurn] = useState<boolean>(user?.id === game?.player1Id);

    useEffect(() => {
        if (game && user && !gameStateInitialized) {
            const gameStateString: string | null = sessionStorage.getItem('gameState');
            if (gameStateString) {
                try {
                    const parsedGameState = JSON.parse(gameStateString);
                    setGameState(parsedGameState);
                    setGameStateInitialized(true);
                    setLoading(false);
                } catch (error) {
                    console.error('Error parsing game state:', error);
                    setError('Error parsing game state');
                    setLoading(false);
                }
            } else {
                GameState.createGameBoard(game, user)
                    .then(createdGameState => {
                        sessionStorage.setItem('gameState', JSON.stringify(createdGameState));
                        setGameState(createdGameState);
                        setGameStateInitialized(true);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error creating game board:', error);
                        setError('Error creating game board');
                        setLoading(false);
                    });
            }
        }
    }, [game, user, gameStateInitialized]);

    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        const handleGameBoardUpdate = (gameBoard: (Territory | null)[][]) => {
            if (game && user) {
                const updatedGameState: GameState = {
                    game: game,
                    user: user,
                    gameBoard: gameBoard,
                    initializeGameBoard: function (gameId: string): Promise<void> {
                        throw new Error("Function not implemented.");
                    },
                    fetchStartingGameBoard: function (gameId: string): Promise<(Territory | null)[][]> {
                        throw new Error("Function not implemented.");
                    },
                    setGameBoard: function (gameBoard: (Territory | null)[][] | null): void {
                        throw new Error("Function not implemented.");
                    }
                }
                setGameState(updatedGameState);
                sessionStorage.setItem('gameState', JSON.stringify(updatedGameState));
            }
        }

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`https://raikes-risk.azurewebsites.net/gamehub?userId=${user?.id}`, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .build();

        connection.start()
            .catch(error => toast.error(`Failed to connect to the game server. Status code: ${error}`));

        if (connection.on) {
            connection.on('UpdateGameBoard', (gameBoard: (Territory | null)[][]) => {
                handleGameBoardUpdate(gameBoard);
                handleRefresh();
            });
            

            connection.on('AttackResult', (won: boolean) => {
                won ? toast.success('You won the defense!') : toast.error(`You lost the defense`);
            });

            connection.on('TurnOver', () => {
                setIsTurn(true);
            });

            connection.on('GameOver', () => {
                toast.success('Defeat!');
                navigate('/loser');
            })
        }

        setConnection(connection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (gameState && user && !turnManagerInitialized) {
            const value: string | null = sessionStorage.getItem('turnManager');
        
            if (!value) {
                const createdTurnManager: TurnManager = new TurnManager(gameState, 0);
                setTurnManager(createdTurnManager);
                sessionStorage.setItem('turnManager', JSON.stringify(createdTurnManager));
                setTurnManagerInitialized(true);
            } else {
                const parsedValue = JSON.parse(value);
                setTurnManager(new TurnManager(parsedValue.gameState as GameState, parsedValue.phaseIndex as number))
            }
        }
    }, [gameState, user, turnManagerInitialized]);

    const [, setRefreshCount] = useState<number>(0);

    const handleRefresh = () => {
        setRefreshCount(prevCount => prevCount + 1);
    };

    const opponentId: string | undefined = game?.player1Id === user?.id ? game?.player2Id : game?.player1Id

    const openInNewTab = (url: string) => {
        window.open(url, "_blank", "noreferrer");
      };

    const skipTurn = () => {
        setIsTurn(false);
        connection!.invoke('SendTurnOver', opponentId);
        turnManager!.resetPhase();
    }

    if (!game || !user) {
        return (
            <div>
                <h1>No active game or user found</h1>
            </div>
        );
    }

    if (loading) {
        return <LoadingComponent text={"Loading..."} />;
    }

    if (error) {
        return (
            <div>
                <h1>{error}</h1>
            </div>
        );
    }

    return (
        <div className="game_page_container">
            {loading || !connection ? (
                <LoadingComponent text="Connecting to game server..." />
            ) : (
                <>
                    {!game || !user ? (
                        <div>
                            <h1>No active game or user found</h1>
                        </div>
                    ) : error ? (
                        <div>
                            <h1>{error}</h1>
                        </div>
                    ) : (
                        <>
                            <button className="rules-button" onClick={() => openInNewTab("https://www.hasbro.com/common/instruct/risk.pdf")}>?</button>
                            {gameState && <GameBoard
                                user={user}
                                gameState={gameState}
                                baseTerritoryId={baseTerritoryId}
                                setBaseTerritoryId={setBaseTerritoryId}
                                setTargetTerritoryId={setTargetTerritoryId}
                            />}
                            {turnManager && gameState && (
                                <GameProfile
                                    user={user}
                                    phase={turnManager.getCurrentPhase()}
                                    territoryCount={turnManager.getDraftCount()}
                                    isTurn={isTurn}
                                    skipTurn={skipTurn}
                                />
                            )}
                            {gameState && turnManager && game && user && (
                                <TurnIndicator
                                    gameState={gameState}
                                    connection={connection}
                                    turnManager={turnManager}
                                    baseTerritoryId={baseTerritoryId}
                                    targetTerritoryID={targetTerritoryID}
                                    opponentId={game.player1Id === user.id ? game.player2Id : game.player1Id}
                                    isTurn={isTurn}
                                    setIsTurn={setIsTurn}
                                    onRefresh={handleRefresh}
                                    phase={turnManager.getCurrentPhase()}
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
    
};

export default GamePage;
