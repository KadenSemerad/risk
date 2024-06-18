import axios from 'axios';
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import PasswordResetComponent from "./components/PasswordResetComponent";
import { AuthProvider } from "./hooks/LoginHook";
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import LandingPage from "./pages/LandingPage";
import LoginPage from './pages/LoginPage';
import LoserPage from './pages/LoserPage';
import RegistrationPage from './pages/RegistrationPage';
import WinnerPage from './pages/WinnerPage';


axios.defaults.baseURL = "https://raikes-risk.azurewebsites.net";

function App() {
  return (
      <AuthProvider>
          <Router>
              <Toaster position="top-right" />
              <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/register" element={ <RegistrationPage/> } />
                  <Route path="/login/:confirmationStatus" element={ <LoginPage/> } />
                  <Route path="/resetPassword/:Token/:UserId" element={<PasswordResetComponent />} />
                  <Route path="/home" element={<HomePage />}/>
                  <Route path="/game/:id" element={<GamePage/ >} />
                  <Route path='/winner' element={<WinnerPage/ >}/>
                  <Route path='/loser' element={<LoserPage/ >}/>
              </Routes>
          </Router>
      </AuthProvider>
  );
};

export default App;
