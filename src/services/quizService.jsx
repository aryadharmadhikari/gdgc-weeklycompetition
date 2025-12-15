// import { db } from "../firebase/config";
// import {
//     collection,
//     doc,
//     setDoc,
//     getDoc,
//     getDocs,
//     query,
//     where,
//     serverTimestamp,
//     updateDoc,
//     increment,
//     arrayUnion
// } from "firebase/firestore";

// // COLLECTION CONSTANTS
// const WEEKS_COLLECTION = "weeks";
// const SUBMISSIONS_COLLECTION = "submissions";
// const USERS_COLLECTION = "users";

// /**
//  * 🔍 Fetch Quiz Questions
//  */
// export const getQuizWeeks = async () => {
//     try {
//         const weeksRef = collection(db, WEEKS_COLLECTION);
//         const q = query(weeksRef, where("isVisible", "==", true));
//         const snapshot = await getDocs(q);

//         const weeksData = {};
//         snapshot.forEach(doc => {
//             const data = doc.data();
//             weeksData[data.id] = data.questions;
//         });
//         return weeksData;
//     } catch (error) {
//         console.error("Error fetching quiz weeks:", error);
//         throw error;
//     }
// };

// /**
//  * 📝 Submit Quiz Answers
//  */
// export const submitQuizWeek = async (userEmail, weekId, formattedSolutions) => {
//     try {
//         // 1. Reference the Single User Submission Document
//         const userSubmissionRef = doc(db, SUBMISSIONS_COLLECTION, userEmail);
//         const userRef = doc(db, USERS_COLLECTION, userEmail);

//         // 2. Prepare the Payload using Nested Object Syntax
//         // We use computed property names [weekId] to target the specific week key
//         const payload = {
//             weeks: {
//                 [weekId]: {
//                     solutions: formattedSolutions,
//                     status: 'submitted',
//                     submittedAt: serverTimestamp(),
//                 }
//             }
//         };

//         // 3. Check if this is a NEW submission (for scoring)
//         // We need to read the doc first to see if this specific week key already exists
//         const docSnap = await getDoc(userSubmissionRef);
//         let isNewForScore = true;

//         if (docSnap.exists()) {
//             const data = docSnap.data();
//             // If weeks object exists AND this weekId exists inside it, it's an update, not new.
//             if (data.weeks && data.weeks[weekId]) {
//                 isNewForScore = false;
//             }
//         }

//         // 4. Save to Firestore (Merge ensures we don't overwrite other weeks)
//         await setDoc(userSubmissionRef, payload, { merge: true });

//         // 5. Increment Score (Only if it's the first time submitting THIS week)
//         if (isNewForScore) {
//             await updateDoc(userRef, {
//                 questionsCompleted: increment(formattedSolutions.length),
//                 completedWeeks: arrayUnion(weekId) // Keep this optimization!
//             });
//         }

//         return { success: true };
//     } catch (error) {
//         console.error("Error submitting quiz:", error);
//         throw error;
//     }
// };

// /**
//  *  Edit and Add new Quiz weeks
//  */
// // 1. Fetch ALL weeks (Drafts + Live) for the Admin Dashboard
// export const getAllQuizWeeksForAdmin = async () => {
//     try {
//         const weeksRef = collection(db, WEEKS_COLLECTION);
//         // No 'where' clause here - we want everything
//         const snapshot = await getDocs(weeksRef);

//         const weeks = [];
//         snapshot.forEach(doc => {
//             weeks.push(doc.data());
//         });

//         // Sort by ID (numeric)
//         return weeks.sort((a, b) => Number(a.id) - Number(b.id));
//     } catch (error) {
//         console.error("Error fetching admin weeks:", error);
//         return [];
//     }
// };

// // 2. Helper to find the next available ID
// export const getNextWeekNumber = async () => {
//     const weeks = await getAllQuizWeeksForAdmin();
//     // Logic: Look at the last week's ID and add 1. If empty, start at 1.
//     if (weeks.length === 0) return 1;
//     const lastWeek = weeks[weeks.length - 1];
//     return Number(lastWeek.id) + 1;
// };

// // 3. Save Logic (Handles both Drafts and Live)
// export const addQuizWeek = async (weekId, weekTitle, questions, isVisible) => {
//     try {
//         const weekDocId = `week${weekId}`;
//         const weekRef = doc(db, WEEKS_COLLECTION, weekDocId);

//         await setDoc(weekRef, {
//             id: weekId.toString(),
//             title: weekTitle, // e.g., "Week 4"
//             isVisible: isVisible,
//             questions: questions,
//             lastUpdated: serverTimestamp()
//         });

//         return { success: true };
//     } catch (error) {
//         console.error("Error adding week:", error);
//         throw error;
//     }
// };

// /**
//  * 🕵️‍♂️ Get User Submission (Refactored)
//  * Fetches the specific week from the user's single document.
//  */
// export const getUserSubmission = async (userEmail, weekId) => {
//     try {
//         const docRef = doc(db, SUBMISSIONS_COLLECTION, userEmail);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             const data = docSnap.data();
//             // Return only the specific week's data if it exists
//             return data.weeks ? data.weeks[weekId] : null;
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.error("Error checking submission:", error);
//         return null;
//     }
// };
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
            // --- FIX: Return the FULL object, not just questions ---
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
        
        // 1. Reference the Single User Submission Document
        const userSubmissionRef = doc(db, SUBMISSIONS_COLLECTION, userEmail);
        const userRef = doc(db, USERS_COLLECTION, userEmail);

        // 2. Prepare the Payload using Nested Object Syntax
        const payload = {
            weeks: {
                [weekId]: {
                    solutions: formattedSolutions,
                    status: 'submitted',
                    submittedAt: serverTimestamp(),
                }
            }
        };

        // 3. Check if this is a NEW submission (for scoring)
        const docSnap = await getDoc(userSubmissionRef);
        let isNewForScore = true;

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.weeks && data.weeks[weekId]) {
                isNewForScore = false;
            }
        }

        // 4. Save to Firestore
        await setDoc(userSubmissionRef, payload, { merge: true });

        // 5. Increment Score
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

// Change the signature to accept startDate
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