import Continent from './Continent';

interface Territory {
    id: number;
    continent: Continent;
    x: number;
    y: number;
    troopCount: number;
    playerId: string | null;
    adjacentTerritoryIds: number[];

    getPlayerName(): string | null;
    setPlayerName(playerId: string | null): void;
}

export default Territory;