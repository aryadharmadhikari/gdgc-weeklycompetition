import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
    loginWithGoogle,
    checkUserProfileExists,
    registerNewUser,
    logoutUser,
    getUserProfile // <--- MAKE SURE THIS IS IMPORTED
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
            const googleUser = await loginWithGoogle();
            const exists = await checkUserProfileExists(googleUser.uid);

            if (exists) {
                // [FIX] Fetch full profile (Role/Branch) before setting state
                const profileData = await getUserProfile(googleUser.uid);
                setUser({ ...googleUser, ...profileData });
            } else {
                setPendingUser(googleUser);
                setShowYearModal(true);
            }
        } catch (error) {
            throw error;
        }
    };

    // --- 2. COMPLETE REGISTRATION FLOW ---
    const completeSignup = async (selectedYear) => {
        if (!pendingUser) return;

        try {
            // Service returns the combined user object (Google + DB Data)
            const fullUser = await registerNewUser(pendingUser, selectedYear);

            setUser(fullUser);
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
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!showYearModal) {
                if (currentUser && !currentUser.email.endsWith('@dbit.in')) {
                    logoutUser();
                    setUser(null);
                } else if (currentUser) {
                    // [FIX] Fetch Firestore Data on Page Refresh
                    const profileData = await getUserProfile(currentUser.uid);

                    // Merge Google Data with Firestore Data (Role, Branch, Year)
                    setUser({ ...currentUser, ...profileData });
                } else {
                    setUser(null);
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