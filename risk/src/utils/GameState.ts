import Game from "../models/Games/Game";
import Territory from "../models/Games/Territory";
import User from "../models/Users/User";

export class GameState {
    public game: Game;
    public user: User;
    public gameBoard: (Territory | null)[][] | null;

    public constructor(game: Game, user: User) {
        this.game = game;
        this.user = user;
        this.gameBoard = null;
    }

    static async createGameBoard(game: Game, user: User): Promise<GameState> {
        const instance = new GameState(game, user);
        await instance.initializeGameBoard(game.id);
        return instance;
    }

    async initializeGameBoard(gameId: string): Promise<void> {
        try {
            const fetchedGameBoard = await this.fetchStartingGameBoard(gameId);
            const mappedGameBoard = fetchedGameBoard.map((row: any) =>
                row.map((territory: any) => {
                    if (territory) {
                        const newTerritory: Territory = {
                            id: territory.Id,
                            continent: territory.Continent,
                            x: territory.X,
                            y: territory.Y,
                            troopCount: territory.TroopCount,
                            playerId: territory.PlayerId,
                            adjacentTerritoryIds: territory.AdjacentTerritoryIds,
                            setPlayerName: function (playerId: string | null): void {
                                throw new Error("Function not implemented.");
                            },
                            getPlayerName: function (): string | null {
                                throw new Error("Function not implemented.");
                            }
                        };
                        return newTerritory;
                    } else {
                        return null;
                    }
                })
            );
            this.gameBoard = mappedGameBoard;
        } catch (error) {
            throw error;
        }
    }

    async fetchStartingGameBoard(gameId: string): Promise<any> {
        try {
            // use fetch instead of axios due to Jest bug
            const response = await fetch("https://raikes-risk.azurewebsites.net/api/GameBoard/StartingGameBoard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(gameId)
            });
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    setGameBoard(gameBoard: (Territory | null)[][] | null): void {
        this.gameBoard = gameBoard;
    }
}
