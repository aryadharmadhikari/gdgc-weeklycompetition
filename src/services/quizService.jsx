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
 */
export const getQuizWeeks = async () => {
    try {
        const weeksRef = collection(db, WEEKS_COLLECTION);
        const q = query(weeksRef, where("isVisible", "==", true));
        const snapshot = await getDocs(q);

        const weeksData = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            weeksData[data.id] = data;
        });
        return weeksData;
    } catch (error) {
        console.error("Error fetching quiz weeks:", error);
        throw error;
    }
};

/**
 * 📝 Submit Quiz Answers
 * UPDATED: Stores document as 'week_{id}_{email}' containing full user details.
 */
export const submitQuizWeek = async (userData, weekId, formattedSolutions) => {
    try {
        const { email, name, uid } = userData;

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

        // 2. Reference the Composite Submission Document
        // Format: submissions/week_1_student@dbit.in
        const submissionDocId = `week_${weekId}_${email}`;
        const submissionRef = doc(db, SUBMISSIONS_COLLECTION, submissionDocId);

        // Reference to User Profile for Stats
        const userRef = doc(db, USERS_COLLECTION, email);

        // 3. Prepare the Flattened Payload (Optimized for DSA Download)
        const payload = {
            // Context
            weekId: weekId.toString(),
            submittedAt: serverTimestamp(),

            // User Identity (Denormalized)
            student_name: name,
            student_email: email,
            student_uid: uid,

            // Content
            solutions: formattedSolutions,
            status: 'submitted'
        };

        // 4. Check if this is a NEW submission (for scoring logic)
        const docSnap = await getDoc(submissionRef);
        const isResubmission = docSnap.exists();

        // 5. Save to Firestore (Overwrite/Update specific week submission)
        await setDoc(submissionRef, payload);

        // 6. Increment Score on User Profile (Only if it's their first time submitting this week)
        if (!isResubmission) {
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

/**
 * UPDATED: Fetches submission using the new Composite ID
 */
export const getUserSubmission = async (userEmail, weekId) => {
    try {
        // Construct the composite ID: week_1_student@dbit.in
        const submissionDocId = `week_${weekId}_${userEmail}`;
        const docRef = doc(db, SUBMISSIONS_COLLECTION, submissionDocId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data(); // Returns the whole object including 'solutions'
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error checking submission:", error);
        return null;
    }
};