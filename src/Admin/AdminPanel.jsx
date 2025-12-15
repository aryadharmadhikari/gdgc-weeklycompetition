// import React, { useState, useEffect } from 'react';
// import './AdminPanel.css';
// import { addQuizWeek, getNextWeekNumber, getAllQuizWeeksForAdmin } from '../services/quizService';
// import { refreshLeaderboardCache } from '../services/leaderboardService';

// const AdminPanel = ({ pageType, onClose }) => {
//     // VIEW MODES: 'dashboard' (list of weeks) OR 'editor' (form)
//     const [viewMode, setViewMode] = useState('dashboard');
//     const [isLoading, setIsLoading] = useState(false);

//     // DATA STATES
//     const [allWeeks, setAllWeeks] = useState([]); // List for dashboard
//     const [editingWeekNum, setEditingWeekNum] = useState(null); // The ID we are working on

//     // FORM STATES
//     const [questions, setQuestions] = useState([]);

//     // --- INITIALIZATION: Load Dashboard ---
//     useEffect(() => {
//         loadDashboard();
//     }, []);

//     const loadDashboard = async () => {
//         setIsLoading(true);
//         const weeks = await getAllQuizWeeksForAdmin();
//         setAllWeeks(weeks);
//         setIsLoading(false);
//     };

//     // --- NAVIGATION HANDLERS ---

//     const handleCreateNew = async () => {
//         setIsLoading(true);
//         const nextNum = await getNextWeekNumber();
//         setEditingWeekNum(nextNum);

//         // 🚀 DEFAULT TEMPLATE: 3 Empty Questions, Q3 is Master
//         setQuestions([
//             { id: 1, title: 'Question 1', prompt: '', testCases: '', isMaster: false, isOpen: true },
//             { id: 2, title: 'Question 2', prompt: '', testCases: '', isMaster: false, isOpen: false },
//             { id: 3, title: 'Question 3', prompt: '', testCases: '', isMaster: true, isOpen: false } // Master Default
//         ]);

//         setIsLoading(false);
//         setViewMode('editor');
//     };

//     const handleEditWeek = (weekData) => {
//         setEditingWeekNum(weekData.id);

//         // Parse database questions back to state
//         // Add 'isOpen' property for UI handling
//         const parsedQuestions = weekData.questions.map((q, idx) => ({
//             ...q,
//             testCases: Array.isArray(q.testCases) ? q.testCases.join('\n') : q.testCases, // Convert Array -> String for Textarea
//             isOpen: idx === 0 // Open first one by default
//         }));

//         setQuestions(parsedQuestions);
//         setViewMode('editor');
//     };

//     // --- EDITOR HANDLERS ---

//     const updateQuestion = (index, field, value) => {
//         setQuestions(prev => prev.map((q, i) => i === index ? { ...q, [field]: value } : q));
//     };

//     const toggleAccordion = (index) => {
//         setQuestions(prev => prev.map((q, i) => i === index ? { ...q, isOpen: !q.isOpen } : { ...q, isOpen: false }));
//     };

//     const addQuestion = () => {
//         const newQ = {
//             id: Date.now(),
//             title: `Question ${questions.length + 1}`,
//             prompt: '', testCases: '', isMaster: false, isOpen: true
//         };
//         setQuestions(prev => [...prev.map(q => ({...q, isOpen: false})), newQ]);
//     };

//     const removeQuestion = (index) => {
//         if(questions.length <= 1) return alert("Keep at least one question.");
//         setQuestions(prev => prev.filter((_, i) => i !== index));
//     };

