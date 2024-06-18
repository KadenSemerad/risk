import React, { useState } from "react";
import { useAuth } from "../hooks/LoginHook";
import useAddFriend from "../hooks/useAddFriend";
import AddFriendModal from "../modals/AddFriendModal";
import "./styles/AddFriendButton.css"

const AddFriendButton: React.FC = () => {
    const { getCurrentUser } = useAuth();
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
    const { addFriend, loading } = useAddFriend();
    const currentUser = getCurrentUser();

    const handleOpenAddFriendModal = () => {
        setIsAddFriendModalOpen(true);
    };

    const handleCloseAddFriendModal = () => {
        setIsAddFriendModalOpen(false);
    };

    const handleAddFriend = async (friendInfo: string, canSeeRealName: boolean) => {
        await addFriend({ requestorId: currentUser!.id, friendInfo, canSeeRealName });
        handleCloseAddFriendModal();
    };

    return (
        <div>
            <button className="add-friend-button" onClick={handleOpenAddFriendModal}>{!loading ? "ADD FRIENDS" : "Adding Friend..."}</button>
            <AddFriendModal
                isOpen={isAddFriendModalOpen}
                onClose={handleCloseAddFriendModal}
                onSubmit={handleAddFriend}
            />
        </div>
    );
};

export default AddFriendButton;