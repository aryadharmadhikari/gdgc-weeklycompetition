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
export const submitQuizWeek = async (userEmail, weekId, formattedSolutions) => {
    try {
        // 1. Create ID using Email (e.g., "student@dbit.in_1")
        const submissionId = `${userEmail}_${weekId}`;
        const submissionRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);

        // 2. Point to User Profile using Email (New Schema)
        const userRef = doc(db, USERS_COLLECTION, userEmail);

        const docSnap = await getDoc(submissionRef);
        const isNewSubmission = !docSnap.exists();

        // 3. Save Submission
        await setDoc(submissionRef, {
            userEmail: userEmail,
            weekId,
            solutions: formattedSolutions,
            status: 'submitted',
            submittedAt: serverTimestamp(),
        }, { merge: true });

        // 4. Increment Score
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
 *  Edit and Add new Quiz weeks
 */
// 1. Fetch ALL weeks (Drafts + Live) for the Admin Dashboard
export const getAllQuizWeeksForAdmin = async () => {
    try {
        const weeksRef = collection(db, WEEKS_COLLECTION);
        // No 'where' clause here - we want everything
        const snapshot = await getDocs(weeksRef);

        const weeks = [];
        snapshot.forEach(doc => {
            weeks.push(doc.data());
        });

        // Sort by ID (numeric)
        return weeks.sort((a, b) => Number(a.id) - Number(b.id));
    } catch (error) {
        console.error("Error fetching admin weeks:", error);
        return [];
    }
};

// 2. Helper to find the next available ID
export const getNextWeekNumber = async () => {
    const weeks = await getAllQuizWeeksForAdmin();
    // Logic: Look at the last week's ID and add 1. If empty, start at 1.
    if (weeks.length === 0) return 1;
    const lastWeek = weeks[weeks.length - 1];
    return Number(lastWeek.id) + 1;
};

// 3. Save Logic (Handles both Drafts and Live)
export const addQuizWeek = async (weekId, weekTitle, questions, isVisible) => {
    try {
        const weekDocId = `week${weekId}`;
        const weekRef = doc(db, WEEKS_COLLECTION, weekDocId);

        await setDoc(weekRef, {
            id: weekId.toString(),
            title: weekTitle, // e.g., "Week 4"
            isVisible: isVisible,
            questions: questions,
            lastUpdated: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error("Error adding week:", error);
        throw error;
    }
};