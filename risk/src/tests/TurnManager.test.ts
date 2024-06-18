import "@testing-library/jest-dom";
import Continent from '../models/Games/Continent';
import Game from '../models/Games/Game';
import Territory from '../models/Games/Territory';
import User from '../models/Users/User';
import { GameState } from '../utils/GameState';
import { TurnManager } from '../utils/TurnManager';


describe("In my web forum", () => {
    let turnManager: TurnManager;
    let territoryOne: Territory;
    let territoryTwo: Territory;
    let territoryThree: Territory;

    beforeEach(async () => { // Make the beforeEach callback asynchronous
        const mockGame: Game = {
            id: 'mockGameId',
            player1Id: 'player1Id',
            player2Id: 'player2Id',
            currentPlayer: 'player1Id', 
        };
        const mockUser: User = {
            id: 'mockUserId',
            userName: 'mockUserName',
            email: 'mockUserEmail',
            firstName: 'mockUserFirstName',
            lastName: 'mockUserLastName',
        };

        territoryOne = {
            id: 1, 
            continent: Continent.NorthAmerica, 
            x: 200, 
            y: 400,
            troopCount:0,
            playerId: null, 
            adjacentTerritoryIds: [],

            getPlayerName(): string | null {
                return this.playerId;
            },

            setPlayerName(playerId: string | null): void {
                this.playerId = playerId;
            }
        };  

        territoryTwo = {
            id: 2, 
            continent: Continent.NorthAmerica, 
            x: 100, 
            y: 300,
            troopCount:0,
            playerId: null, 
            adjacentTerritoryIds: [],
            getPlayerName(): string | null {
                return this.playerId;
            },

            setPlayerName(playerId: string | null): void {
                this.playerId = playerId;
            }
        };

        territoryThree = {
            id: 3, 
            continent: Continent.NorthAmerica, 
            x: 100, 
            y: 300,
            troopCount:4,
            playerId: null, 
            adjacentTerritoryIds: [],
            getPlayerName(): string | null {
                return this.playerId;
            },

            setPlayerName(playerId: string | null): void {
                this.playerId = playerId;
            }
        };

        const mockGameBoard: (Territory | null)[][] = [
            // add mock territories or null values as needed
            [territoryOne, territoryTwo],
            [null, territoryThree]
        ];

        // create GameState instance using static create method
        const gameState = new GameState(mockGame, mockUser); // await the result
        gameState.setGameBoard(mockGameBoard);
        // reset mocks and create new TurnManager instance before each test
        jest.clearAllMocks();
        turnManager = new TurnManager(gameState, 0);
    });

    // begin testing 
    it("should return 'draft' as the initial phase", () => {
        const initialPhase = turnManager.getCurrentPhase();

        // assert
        expect(initialPhase).toBe("draft");
        });

    it("should return 'attack' as the second phase once the phase advances", () => {
        // advance the phase
        turnManager.advancePhase();
    
        // check if the phase is now 'attack'
        const currentPhase = turnManager.getCurrentPhase();
        expect(currentPhase).toBe("attack");
        });
     
     it("should return 'fortify' as the third phase once the phase advances again", () => {
        // advance the phase twice to reach the 'fortify' phase
        turnManager.advancePhase(); 
        turnManager.advancePhase(); 
    
        // check if the phase is now 'fortify'
        const currentPhase = turnManager.getCurrentPhase();
        expect(currentPhase).toBe("fortify");
        });
    
    it("should return 'draft' after advancing through all phases", () => {
        // advance the phase through all phases
        turnManager.advancePhase(); 
        turnManager.advancePhase(); 
        turnManager.advancePhase(); 
        
        // check if the phase is now 'draft'
        const currentPhase = turnManager.getCurrentPhase();
        expect(currentPhase).toBe("draft");
        });

        it("should return 'draft' as the initial phase", () => {
        const initialPhase = turnManager.getCurrentPhase();

        // assert
        expect(initialPhase).toBe("draft");
        });

    it("should return 'draft' after advancing through all phases twice", () => {
        // advance the phase through all phases
        turnManager.advancePhase(); 
        turnManager.advancePhase(); 
        turnManager.advancePhase(); 
        turnManager.advancePhase(); 
        turnManager.advancePhase(); 
        turnManager.advancePhase(); 
        
        // check if the phase is now 'draft'
        const currentPhase = turnManager.getCurrentPhase();
        expect(currentPhase).toBe("draft");
        });

    it("should return 0 as the initial phaseIndex", () => {
        // call getPhaseIndex and check if it returns 0
        const initialPhaseIndex = turnManager.getPhaseIndex();

        // assert
        expect(initialPhaseIndex).toBe(0);
        });

    it("should return 1 as the phaseIndex associated with the 'attack' phase", () => {
        // call getPhaseIndex and check if it returns 0
        turnManager.advancePhase();
        const initialPhaseIndex = turnManager.getPhaseIndex();

        // assert
        expect(initialPhaseIndex).toBe(1);
        });
    
    it("should return 2 as the phaseIndex associated with the 'fortify' phase", () => {
        // call getPhaseIndex and check if it returns 0
        turnManager.advancePhase();
        turnManager.advancePhase();

        const initialPhaseIndex = turnManager.getPhaseIndex();

        // assert
        expect(initialPhaseIndex).toBe(2);
        });

    it("should return 0 as the phaseIndex after advancing through all phases once", () => {
        // call getPhaseIndex and check if it returns 0
        turnManager.advancePhase();
        turnManager.advancePhase();
        turnManager.advancePhase();

        const initialPhaseIndex = turnManager.getPhaseIndex();

        // assert
        expect(initialPhaseIndex).toBe(0);
        });
    
    it("should return 0 when there are no owned territories", () => {
        // call getDraftCount and check if it returns 0
        const draftCount = turnManager.getDraftCount();
        expect(draftCount).toBe(0);
        });

        
    it("The draft count should be 1 with one territory owned by the player", () => {
        territoryOne.setPlayerName('mockUserId');
        const draftCount = turnManager.getDraftCount();
        expect(draftCount).toBe(1);
    });

    it("The draft count should be 1 with  other territory owned by other player", () => {
        territoryOne.setPlayerName('mockUserId');
        territoryTwo.setPlayerName('player2Id');
        const draftCount = turnManager.getDraftCount();
        expect(draftCount).toBe(1);
    });

    it("The draft count should be 2 with one territory owned by each player", () => {
        territoryOne.setPlayerName('mockUserId');
        territoryTwo.setPlayerName('mockUserId');
        const draftCount = turnManager.getDraftCount();
        expect(draftCount).toBe(2);
    });

    it("The draft count should be 0 with other territory owned by other player", () => {
        territoryOne.setPlayerName('player2Id');
        territoryTwo.setPlayerName('player2Id');
        territoryThree.setPlayerName('player2Id');
        const draftCount = turnManager.getDraftCount();
        expect(draftCount).toBe(0);
    });

    it("The troop count should stay the same with a draft count of 0", () => {
        turnManager.handleDraftPlacement(0,territoryOne);
        const troopCount = territoryOne.troopCount
        expect(troopCount).toBe(0);
    });

    it("The troop count should increase by 21 with a draft count of 21", () => {
        turnManager.handleDraftPlacement(21,territoryOne);
        const troopCount = territoryOne.troopCount
        expect(troopCount).toBe(21);
    });

    it("The troop count should stay the same when increasing a different territory troop's", () => {
        turnManager.handleDraftPlacement(21,territoryOne);
        const troopCount = territoryTwo.troopCount
        expect(troopCount).toBe(0);
    });

    it("The phase is no longer draft after drafting", () => {
        turnManager.handleDraftPlacement(21,territoryOne);
        const currPhase = turnManager.getCurrentPhase()
        expect(currPhase).toBe("attack");
    });

    it("The phase is no longer draft after only handleBattle", () => {
        turnManager.handleBattle(territoryTwo,territoryOne);
        const currPhase = turnManager.getCurrentPhase()
        expect(currPhase).toBe("attack");
    });
    
    it("The phase is no longer draft after handleBattle and draftPLacement", () => {
        turnManager.handleDraftPlacement(2, territoryTwo)
        turnManager.handleBattle(territoryTwo,territoryOne);
        const currPhase = turnManager.getCurrentPhase()
        expect(currPhase).toBe("fortify");
    });

    it("The attackTerritory troopcount is 1 after handleBattle()", () => {
        turnManager.handleDraftPlacement(2, territoryTwo);
        turnManager.handleBattle(territoryTwo,territoryThree);
        const currPhase = territoryTwo.troopCount;
        expect(currPhase).toBe(1);
    });

    it("The attackTerritory troopcount is 1 after handleBattle() with different territories", () => {
        turnManager.handleDraftPlacement(6, territoryTwo);
        turnManager.handleBattle(territoryTwo,territoryOne);
        const currTroop = territoryTwo.troopCount;
        expect(currTroop).toBe(1);
    });

    it("The phase advances after handleFortify())", () => {
        turnManager.handleFortify(territoryOne, territoryTwo, 5);
        const currPhase = turnManager.getCurrentPhase();
        expect(currPhase).toBe("attack");
    });

    it("There is no difference in troops after adding zero troops", () => {
        turnManager.handleFortify(territoryOne, territoryTwo, 0);
        const currTroop = territoryTwo.troopCount;
        expect(currTroop).toBe(0);
    });

    it("There is a difference in troops associated with territoryTwo after adding one troop to territoryTwo", () => {
        turnManager.handleFortify(territoryOne, territoryTwo, 1);
        const currTroop = territoryTwo.troopCount;
        expect(currTroop).toBe(1);
    });

    it("There is a difference in troops associated with territoryOne after adding one troop to territoryOne", () => {
        turnManager.handleFortify(territoryTwo, territoryOne, 1);
        const currTroop = territoryOne.troopCount;
        expect(currTroop).toBe(1);
    });

    it("There is a difference in troops after adding seven troops to territoryTwo", () => {
        turnManager.handleFortify(territoryOne, territoryTwo, 7);
        const currTroop = territoryTwo.troopCount;
        expect(currTroop).toBe(7);
    });

    it("There is a difference in troops after adding seven troops with intitial troops", () => {
        turnManager.handleFortify(territoryOne, territoryThree, 7);
        const currTroop = territoryThree.troopCount;
        expect(currTroop).toBe(11);
    });

    it("There is no difference in troops after adding zero troops with intitial troops in a territoy", () => {
        turnManager.handleFortify(territoryOne, territoryThree, 0);
        const currTroop = territoryThree.troopCount;
        expect(currTroop).toBe(4);
    });
});