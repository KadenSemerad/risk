import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import toast from "react-hot-toast";

const PasswordResetComponent: React.FC = () => {
    const [newPassword, setNewPassword] = useState(``);

    const token: string | null = new URLSearchParams(window.location.search).get('Token');
    const userId: string | null = new URLSearchParams(window.location.search).get('UserId');

    const { Token, UserId } = useParams();
    const navigate = useNavigate();

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post("/api/Account/ResetPassword", {
                UserId,
                Token,
                newPassword
            });

            toast.success("Password reset");

            navigate("/login/normal");
        } catch (error) {
            toast.error("Failed to reset password");
        }
    }

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
                <label>New Password:</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default PasswordResetComponent;