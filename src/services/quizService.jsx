import { db } from "../firebase/config";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    updateDoc,
    increment
} from "firebase/firestore";

// COLLECTION CONSTANTS
const WEEKS_COLLECTION = "weeks";
const SUBMISSIONS_COLLECTION = "submissions";
const USERS_COLLECTION = "users";

/**
 * 🔍 Fetch Quiz Questions
 */
export const getQuizWeeks = async () => {
    try {
        const weeksRef = collection(db, WEEKS_COLLECTION);
        const q = query(weeksRef, where("isVisible", "==", true));
        const snapshot = await getDocs(q);

        const weeksData = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            weeksData[data.id] = data.questions;
        });
        return weeksData;
    } catch (error) {
        console.error("Error fetching quiz weeks:", error);
        throw error;
    }
};

/**
 * 📝 Submit Quiz Answers
 */
export const submitQuizWeek = async (userId, userEmail, weekId, formattedSolutions) => {
    try {
        const submissionId = `${userId}_${weekId}`;
        const submissionRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);
        const userRef = doc(db, USERS_COLLECTION, userId);

        const docSnap = await getDoc(submissionRef);
        const isNewSubmission = !docSnap.exists();

        await setDoc(submissionRef, {
            userId,
            userEmail,
            weekId,
            solutions: formattedSolutions,
            status: 'submitted',
            submittedAt: serverTimestamp(),
        }, { merge: true });

        if (isNewSubmission) {
            await updateDoc(userRef, {
                questionsCompleted: increment(formattedSolutions.length)
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error submitting quiz:", error);
        throw error;
    }
};

/**
 * ➕ Add New Week (Admin Only) -> [NEW FUNCTION]
 * Creates a new document in the 'weeks' collection.
 */
export const addQuizWeek = async (weekId, weekTitle, questions) => {
    try {
        // Document ID e.g., "week3"
        const weekDocId = `week${weekId}`;
        const weekRef = doc(db, WEEKS_COLLECTION, weekDocId);

        // Save to Firestore
        await setDoc(weekRef, {
            id: weekId,
            title: weekTitle,
            isVisible: true,
            questions: questions // Array of question objects
        });

        console.log(`Week ${weekId} added to Firestore!`);
        return { success: true };
    } catch (error) {
        console.error("Error adding week:", error);
        throw error;
    }
};

// NEW FUNCTION: Calculates the next week number
export const getNextWeekNumber = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        // If there are 3 docs, size is 3. Next week is 4.
        return querySnapshot.size + 1;
    } catch (error) {
        console.error("Error fetching week count:", error);
        return 1; // Default to Week 1 if error or empty
    }
};