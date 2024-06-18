import React from "react";

interface ProfileButtonProps {
  onClick: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>Profile</button>
  );
};

export default ProfileButton;
