// src/services/authService.jsx
import { auth, googleProvider, db } from "../firebase/config";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// Helper: Determine branch from email
export const deriveBranchFromEmail = (email) => {
    const firstChar = email.charAt(0);
    switch(firstChar) {
        case '1': return 'EXTC';
        case '2': return 'COMPS';
        case '3': return 'IT';
        case '4': return 'MECH';
        default: return 'Other';
    }
};

// 1. Handle the Google Popup and Domain Check
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // 🛑 DOMAIN CHECK
        if (!user.email.endsWith('@dbit.in')) {
            await signOut(auth);
            throw new Error("Access Restricted: Please use your college (@dbit.in) email.");
        }

        return user;
    } catch (error) {
        console.error("Auth Service Error:", error);
        throw error;
    }
};

// 2. Check if the user already has a profile in Firestore
export const checkUserProfileExists = async (email) => {
    if (!email) return false;

    // Using email as the Document ID
    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
};

// 3. Save the new user's full profile
export const registerNewUser = async (user, selectedYear) => {
    const detectedBranch = deriveBranchFromEmail(user.email);

    const userRef = doc(db, "users", user.email);

    await setDoc(userRef, {
        uid: user.uid,          // <--- ADDED: Crucial for Security Rules
        name: user.displayName,
        email: user.email,
        role: "admin",          // ⚠️ NOTE: You might want to change this to "student" for production!
        collegeYear: selectedYear,
        branch: detectedBranch,
        score: 0,
        createdAt: serverTimestamp(),
    });

    return { ...user, branch: detectedBranch, collegeYear: selectedYear };
};

// 4. Sign Out
export const logoutUser = () => {
    return signOut(auth);
};

// 5. Fetch User Profile
export const getUserProfile = async (email) => {
    try {
        if (!email) return null;

        const userRef = doc(db, "users", email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};