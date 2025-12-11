import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
    loginWithGoogle,
    checkUserProfileExists,
    registerNewUser,
    logoutUser,
    getUserProfile
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
            // A. Google Login
            const googleUser = await loginWithGoogle();

            // B. Check DB existence
            // 🛑 CRITICAL FIX: Pass 'email', not 'uid'
            const exists = await checkUserProfileExists(googleUser.email);

            if (exists) {
                // User exists -> Fetch Profile using EMAIL
                const dbProfile = await getUserProfile(googleUser.email);

                // Merge Google Data + Firestore Data
                setUser({ ...googleUser, ...dbProfile });
            } else {
                // User is new -> Show Modal
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

    // --- 3. SESSION MONITOR (Runs on Refresh) ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!showYearModal) {
                if (currentUser) {
                    // Double check domain rule
                    if (!currentUser.email.endsWith('@dbit.in')) {
                        logoutUser();
                        setUser(null);
                    } else {
                        // 🛑 CRITICAL FIX: Pass 'email' here too
                        const dbProfile = await getUserProfile(currentUser.email);

                        // If dbProfile is null (rare case where Auth exists but DB doesn't), handle gracefully
                        if (dbProfile) {
                            setUser({ ...currentUser, ...dbProfile });
                        } else {
                            // Edge case: User logged in via Firebase but deleted from DB manually
                            // You might want to force logout here or show modal again
                            // For now, we just set the basic user
                            setUser(currentUser);
                        }
                    }
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