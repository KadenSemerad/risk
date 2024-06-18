import React from "react";
import DiceLogo from "../components/DiceLogo";
import RegistrationComponent from "../components/RegistrationComponent";
import "./styles/RegistrationPage.css"

const RegistrationPage: React.FC = ()=>{
    return(
        <div className = "registration-page">
            <DiceLogo/>
            <RegistrationComponent/>
        </div>
    );
}
export default RegistrationPage;