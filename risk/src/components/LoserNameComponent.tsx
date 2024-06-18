import React from "react";
import "./styles/LoserNameComponent.css";

interface LoserNameComponentProps {
  userName: string;
}

const LoserNameRectangle: React.FC<LoserNameComponentProps> = ({ userName }) => {
  return (
    <div className="loser-name-component">
      <p className="username">{userName}</p>
    </div>
  );
}

export default LoserNameRectangle;
