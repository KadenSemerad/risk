import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "./LoadingComponent";
import "./styles/RegistrationComponent.css";

const RegistrationComponent: React.FC = () => {
    const [email, setEmail] = useState(``);
    const [userName, setUserName] = useState(``);
    const[password, setPassword] = useState(``);
    const[confirmPassword, setConfirmPassword]  = useState(``);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState("");
    const[firstName, setFirstName] = useState(``);
    const[lastName, setLastName] = useState(``);
    const navigate = useNavigate();

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
      try {
        if (password !== confirmPassword) {
            setErrorMessage("Please re-enter your password. Current passwords do not match.");
            setLoading(false);
            return;
        }

        await axios.post('/api/Account/Register', {
            email,
            firstName,
            lastName,
            userName,
            password,
        });

        navigate("/login/normal");

        toast.success("Registration Successful! We have sent an email to verify your account");
    } catch (error) {
        toast.error("Registration Failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className = "registration-component">
      {loading ? (
        <LoadingComponent text={`Loading...`}/>
      ) : (
        <div>
                <form className="registration-form" onSubmit={handleRegistration}>
                  <h2 className="sign-up-text">SIGN UP</h2>
                  <div className="name-inputs">
                    <div className="first-name-col">
                      <label className="first-name-label">first name</label>
                      <input className ="first-name-input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
                    </div>
                    <div className="last-name-col">
                      <label className="last-name-label">last name</label>
                      <input className ="last-name-input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
                    </div>
                  </div>
                  <div className = "user-email-inputs">
                    <div className="email-col"> 
                      <label className="email-label">email</label>
                      <input className ="email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="user-col"> 
                      <label className="username-label">username</label>
                      <input className ="username-input" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required/>
                    </div>
                  </div>
                  <div>
                    <label className="password-label">password</label>
                    <input className = "password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                  </div>
                  <div>
                    <label className="confirm-password-label">confirm password</label>
                    <input className = "confirm-password-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                  </div>  
                    <button className="registration-submit-button" type="submit">SIGN UP</button>
                </form>
        </div>
      )}
    </div>
  );
};

export default RegistrationComponent;