//     const handleSave = async (isLive) => {
//         // 🛡️ VALIDATION: Check for at least one Master Question
//         if (isLive) {
//             const hasMaster = questions.some(q => q.isMaster);
//             if (!hasMaster) {
//                 alert("⚠️ Cannot Publish:\nYou must mark at least one question as the 'Master Question' (Mandatory) before publishing live.\n\nYou can still 'Save as Draft' if you aren't ready.");
//                 return; // Stop the publish process
//             }
//         }
//         setIsLoading(true);
//         try {
//             // 1. Format for Database
//             const formattedQuestions = questions.map((q, i) => ({
//                 id: `w${editingWeekNum}q${i+1}`,
//                 title: q.title || `Question ${i+1}`,
//                 prompt: q.prompt,
//                 testCases: q.testCases.split('\n').filter(t => t.trim()), // String -> Array
//                 isMaster: q.isMaster,
//                 // Include solution/explanation only if on Explanation page
//                 solutionCode: pageType === 'Explanation' ? q.solutionCode : '',
//                 explanation: pageType === 'Explanation' ? q.explanation : ''
//             }));

//             // 2. Save
//             await addQuizWeek(editingWeekNum, `Week ${editingWeekNum}`, formattedQuestions, isLive);

//             alert(isLive ? `Week ${editingWeekNum} is now LIVE!` : `Week ${editingWeekNum} saved to Drafts.`);

//             // 3. Return to Dashboard
//             await loadDashboard();
//             setViewMode('dashboard');

//         } catch (error) {
//             console.error(error);
//             alert("Save failed.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // --- RENDER HELPERS ---

//     const renderDashboard = () => (
//         <div className="admin-modal-body">
//             <h3 style={{marginTop:0}}>Manage Content</h3>
//             <div className="dashboard-grid">
//                 {/* Create New Card */}
//                 <button className="create-new-btn" onClick={handleCreateNew}>
//                     <span style={{fontSize:'1.5rem'}}>+</span> Create Week {allWeeks.length + 1}
//                 </button>

//                 {/* Existing Weeks List */}
//                 {allWeeks.map((week) => (
//                     <div key={week.id} className="week-card" onClick={() => handleEditWeek(week)}>
//                         <span className={`status-badge ${week.isVisible ? 'status-live' : 'status-draft'}`}>
//                             {week.isVisible ? '● Live' : '● Draft'}
//                         </span>
//                         <div className="wc-title">{week.title || `Week ${week.id}`}</div>
//                         <div className="wc-subtitle">{week.questions?.length || 0} Questions</div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );

//     const renderEditor = () => (
//         <>
//             <div className="admin-modal-body">
//                 <div className="editor-toolbar">
//                     <div>
//                         <span style={{color:'#666', fontSize:'0.8rem', textTransform:'uppercase', fontWeight:'bold'}}>Editing</span>
//                         <div style={{fontSize:'1.5rem', fontWeight:'bold', color:'#1a73e8'}}>Week {editingWeekNum}</div>
//                     </div>
//                     <button className="btn" style={{border:'1px solid #ddd'}} onClick={() => setViewMode('dashboard')}>
//                         Cancel
//                     </button>
//                 </div>

//                 {questions.map((q, index) => (
//                     <div key={q.id} className={`question-block ${q.isOpen ? 'active' : ''} ${q.isMaster ? 'master' : ''}`}>
//                         <div className="qb-header" onClick={() => toggleAccordion(index)}>
//                             <span>
//                                 {q.isMaster && "⭐ "}
//                                 {q.title || `Question ${index + 1}`}
//                             </span>
//                             <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
//                                 {q.isMaster && <span style={{fontSize:'0.7rem', color:'#fbbc04', fontWeight:'bold'}}>MASTER</span>}
//                                 {q.isOpen ? '▼' : '▶'}
//                             </div>
//                         </div>

//                         {q.isOpen && (
//                             <div className="qb-body">
//                                 {/* Master Toggle */}
//                                 <div style={{marginBottom:'15px', padding:'10px', background:'#fff8e1', borderRadius:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
//                                     <input
//                                         type="checkbox"
//                                         checked={q.isMaster}
//                                         onChange={(e) => updateQuestion(index, 'isMaster', e.target.checked)}
//                                         style={{width:'auto'}}
//                                     />
//                                     <label style={{margin:0, color:'#b36b00', cursor:'pointer'}}>Mark as Master Question (Mandatory)</label>
//                                 </div>

