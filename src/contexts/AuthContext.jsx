import React, { useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
    loginWithGoogle,
    checkUserProfileExists,
    registerNewUser,
    logoutUser,
    getUserProfile
} from "../services/authService";
import { AuthContext } from "./useAuth";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showYearModal, setShowYearModal] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);

    const signIn = async () => {
        const googleUser = await loginWithGoogle();
        const exists = await checkUserProfileExists(googleUser.email);

        if (exists) {
            const dbProfile = await getUserProfile(googleUser.email);
            setUser({ ...googleUser, ...dbProfile });
        } else {
            setPendingUser(googleUser);
            setShowYearModal(true);
        }
    };

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

    const signOut = () => logoutUser();

    useEffect(() => {
        // FIX 1: Returned onAuthStateChanged directly (removed redundant 'unsubscribe' variable)
        return onAuthStateChanged(auth, async (currentUser) => {
            if (!showYearModal) {
                if (currentUser) {
                    // Check domain
                    if (currentUser.email && !currentUser.email.endsWith('@dbit.in')) {
                        // FIX 2: Added 'await' because this function is async
                        await logoutUser();
                        setUser(null);
                    } else {
                        // Fetch profile for valid user
                        const dbProfile = await getUserProfile(currentUser.email);
                        if (dbProfile) {
                            setUser({ ...currentUser, ...dbProfile });
                        } else {
                            setUser(currentUser);
                        }
                    }
                } else {
                    setUser(null);
                }
            }
            setLoading(false);
        });
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