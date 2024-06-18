import React from "react";
import "./styles/WinnerNameComponent.css";

interface WinnerNameComponentProps {
  userName: string;
}

const WinnerNameRectangle: React.FC<WinnerNameComponentProps> = ({ userName }) => {
  return (
    <div className="winner-name-component">
      <p className="username">{userName}</p>
    </div>
  );
}

export default WinnerNameRectangle;
