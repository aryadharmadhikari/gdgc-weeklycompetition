import { db } from "../firebase/config";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    updateDoc,
    increment,
    arrayUnion
} from "firebase/firestore";

// COLLECTION CONSTANTS
const WEEKS_COLLECTION = "weeks";
const SUBMISSIONS_COLLECTION = "submissions";
const USERS_COLLECTION = "users";

/**
 * 🔍 Fetch Quiz Questions
 * Returns the FULL object (including startDate) so the frontend can check expiry.
 */
export const getQuizWeeks = async () => {
    try {
        const weeksRef = collection(db, WEEKS_COLLECTION);
        const q = query(weeksRef, where("isVisible", "==", true));
        const snapshot = await getDocs(q);

        const weeksData = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            weeksData[data.id] = data; // Return full object
        });
        return weeksData;
    } catch (error) {
        console.error("Error fetching quiz weeks:", error);
        throw error;
    }
};

/**
 * 📝 Submit Quiz Answers
 * Includes security check for deadline.
 */
export const submitQuizWeek = async (userEmail, weekId, formattedSolutions) => {
    try {
        // 1. SECURITY CHECK: Fetch the Week Data first
        const weekDocId = `week${weekId}`;
        const weekRef = doc(db, WEEKS_COLLECTION, weekDocId);
        const weekSnap = await getDoc(weekRef);

        if (weekSnap.exists()) {
            const weekData = weekSnap.data();
            if (weekData.startDate) {
                const start = new Date(weekData.startDate);
                const deadline = new Date(start);
                deadline.setDate(start.getDate() + 7); // Add 7 Days

                const now = new Date();
                if (now > deadline) {
                    throw new Error("⛔ Submission Failed: This week is closed.");
                }
            }
        }
        
        // 2. Reference the Single User Submission Document
        const userSubmissionRef = doc(db, SUBMISSIONS_COLLECTION, userEmail);
        const userRef = doc(db, USERS_COLLECTION, userEmail);

        // 3. Prepare the Payload
        const payload = {
            weeks: {
                [weekId]: {
                    solutions: formattedSolutions,
                    status: 'submitted',
                    submittedAt: serverTimestamp(),
                }
            }
        };

        // 4. Check if this is a NEW submission (for scoring)
        const docSnap = await getDoc(userSubmissionRef);
        let isNewForScore = true;

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.weeks && data.weeks[weekId]) {
                isNewForScore = false;
            }
        }

        // 5. Save to Firestore
        await setDoc(userSubmissionRef, payload, { merge: true });

        // 6. Increment Score
        if (isNewForScore) {
            await updateDoc(userRef, {
                questionsCompleted: increment(formattedSolutions.length),
                completedWeeks: arrayUnion(weekId)
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error submitting quiz:", error);
        throw error;
    }
};

/**
 * Edit and Add new Quiz weeks
 */
export const getAllQuizWeeksForAdmin = async () => {
    try {
        const weeksRef = collection(db, WEEKS_COLLECTION);
        const snapshot = await getDocs(weeksRef);

        const weeks = [];
        snapshot.forEach(doc => {
            weeks.push(doc.data());
        });

        return weeks.sort((a, b) => Number(a.id) - Number(b.id));
    } catch (error) {
        console.error("Error fetching admin weeks:", error);
        return [];
    }
};

export const getNextWeekNumber = async () => {
    const weeks = await getAllQuizWeeksForAdmin();
    if (weeks.length === 0) return 1;
    const lastWeek = weeks[weeks.length - 1];
    return Number(lastWeek.id) + 1;
};

// Updated to accept startDate
export const addQuizWeek = async (weekId, weekTitle, questions, isVisible, startDate) => {
    try {
        const weekDocId = `week${weekId}`;
        const weekRef = doc(db, WEEKS_COLLECTION, weekDocId);

        await setDoc(weekRef, {
            id: weekId.toString(),
            title: weekTitle,
            isVisible: isVisible,
            startDate: startDate || null, 
            questions: questions,
            lastUpdated: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error("Error adding week:", error);
        throw error;
    }
};

/**
 * 🗑️ Delete a Quiz Week
 */
export const deleteQuizWeek = async (weekId) => {
    try {
        const weekDocId = `week${weekId}`;
        const weekRef = doc(db, WEEKS_COLLECTION, weekDocId);
        
        await deleteDoc(weekRef);
        return { success: true };
    } catch (error) {
        console.error("Error deleting week:", error);
        throw error;
    }
};

export const getUserSubmission = async (userEmail, weekId) => {
    try {
        const docRef = doc(db, SUBMISSIONS_COLLECTION, userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.weeks ? data.weeks[weekId] : null;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error checking submission:", error);
        return null;
    }
};