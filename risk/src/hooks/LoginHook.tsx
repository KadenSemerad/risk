import React, { ReactNode, createContext, useContext, useMemo, useState } from "react";
import User from "../models/Users/User";

interface AuthContextProps {
    children: ReactNode;
}

const AuthContext = createContext<{
    currentUser: User | null;
    login: (user: User) => void;
    logout: () => void;
} | undefined>(undefined);


export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (user: User) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("must use AuthProvider");
    };

    const contextValue = useMemo(() => context, [context]);

    const getCurrentUser = () => {
        return contextValue.currentUser;
    };

    return { ...contextValue, getCurrentUser };
};