//                                 <div className="input-group">
//                                     <label>Title</label>
//                                     <input value={q.title} onChange={e => updateQuestion(index, 'title', e.target.value)} />
//                                 </div>
//                                 <div className="input-group">
//                                     <label>Prompt</label>
//                                     <textarea rows={3} value={q.prompt} onChange={e => updateQuestion(index, 'prompt', e.target.value)} />
//                                 </div>
//                                 <div className="input-group">
//                                     <label>Test Cases (One per line)</label>
//                                     <textarea className="code" rows={3} value={q.testCases} onChange={e => updateQuestion(index, 'testCases', e.target.value)} />
//                                 </div>

//                                 {pageType === 'Explanation' && (
//                                     <div style={{marginTop:'15px', paddingTop:'15px', borderTop:'1px dashed #ccc'}}>
//                                         <div className="input-group">
//                                             <label>Solution Code</label>
//                                             <textarea className="code" value={q.solutionCode} onChange={e => updateQuestion(index, 'solutionCode', e.target.value)} />
//                                         </div>
//                                         <div className="input-group">
//                                             <label>Explanation Text</label>
//                                             <textarea value={q.explanation} onChange={e => updateQuestion(index, 'explanation', e.target.value)} />
//                                         </div>
//                                     </div>
//                                 )}

//                                 <button className="btn" style={{color:'red', fontSize:'0.8rem', padding:0}} onClick={() => removeQuestion(index)}>Delete Question</button>
//                             </div>
//                         )}
//                     </div>
//                 ))}

//                 <button className="btn btn-add" onClick={addQuestion}>+ Add Another Question</button>
//             </div>

//             <div className="footer-actions">
//                 <button className="btn btn-save" onClick={() => handleSave(false)} disabled={isLoading}>
//                     {isLoading ? 'Saving...' : 'Save as Draft'}
//                 </button>
//                 <div style={{display:'flex', gap:'10px'}}>
//                     <button className="btn" style={{background:'#fbbc04', color:'#000'}} onClick={async () => {
//                         if(window.confirm("Refresh Leaderboard?")) {
//                             await refreshLeaderboardCache();
//                             alert("Done");
//                         }
//                     }}>
//                         Refresh Ranks
//                     </button>
//                     <button className="btn btn-publish" onClick={() => handleSave(true)} disabled={isLoading}>
//                         {isLoading ? 'Publishing...' : 'Publish Live'}
//                     </button>
//                 </div>
//             </div>
//         </>
//     );

//     return (
//         <div className="admin-modal-backdrop">
//             <div className="admin-modal-content">
//                 <div className="admin-modal-header">
//                     <h2>Admin Console</h2>
//                     <button onClick={onClose} style={{border:'none', background:'none', fontSize:'1.5rem', cursor:'pointer'}}>&times;</button>
//                 </div>
//                 {viewMode === 'dashboard' ? renderDashboard() : renderEditor()}
//             </div>
//         </div>
//     );
// };

// export default AdminPanel;
import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { addQuizWeek, getNextWeekNumber, getAllQuizWeeksForAdmin } from '../services/quizService';
import { refreshLeaderboardCache } from '../services/leaderboardService';

