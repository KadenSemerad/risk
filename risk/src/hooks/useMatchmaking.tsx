import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Game from "../models/Games/Game";

const useMatchmaking = () => {
    const navigate = useNavigate();

    const startMatchmaking = async (userId: string) => {

        try {
            // Join matchmaking queue
            await axios.post("/api/Matchmaking/JoinQueue", userId, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Start matchmaking
            const response = await axios.post("/api/Matchmaking/StartMatchmaking", userId, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const gameData: any = response.data;
            const game: Game = {
                id: gameData.Id,
                player1Id: gameData.Player1Id,
                player2Id: gameData.Player2Id,
                currentPlayer: gameData.Player1Id,
            };

            sessionStorage.setItem("game", JSON.stringify(game));

            navigate(`/game/${game.id}`)

            toast.success("Match found");
        } catch (error: any) {
            if (error.response && error.response.data) {
                if (error.response.data.toString() !== "Failed to find a match")
                {
                    toast.error("Matchmaking failed");
                }
            }
        }
    };

    const cancelMatchmaking = async (userId: string) => {
        try {
            await axios.post("/api/Matchmaking/LeaveQueue", userId, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            toast.success("Matchmaking canceled");

            navigate("/home");
        } catch (error) {
            toast.error("Failed to cancel matchmaking");
        }
    };

    return {startMatchmaking, cancelMatchmaking};
}

export default useMatchmaking;