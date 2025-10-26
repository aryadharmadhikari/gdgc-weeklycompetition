import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config.jsx';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config.jsx';

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Verify domain restriction
        if (!user.email.endsWith('@dbit.in')) {
            await signOut(auth);
            throw new Error('Access restricted to DBIT email addresses only. Please use your @dbit.in email.');
        }

        // Store/update user information in Firestore
        await createOrUpdateUserProfile(user);

        return {
            success: true,
            user: {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                profilePicture: user.photoURL
            }
        };
    } catch (error) {
        console.error('Authentication error:', error);

        // Handle specific error cases
        if (error.code === 'auth/popup-closed-by-user') {
            throw new Error('Sign-in cancelled. Please try again.');
        } else if (error.code === 'auth/popup-blocked') {
            throw new Error('Pop-up blocked. Please allow pop-ups and try again.');
        } else if (error.message.includes('dbit.in')) {
            throw error; // Re-throw domain restriction error
        } else {
            throw new Error('Sign-in failed. Please try again.');
        }
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Sign-out error:', error);
        throw new Error('Sign-out failed. Please try again.');
    }
};

// Create or update user profile in Firestore
const createOrUpdateUserProfile = async (user) => {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        const userData = {
            name: user.displayName,
            email: user.email,
            profilePicture: user.photoURL,
            lastSignIn: new Date(),
            domain: 'dbit.in'
        };

        if (!userSnap.exists()) {
            // New user - create profile
            await setDoc(userRef, {
                ...userData,
                createdAt: new Date(),
                totalPoints: 0,
                questionsCompleted: 0,
                competitions: []
            });
        } else {
            // Existing user - update profile
            await setDoc(userRef, userData, { merge: true });
        }
    } catch (error) {
        console.error('Error creating/updating user profile:', error);
    }
};

// Get current user
export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            if (user && user.email.endsWith('@dbit.in')) {
                resolve(user);
            } else {
                resolve(null);
            }
        }, reject);
    });
};
