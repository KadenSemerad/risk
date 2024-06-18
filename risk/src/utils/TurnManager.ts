import Territory from "../models/Games/Territory";
import { GameState } from "./GameState";

export class TurnManager {
    private gameState: GameState;
    private turnPhases: string[];
    private phaseIndex: number;

    constructor(gameState: GameState, phaseIndex: number) {
        this.gameState = gameState;
        this.turnPhases = ["draft", "attack", "fortify"];
        this.phaseIndex = phaseIndex;
    }

    // determines how many troops can be placed during the draft phase
    getDraftCount(): number {
        let draftCount: number = 0;

        this.gameState.gameBoard?.forEach(row => {
            row.forEach(t => {
                if (t !== null && t.playerId === this.gameState.user.id) {
                    draftCount++;
                }
            })
        });

        return draftCount;
    }

    // places the draft troops based on the selected territory from the game board
    handleDraftPlacement(draftCount: number, territory: Territory): void {
        territory.troopCount += draftCount;

        this.advancePhase();
    }

    handleBattle(attackTerritory: Territory, defendTerritory: Territory): boolean {
        let attackerScore: number = 0;
        let defenderScore: number = 0;

        attackerScore = TurnManager.determineBattleScore(false, attackTerritory, defendTerritory);
        defenderScore = TurnManager.determineBattleScore(true, attackTerritory, defendTerritory);

        // tie goes to the defender
        if (attackerScore > defenderScore) {
            defendTerritory.playerId = this.gameState.user.id;
            defendTerritory.troopCount = attackTerritory.troopCount - 1;
            attackTerritory.troopCount = 1;
        } else {
            attackTerritory.troopCount = 1;
        }

        this.advancePhase();

        return attackerScore > defenderScore;
    }

    handleFortify(donationTerritory: Territory, recipientTerritory: Territory, troopCount: number): void {
        donationTerritory.troopCount -= troopCount;
        recipientTerritory.troopCount += troopCount;

        this.advancePhase();
    }

    advancePhase(): void {
        this.phaseIndex = (this.phaseIndex + 1) % this.turnPhases.length;
    }

    getPhaseIndex(): number {
        return this.phaseIndex;
    }

    getCurrentPhase(): string {
        return this.turnPhases[this.phaseIndex];
    }

    resetPhase(): void {
        this.phaseIndex = 0;
    }

    private static determineBattleScore(defenderBonus: boolean, attackTerritory: Territory, defendTerritory: Territory): number {
        const bonus: number = defenderBonus ? 1 : 0;
        let score: number = 0;

        for (let i = 0; i < attackTerritory.troopCount + bonus; i++) {
            score += Math.floor(Math.random() * 6) + 1;
        }

        return score;
    }
}