const AdminPanel = ({ pageType, onClose }) => {
    const [viewMode, setViewMode] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(false);

    const [allWeeks, setAllWeeks] = useState([]);
    const [editingWeekNum, setEditingWeekNum] = useState(null);

    const [questions, setQuestions] = useState([]);
    const [startDate, setStartDate] = useState('');

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setIsLoading(true);
        const weeks = await getAllQuizWeeksForAdmin();
        setAllWeeks(weeks);
        setIsLoading(false);
    };

    const handleCreateNew = async () => {
        setIsLoading(true);
        const nextNum = await getNextWeekNumber();
        setEditingWeekNum(nextNum);

        setQuestions([
            { id: 1, title: 'Question 1', prompt: '', testCases: '', isMaster: false, isOpen: true },
            { id: 2, title: 'Question 2', prompt: '', testCases: '', isMaster: false, isOpen: false },
            { id: 3, title: 'Question 3', prompt: '', testCases: '', isMaster: true, isOpen: false }
        ]);

        setIsLoading(false);
        setStartDate(new Date().toISOString().split('T')[0]); 
        setViewMode('editor');
    };

    const handleEditWeek = (weekData) => {
        setEditingWeekNum(weekData.id);
        setStartDate(weekData.startDate || ''); 

        const parsedQuestions = weekData.questions.map((q, idx) => ({
            ...q,
            testCases: Array.isArray(q.testCases) ? q.testCases.join('\n') : q.testCases, 
            isOpen: idx === 0 
        }));

        setQuestions(parsedQuestions);
        setViewMode('editor');
    };

    const updateQuestion = (index, field, value) => {
        setQuestions(prev => prev.map((q, i) => i === index ? { ...q, [field]: value } : q));
    };

    const toggleAccordion = (index) => {
        setQuestions(prev => prev.map((q, i) => i === index ? { ...q, isOpen: !q.isOpen } : { ...q, isOpen: false }));
    };

    const addQuestion = () => {
        const newQ = {
            id: Date.now(),
            title: `Question ${questions.length + 1}`,
            prompt: '', testCases: '', isMaster: false, isOpen: true
        };
        setQuestions(prev => [...prev.map(q => ({ ...q, isOpen: false })), newQ]);
    };

    const removeQuestion = (index) => {
        if (questions.length <= 1) return alert("Keep at least one question.");
        setQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async (isLive) => {
        if (isLive) {
            const hasMaster = questions.some(q => q.isMaster);
            if (!hasMaster) {
                alert("⚠️ Cannot Publish:\nYou must mark at least one question as the 'Master Question' (Mandatory) before publishing live.\n\nYou can still 'Save as Draft' if you aren't ready.");
                return;
            }
        }
        setIsLoading(true);
        try {
            const formattedQuestions = questions.map((q, i) => ({
                id: `w${editingWeekNum}q${i + 1}`,
                title: q.title || `Question ${i + 1}`,
                prompt: q.prompt,
                testCases: q.testCases.split('\n').filter(t => t.trim()), 
                isMaster: q.isMaster,
                solutionCode: pageType === 'Explanation' ? q.solutionCode : '',
                explanation: pageType === 'Explanation' ? q.explanation : ''
            }));
            
            // --- FIX: Only call this ONCE ---
            await addQuizWeek(editingWeekNum, `Week ${editingWeekNum}`, formattedQuestions, isLive, startDate);

            alert(isLive ? `Week ${editingWeekNum} is now LIVE!` : `Week ${editingWeekNum} saved to Drafts.`);

            await loadDashboard();
            setViewMode('dashboard');

        } catch (error) {
            console.error(error);
            alert("Save failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderDashboard = () => (
        <div className="admin-modal-body">
            <h3 style={{ marginTop: 0 }}>Manage Content</h3>
            <div className="dashboard-grid">
                <button className="create-new-btn" onClick={handleCreateNew}>
                    <span style={{ fontSize: '1.5rem' }}>+</span> Create Week {allWeeks.length + 1}
                </button>
                {allWeeks.map((week) => (
                    <div key={week.id} className="week-card" onClick={() => handleEditWeek(week)}>
                        <span className={`status-badge ${week.isVisible ? 'status-live' : 'status-draft'}`}>
                            {week.isVisible ? '● Live' : '● Draft'}
                        </span>
                        <div className="wc-title">{week.title || `Week ${week.id}`}</div>
                        <div className="wc-subtitle">{week.questions?.length || 0} Questions</div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderEditor = () => (
        <>
            <div className="admin-modal-body">
                <div className="editor-toolbar">
                    <div>
                        <span style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Editing</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a73e8' }}>Week {editingWeekNum}</div>
                    </div>
                    <button className="btn" style={{ border: '1px solid #ddd' }} onClick={() => setViewMode('dashboard')}>
                        Cancel
                    </button>
                </div>
                
                <div style={{ background: '#f1f3f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Competition Start Date (Locks automatically after 7 days)</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                {questions.map((q, index) => (
                    <div key={q.id} className={`question-block ${q.isOpen ? 'active' : ''} ${q.isMaster ? 'master' : ''}`}>
                        <div className="qb-header" onClick={() => toggleAccordion(index)}>
                            <span>
                                {q.isMaster && "⭐ "}
                                {q.title || `Question ${index + 1}`}
                            </span>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                {q.isMaster && <span style={{ fontSize: '0.7rem', color: '#fbbc04', fontWeight: 'bold' }}>MASTER</span>}
                                {q.isOpen ? '▼' : '▶'}
                            </div>
                        </div>

                        {q.isOpen && (
                            <div className="qb-body">
                                <div style={{ marginBottom: '15px', padding: '10px', background: '#fff8e1', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={q.isMaster}
                                        onChange={(e) => updateQuestion(index, 'isMaster', e.target.checked)}
                                        style={{ width: 'auto' }}
                                    />
                                    <label style={{ margin: 0, color: '#b36b00', cursor: 'pointer' }}>Mark as Master Question (Mandatory)</label>
                                </div>

                                <div className="input-group">
                                    <label>Title</label>
                                    <input value={q.title} onChange={e => updateQuestion(index, 'title', e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label>Prompt</label>
                                    <textarea rows={3} value={q.prompt} onChange={e => updateQuestion(index, 'prompt', e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label>Test Cases (One per line)</label>
                                    <textarea className="code" rows={3} value={q.testCases} onChange={e => updateQuestion(index, 'testCases', e.target.value)} />
                                </div>

                                {pageType === 'Explanation' && (
                                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #ccc' }}>
                                        <div className="input-group">
                                            <label>Solution Code</label>
                                            <textarea className="code" value={q.solutionCode} onChange={e => updateQuestion(index, 'solutionCode', e.target.value)} />
                                        </div>
                                        <div className="input-group">
                                            <label>Explanation Text</label>
                                            <textarea value={q.explanation} onChange={e => updateQuestion(index, 'explanation', e.target.value)} />
                                        </div>
                                    </div>
                                )}

                                <button className="btn" style={{ color: 'red', fontSize: '0.8rem', padding: 0 }} onClick={() => removeQuestion(index)}>Delete Question</button>
                            </div>
                        )}
                    </div>
                ))}

                <button className="btn btn-add" onClick={addQuestion}>+ Add Another Question</button>
            </div>

            <div className="footer-actions">
                <button className="btn btn-save" onClick={() => handleSave(false)} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save as Draft'}
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn" style={{ background: '#fbbc04', color: '#000' }} onClick={async () => {
                        if (window.confirm("Refresh Leaderboard?")) {
                            await refreshLeaderboardCache();
                            alert("Done");
                        }
                    }}>
                        Refresh Ranks
                    </button>
                    <button className="btn btn-publish" onClick={() => handleSave(true)} disabled={isLoading}>
                        {isLoading ? 'Publishing...' : 'Publish Live'}
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <div className="admin-modal-backdrop">
            <div className="admin-modal-content">
                <div className="admin-modal-header">
                    <h2>Admin Console</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>
                {viewMode === 'dashboard' ? renderDashboard() : renderEditor()}
            </div>
        </div>
    );
};

export default AdminPanel;