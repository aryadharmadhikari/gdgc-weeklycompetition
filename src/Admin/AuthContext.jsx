import React, { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext(null);

// Create the "Provider" component
export const AuthProvider = ({ children }) => {
    // User is null (logged out) by default
    const [user, setUser] = useState(null);

    // Function to simulate logging in as an admin
    const loginAsAdmin = () => {
        setUser({
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin'
        });
    };

    // Function to simulate logging in as a regular user
    const loginAsUser = () => {
         setUser({
            name: 'Regular User',
            email: 'user@example.com',
            role: 'user'
        });
    };

    // Function to log out
    const logout = () => {
        setUser(null);
    };

    const value = { user, loginAsAdmin, loginAsUser, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Create a custom hook to easily use the context
export const useAuth = () => {
    return useContext(AuthContext);
};
