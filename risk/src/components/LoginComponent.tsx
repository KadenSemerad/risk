import axios, { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/LoginHook";
import User from "../models/Users/User";
import LoadingComponent from "./LoadingComponent";
import "./styles/LoginComponent.css";



const LoginComponent: React.FC = () => {
    const { login } = useAuth();
    const [userName, setUserName] = useState(``);
    const [password, setPassword] = useState(``);
    const { confirmationStatus }= useParams();
    const isMounted = useRef(true);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (confirmationStatus === "success" && isMounted.current) {
            toast.success("Email verified");
        } else if (confirmationStatus === "failure" && isMounted.current) {
            toast.error("Failed to verify email");
        }

        isMounted.current = false;
    }, [confirmationStatus]);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await axios.post('/api/Account/Login', {
                userName: userName,
                password: password,
            });
        
            const user: User = {
                id: response.data.Id,
                userName: response.data.UserName,
                email: response.data.Email,
                firstName: response.data.FirstName,
                lastName: response.data.LastName,
            };
        
            login(user);
        
            navigate("/home");
        
            toast.success("Login Successful!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                console.log(axiosError)
                if (axiosError.response) {
                    if (axiosError.response.data) {
                        toast.error(axiosError.response.data.toString());
                    } else {
                        toast.error('Network Error');
                    }
                } else {
                    toast.error('Network Error');
                }
            } else {
                toast.error('An error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordResetRequest = async () => {
        try {
            await axios.post("/api/Account/PasswordResetRequest", { email: userName });

            toast.success("We have sent an email with steps to reset your password");
        } catch (error) {
            toast.error("Failed to request password reset");
        }
    }

    return (
        loading ? (
            <LoadingComponent text="Loading..."/>
        ) : (
            <div className="login-component">
                <form onSubmit={handleLogin} className="login-form">
                    <h2 className="login-text">LOGIN</h2>
                    <label className="username-label">username</label>
                    <input type="username" value={userName} onChange={(e) => setUserName(e.target.value)} required className="username-login-input"/>
                    <label className="password-label">password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="password-login-input"/>
                    <span onClick={handlePasswordResetRequest} className="forgot-password-text">forgot password?</span>
                    <button type="submit" className="login-submit-button">LOGIN</button>
                </form>
            </div>
        )
    );
};

export default LoginComponent;