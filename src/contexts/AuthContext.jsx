import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
    loginWithGoogle,
    checkUserProfileExists,
    registerNewUser,
    logoutUser
} from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Registration States
    const [showYearModal, setShowYearModal] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);

    // --- 1. SIGN IN FLOW ---
    const signIn = async () => {
        try {
            // A. Call Service to handle Google Auth & Domain Check
            const googleUser = await loginWithGoogle();

            // B. Check if profile exists in DB
            const exists = await checkUserProfileExists(googleUser.uid);

            if (exists) {
                // User exists -> Log them in
                setUser(googleUser);
            } else {
                // User is new -> Show Modal
                setPendingUser(googleUser);
                setShowYearModal(true);
            }
        } catch (error) {
            // Pass error up to UI
            throw error;
        }
    };

    // --- 2. COMPLETE REGISTRATION FLOW ---
    const completeSignup = async (selectedYear) => {
        if (!pendingUser) return;

        try {
            // Call Service to write to DB
            await registerNewUser(pendingUser, selectedYear);

            // Finalize Login
            setUser(pendingUser);
            setShowYearModal(false);
            setPendingUser(null);
        } catch (error) {
            console.error("Registration Error:", error);
            throw error;
        }
    };

    const signOut = () => {
        return logoutUser();
    };

    // --- 3. SESSION MONITOR ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!showYearModal) {
                if (currentUser && !currentUser.email.endsWith('@dbit.in')) {
                    // Safety net: if session exists but email is wrong, kill it
                    logoutUser();
                    setUser(null)
                } else {
                    setUser(currentUser);
                }
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [showYearModal]);

    const value = {
        user,
        isAuthenticated: !!user,
        signIn,
        signOut,
        showYearModal,
        completeSignup
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};