import React from "react";
import "./styles/LeaderboardCell.css";

interface LeaderboardCellProps {
    username: string;
    wins: number;
    rank: number; 
}

const LeaderboardCell: React.FC<LeaderboardCellProps> = ({ username, wins, rank }) => {
  return (
    <div className="leaderboard-cell">
      <span className="leaderboard-cell-rank">{rank}</span>
      <span className="leaderboard-cell-username">{username}</span>
      <span className="leaderboard-cell-wins">{wins}</span>
      <span className="leaderboard-cell-trophy"></span>
    </div>
  );
};
export default LeaderboardCell;