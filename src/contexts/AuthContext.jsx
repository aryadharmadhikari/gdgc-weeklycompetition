import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider, db } from "../firebase/config";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Controls the popup visibility
    const [showYearModal, setShowYearModal] = useState(false);
    // Holds the user data temporarily until they pick a year
    const [pendingUser, setPendingUser] = useState(null);

    // --- LOGIC: 1=EXTC, 2=COMPS, 3=IT, 4=MECH ---
    const deriveBranchFromEmail = (email) => {
        const firstChar = email.charAt(0);
        switch(firstChar) {
            case '1': return 'EXTC';
            case '2': return 'COMPS';
            case '3': return 'IT';
            case '4': return 'MECH';
            default: return 'Other';
        }
    };

    const signIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const googleUser = result.user;

            // Check if user already exists in Firestore
            const userRef = doc(db, "users", googleUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                // RETURNING USER: Log them in immediately
                setUser(googleUser);
            } else {
                // NEW USER: Do not log in yet. Show the modal.
                setPendingUser(googleUser);
                setShowYearModal(true);
            }
        } catch (error) {
            console.error("Error signing in:", error);
            throw error;
        }
    };

    // --- CALLED BY MODAL WHEN 'SAVE' IS CLICKED ---
    const completeSignup = async (selectedYear) => {
        if (!pendingUser) return;

        try {
            // 1. Auto-detect branch
            const detectedBranch = deriveBranchFromEmail(pendingUser.email);

            const userRef = doc(db, "users", pendingUser.uid);

            // 2. Save Full Profile to DB
            await setDoc(userRef, {
                uid: pendingUser.uid,
                name: pendingUser.displayName,
                email: pendingUser.email,
                photoURL: pendingUser.photoURL,
                role: "student",
                collegeYear: selectedYear, // Input from User
                branch: detectedBranch,    // Auto-detected
                score: 0,
                createdAt: serverTimestamp(),
            });

            // 3. Official Login
            setUser(pendingUser);
            setShowYearModal(false);
            setPendingUser(null);
        } catch (error) {
            console.error("Error completing signup:", error);
        }
    };

    const signOut = () => {
        return firebaseSignOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // Only update user state if we aren't in the middle of registration
            if (!showYearModal) {
                setUser(currentUser);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        signIn,
        signOut,
        showYearModal, // To show/hide modal
        completeSignup // To save data
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};