import { db } from "../firebase/config";
import { doc, getDoc, collection, getDocs, setDoc, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

// COLLECTION CONSTANTS
const LEADERBOARD_COLLECTION = "leaderboard";
const LEADERBOARD_DOC_ID = "global";
const USERS_COLLECTION = "users";

/**
 * 🚀 O(1) READ OPERATION
 * Fetches the pre-calculated leaderboard from a single document.
 * Cost: 1 Read per page load (regardless of user count).
 */
export const getLeaderboardData = async () => {
    try {
        const leaderboardRef = doc(db, LEADERBOARD_COLLECTION, LEADERBOARD_DOC_ID);
        const snapshot = await getDoc(leaderboardRef);

        if (snapshot.exists()) {
            const data = snapshot.data();
            // Return the array of top users stored in the 'participants' field
            return data.participants || [];
        } else {
            // Fallback if the aggregate document hasn't been created yet
            console.warn("Leaderboard aggregate not found. Fetching live data...");
            return await refreshLeaderboardCache();
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw new Error('Failed to load leaderboard data');
    }
};

/**
 * ⚙️ O(N) WRITE OPERATION (Admin Use Only)
 * Scans all users, calculates ranks, and updates the aggregate document.
 * Run this function when a quiz ends or scores change.
 */
export const refreshLeaderboardCache = async () => {
    try {
        console.log("Recalculating leaderboard...");

        // 1. Query Top 50 Users from the actual Users collection
        // Adjust 'limit' based on how many you want to show
        const usersRef = collection(db, USERS_COLLECTION);
        const q = query(usersRef, orderBy("score", "desc"), limit(100));
        const snapshot = await getDocs(q);

        const participants = [];
        let currentRank = 1;

        // 2. Process and Format Data
        snapshot.forEach((doc) => {
            const userData = doc.data();
            participants.push({
                id: doc.id,
                rank: currentRank++, // Calculate rank based on sort order
                name: userData.name || "Anonymous",
                email: userData.email, // Be careful exposing emails publicly
                // Fallback for avatar if missing
                photoURL: userData.photoURL || null,
                // Ensure we handle missing scores gracefully
                totalPoints: userData.score || 0,
                questionsCompleted: userData.questionsCompleted || 0
            });
        });

        // 3. Write the Array to the Single Aggregate Document
        const leaderboardRef = doc(db, LEADERBOARD_COLLECTION, LEADERBOARD_DOC_ID);
        await setDoc(leaderboardRef, {
            participants: participants,
            lastUpdated: serverTimestamp(),
            totalCount: participants.length
        });

        console.log("Leaderboard cache updated successfully!");
        return participants;

    } catch (error) {
        console.error("Error updating leaderboard cache:", error);
        return [];
    }
};

/**
 * Helper: Find user's specific stats from the live cache
 */
export const getUserLeaderboardPosition = async (userId) => {
    try {
        const data = await getLeaderboardData();
        return data.find(user => user.id === userId) || null;
    } catch (error) {
        console.error('Error fetching user position:', error);
        throw error;
    }
};