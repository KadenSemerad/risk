import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface AddFriendParams {
    requestorId: string;
    friendInfo: string;
    canSeeRealName: boolean;
}

const useAddFriend = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const addFriend = async ({ requestorId, friendInfo, canSeeRealName }: AddFriendParams) => {
        setLoading(true);
        try {
            await axios.post("/api/Friends/AddFriend", {
                requestorId,
                friendInfo,
                canSeeRealName
            });

            toast.success(`Sent friend request to ${friendInfo}`);
        } catch (error) {
            toast.error("No user found with that info");
        } finally {
            setLoading(false);
        }
    };

    return { addFriend, loading };
};

export default useAddFriend;