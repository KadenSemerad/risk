import axios from "axios";
import React, { useEffect, useState } from "react";
import LeaderboardCell from "../components/LeaderboardCell";
import "./styles/LeaderboardModal.css";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    console.log(isOpen)

    useEffect(() => {
        const fetchLeaderboard = async () => {
          try {
            const response = await axios.post("/api/Stats/GetLeaderBoard");
            setLeaderboard(response.data);
          } catch (error) {
            console.error("Error fetching leaderboard:", error);
          }
        };
    
        if (isOpen) {
          fetchLeaderboard();
        }
      }, [isOpen]);

      console.log(leaderboard[0]);

      return (
        isOpen ? (
          <div className="leaderboard-modal-background" onClick={onClose}>
            <div className="leaderboard-title-text-background">
              <div className="leaderboard-modal-card-title">LEADERBOARD</div>
            </div>
            {Object.entries(leaderboard).map(([username, wins],index) => (
              <LeaderboardCell
                key={username}
                username={username}
                wins={wins}
                rank={1+index}
              />
            ))}
          </div>
        ) : null
      );
      
      
    }

export default LeaderboardModal;
