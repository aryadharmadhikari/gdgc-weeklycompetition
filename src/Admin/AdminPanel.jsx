import React, { useState } from 'react';
import './AdminPanel.css'; // We'll create this CSS file next

// This component is the modal form for adding a new week
// 'pageType' will be "Quiz" or "Explanation"
// 'onClose' is a function to close the modal
const AdminPanel = ({ pageType, onClose }) => {
    const [weekTitle, setWeekTitle] = useState('');

    const [q1Prompt, setQ1Prompt] = useState('');
    const [q1TestCases, setQ1TestCases] = useState('');

    const [q2Prompt, setQ2Prompt] = useState('');
    const [q2TestCases, setQ2TestCases] = useState('');
    // ... (add states for q2, q3)
    const [q3Prompt, setQ3Prompt] = useState('');
    const [q3TestCases, setQ3TestCases] = useState('');
    
    // Explanation-specific fields
    const [q1Solution, setQ1Solution] = useState('');
    const [q1Explanation, setQ1Explanation] = useState('');

    const [q2Solution, setQ2Solution] = useState('');
    const [q2Explanation, setQ2Explanation] = useState('');

    const [q3Solution, setQ3Solution] = useState('');
    const [q3Explanation, setQ3Explanation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newWeekData = {
            weekTitle,
            questions: [
                { title: 'Question 1', prompt: q1Prompt, testCases: q1TestCases, solution: q1Solution, explanation: q1Explanation },
                // ... (data for q2, q3)
                { title: 'Question 3 (Master)', prompt: q3Prompt, testCases: q3TestCases, solution: '...', explanation: '...' },
            ]
        };

        // For now, we just log the data.
        // LATER: This is where you'll send data to Firestore.
        console.log(`Submitting new ${pageType} data:`, newWeekData);

        alert('New week data logged to console! (Not yet saved to DB)');
        onClose(); // Close the modal
    };

    return (
        <div className="admin-modal-backdrop">
            <div className="admin-modal-content">
                <div className="admin-modal-header">
                    <h2>Add New {pageType} Content</h2>
                    <button onClick={onClose} className="admin-modal-close-btn">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="admin-modal-form">
                    <label>Week Title</label>
                    <input
                        type="text"
                        placeholder="e.g., Week 4: Data Structures"
                        value={weekTitle}
                        onChange={(e) => setWeekTitle(e.target.value)}
                        required
                    />

                    {/* --- Question 1 Fields --- */}
                    <h4>Question 1</h4>
                    <label>Q1 Prompt</label>
                    <textarea 
                        placeholder="Enter the question prompt..."
                        value={q1Prompt} 
                        onChange={(e) => setQ1Prompt(e.target.value)} 
                    />
                    <label>Q1 Test Cases</label>
                    <textarea 
                        placeholder="Case 1: ...\nCase 2: ..."
                        value={q1TestCases} 
                        onChange={(e) => setQ1TestCases(e.target.value)} 
                    />

                    {/* Show these fields only on the Explanations page */}
                    {pageType === 'Explanation' && (
                        <>
                            <label>Q1 Solution Code</label>
                            <textarea 
                                placeholder="Enter the official solution code..."
                                value={q1Solution} 
                                onChange={(e) => setQ1Solution(e.target.value)} 
                            />
                            <label>Q1 Explanation</label>
                            <textarea 
                                placeholder="Enter the detailed explanation..."
                                value={q1Explanation} 
                                onChange={(e) => setQ1Explanation(e.target.value)} 
                            />
                        </>
                    )}
                    


                    <h4>Question 2</h4>
                    <label>Q2 Prompt</label>
                    <textarea 
                        placeholder="Enter the question prompt..."
                        value={q1Prompt} 
                        onChange={(e) => setQ2Prompt(e.target.value)} 
                    />
                    <label>Q2 Test Cases</label>
                    <textarea 
                        placeholder="Case 1: ...\nCase 2: ..."
                        value={q1TestCases} 
                        onChange={(e) => setQ2TestCases(e.target.value)} 
                    />

                    {/* Show these fields only on the Explanations page */}
                    {pageType === 'Explanation' && (
                        <>
                            <label>Q2 Solution Code</label>
                            <textarea 
                                placeholder="Enter the official solution code..."
                                value={q2Solution} 
                                onChange={(e) => setQ2Solution(e.target.value)} 
                            />
                            <label>Q2 Explanation</label>
                            <textarea 
                                placeholder="Enter the detailed explanation..."
                                value={q2Explanation} 
                                onChange={(e) => setQ2Explanation(e.target.value)} 
                            />
                        </>
                    )}
                    
                    {/* --- TODO: Add Fields for Q3 --- */}
                    <h4>Question 3 (Master)</h4>
                     <label>Q3 Prompt</label>
                    <textarea 
                        placeholder="Enter the master question prompt..."
                        value={q3Prompt} 
                        onChange={(e) => setQ3Prompt(e.target.value)} 
                    />
                    <label>Q3 Test Cases</label>
                    <textarea 
                        placeholder="Case 1: ...\nCase 2: ..."
                        value={q3TestCases} 
                        onChange={(e) => setQ3TestCases(e.target.value)} 
                    />
                     {pageType === 'Explanation' && (
                        <>
                            <label>Q3 Solution Code</label>
                            <textarea 
                                placeholder="Enter the official solution code..."
                                value={q3Solution} 
                                onChange={(e) => setQ3Solution(e.target.value)} 
                            />
                            <label>Q3 Explanation</label>
                            <textarea 
                                placeholder="Enter the detailed explanation..."
                                value={q3Explanation} 
                                onChange={(e) => setQ3Explanation(e.target.value)} 
                            />
                        </>
                    )}

                    <button type="submit" className="admin-modal-submit-btn">
                        Publish New Week
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPanel;
