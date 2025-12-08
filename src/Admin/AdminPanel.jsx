import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { refreshLeaderboardCache } from '../services/leaderboardService';
import { addQuizWeek, getNextWeekNumber } from '../services/quizService.jsx'; // Import the new helper

const AdminPanel = ({ pageType, onClose }) => {
    // State for dynamic week numbering
    const [nextWeekNum, setNextWeekNum] = useState(null); // Will hold 1, 2, 3...
    const [weekTopic, setWeekTopic] = useState(''); // User enters "Data Structures"
    const [isLoading, setIsLoading] = useState(false); // Fixed missing state

    // Question States
    const [q1Prompt, setQ1Prompt] = useState('');
    const [q1TestCases, setQ1TestCases] = useState('');
    const [q1Solution, setQ1Solution] = useState('');
    const [q1Explanation, setQ1Explanation] = useState('');

    const [q2Prompt, setQ2Prompt] = useState('');
    const [q2TestCases, setQ2TestCases] = useState('');
    const [q2Solution, setQ2Solution] = useState('');
    const [q2Explanation, setQ2Explanation] = useState('');

    const [q3Prompt, setQ3Prompt] = useState('');
    const [q3TestCases, setQ3TestCases] = useState('');
    const [q3Solution, setQ3Solution] = useState('');
    const [q3Explanation, setQ3Explanation] = useState('');

    // 1. Fetch the next week number immediately when Modal opens
    useEffect(() => {
        const fetchWeekNum = async () => {
            const num = await getNextWeekNumber();
            setNextWeekNum(num);
        };
        fetchWeekNum();
    }, []);

    const handleRefreshLeaderboard = async () => {
        setIsLoading(true);
        try {
            await refreshLeaderboardCache();
            alert("Leaderboard updated!");
        } catch (error) {
            console.error(error);
            alert("Failed to refresh leaderboard.");
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 2. Construct the full title automatically
        // Result: "Week 4: Data Structures"
        const fullWeekTitle = `Week ${nextWeekNum}: ${weekTopic}`;

        const newWeekData = {
            id: nextWeekNum.toString(), // Store the ID explicitly if needed
            weekTitle: fullWeekTitle,
            questions: [
                {
                    title: 'Question 1',
                    description: q1Prompt,
                    testCases: q1TestCases,
                    solution: q1Solution,
                    explanation: q1Explanation
                },
                {
                    title: 'Question 2',
                    description: q2Prompt,
                    testCases: q2TestCases,
                    solution: q2Solution,
                    explanation: q2Explanation
                },
                {
                    title: 'Question 3 (Master)',
                    description: q3Prompt,
                    testCases: q3TestCases,
                    solution: q3Solution,
                    explanation: q3Explanation
                },
            ]
        };

        // Call the service to save to DB
        // await addQuizWeek(newWeekData);

        console.log(`Submitting new ${pageType} data:`, newWeekData);
        alert(`Successfully created ${fullWeekTitle}!`);
        onClose();
    };

    return (
        <div className="admin-modal-backdrop">
            <div className="admin-modal-content">
                <div className="admin-modal-header">
                    <h2>Add New {pageType} Content</h2>
                    <button onClick={onClose} className="admin-modal-close-btn">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="admin-modal-form">

                    {/* 3. Replaced Manual Title Input with Dynamic Display + Topic Input */}
                    <div className="week-header-section" style={{marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px'}}>
                        <h3 style={{marginTop: 0}}>
                            {nextWeekNum ? `Creating Week ${nextWeekNum}` : 'Calculating Week Number...'}
                        </h3>
                    </div>

                    {/* --- Question 1 Fields --- */}
                    <h4>Question 1</h4>
                    <label>Q1 Description</label>
                    <textarea
                        placeholder="Enter the question description..."
                        value={q1Prompt}
                        onChange={(e) => setQ1Prompt(e.target.value)}
                        required
                    />
                    <label>Q1 Test Cases</label>
                    <textarea
                        placeholder="Case 1: ...\nCase 2: ..."
                        value={q1TestCases}
                        onChange={(e) => setQ1TestCases(e.target.value)}
                        required
                    />

                    {pageType === 'Explanation' && (
                        <>
                            <label>Q1 Solution Code</label>
                            <textarea
                                placeholder="Enter solution code..."
                                value={q1Solution}
                                onChange={(e) => setQ1Solution(e.target.value)}
                            />
                            <label>Q1 Explanation</label>
                            <textarea
                                placeholder="Enter detailed explanation..."
                                value={q1Explanation}
                                onChange={(e) => setQ1Explanation(e.target.value)}
                            />
                        </>
                    )}

                    {/* --- Question 2 Fields --- */}
                    <h4>Question 2</h4>
                    <label>Q2 Description</label>
                    <textarea
                        value={q2Prompt}
                        onChange={(e) => setQ2Prompt(e.target.value)}
                    />
                    <label>Q2 Test Cases</label>
                    <textarea
                        value={q2TestCases}
                        onChange={(e) => setQ2TestCases(e.target.value)}
                    />

                    {pageType === 'Explanation' && (
                        <>
                            <label>Q2 Solution Code</label>
                            <textarea
                                value={q2Solution}
                                onChange={(e) => setQ2Solution(e.target.value)}
                            />
                            <label>Q2 Explanation</label>
                            <textarea
                                value={q2Explanation}
                                onChange={(e) => setQ2Explanation(e.target.value)}
                            />
                        </>
                    )}

                    {/* --- Question 3 Fields --- */}
                    <h4>Question 3 (Master)</h4>
                    <label>Q3 Description</label>
                    <textarea
                        value={q3Prompt}
                        onChange={(e) => setQ3Prompt(e.target.value)}
                    />
                    <label>Q3 Test Cases</label>
                    <textarea
                        value={q3TestCases}
                        onChange={(e) => setQ3TestCases(e.target.value)}
                    />
                    {pageType === 'Explanation' && (
                        <>
                            <label>Q3 Solution Code</label>
                            <textarea
                                value={q3Solution}
                                onChange={(e) => setQ3Solution(e.target.value)}
                            />
                            <label>Q3 Explanation</label>
                            <textarea
                                value={q3Explanation}
                                onChange={(e) => setQ3Explanation(e.target.value)}
                            />
                        </>
                    )}

                    <div className="button-group" style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                        <button type="submit" className="admin-modal-submit-btn" disabled={!nextWeekNum}>
                            {nextWeekNum ? `Publish Week ${nextWeekNum}` : 'Loading...'}
                        </button>

                        <button
                            type="button"
                            onClick={handleRefreshLeaderboard}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Refreshing...' : 'Force Refresh Leaderboard'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminPanel;