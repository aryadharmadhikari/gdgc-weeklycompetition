import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { addQuizWeek, getNextWeekNumber, getAllQuizWeeksForAdmin, deleteQuizWeek } from '../services/quizService';
import { refreshLeaderboardCache } from '../services/leaderboardService';

// --- SUB-COMPONENT: Multi-Language Solution Input ---
const SolutionInput = ({ solutions, onChange }) => {
    // Local state to toggle views only
    const [activeLang, setActiveLang] = useState('javascript');

    const languages = [
        { id: 'javascript', label: 'JS' },
        { id: 'python', label: 'Python' },
        { id: 'java', label: 'Java' },
        { id: 'c', label: 'C' },
        { id: 'cpp', label: 'C++' }
    ];

    const currentCode = solutions?.[activeLang] || '';

    const handleCodeChange = (e) => {
        // Create a copy of the solutions object and update the specific language
        const updatedSolutions = {
            ...solutions,
            [activeLang]: e.target.value
        };
        onChange(updatedSolutions);
    };

    return (
        <div style={{ marginTop: '10px', border: '1px solid #d0d5dd', borderRadius: '8px', overflow: 'hidden' }}>
            {/* Language Tabs */}
            <div style={{ display: 'flex', background: '#f8f9fa', borderBottom: '1px solid #d0d5dd' }}>
                {languages.map(lang => (
                    <button
                        key={lang.id}
                        type="button"
                        onClick={() => setActiveLang(lang.id)}
                        style={{
                            flex: 1,
                            padding: '8px',
                            border: 'none',
                            background: activeLang === lang.id ? '#fff' : 'transparent',
                            color: activeLang === lang.id ? '#1a73e8' : '#666',
                            fontWeight: activeLang === lang.id ? 'bold' : 'normal',
                            borderBottom: activeLang === lang.id ? '2px solid #1a73e8' : 'none',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>

            {/* Code Textarea */}
            <textarea
                className="code-input"
                style={{ border: 'none', borderRadius: 0, borderTop: 'none' }}
                rows={6}
                placeholder={`Enter ${activeLang} solution here...`}
                value={currentCode}
                onChange={handleCodeChange}
            />
        </div>
    );
};

// --- MAIN ADMIN COMPONENT ---
const AdminPanel = ({ pageType, onClose }) => {
    const [viewMode, setViewMode] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(false);

    // DATA STATES
    const [allWeeks, setAllWeeks] = useState([]);
    const [editingWeekNum, setEditingWeekNum] = useState(null);

    const [questions, setQuestions] = useState([]);
    const [startDate, setStartDate] = useState('');

    // --- INITIALIZATION ---
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

        // 🚀 DEFAULT TEMPLATE
        setQuestions([
            { id: 1, title: 'Question 1', prompt: '', testCases: '', isMaster: false, isOpen: true, solutionCode: {} },
            { id: 2, title: 'Question 2', prompt: '', testCases: '', isMaster: false, isOpen: false, solutionCode: {} },
            { id: 3, title: 'Question 3', prompt: '', testCases: '', isMaster: true, isOpen: false, solutionCode: {} }
        ]);

        setIsLoading(false);
        // Default to current time, formatted for datetime-local (YYYY-MM-DDTHH:MM)
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setStartDate(now.toISOString().slice(0, 16));
        
        setViewMode('editor');
    };

    const handleEditWeek = (weekData) => {
        setEditingWeekNum(weekData.id);
        
        if (weekData.startDate) {
            setStartDate(weekData.startDate.slice(0, 16)); 
        } else {
            setStartDate('');
        }

        // Parse database questions back to state
        const parsedQuestions = weekData.questions.map((q, idx) => {
            // Handle legacy data where solutionCode might be a string
            let safeSolutions = {};
            if (typeof q.solutionCode === 'string') {
                safeSolutions = { javascript: q.solutionCode }; // Default old strings to JS
            } else {
                safeSolutions = q.solutionCode || {};
            }

            return {
                ...q,
                testCases: Array.isArray(q.testCases) ? q.testCases.join('\n') : q.testCases,
                solutionCode: safeSolutions, // Ensure object structure
                isOpen: idx === 0
            };
        });

        setQuestions(parsedQuestions);
        setViewMode('editor');
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            `⚠️ DANGER ZONE ⚠️\n\nAre you sure you want to DELETE Week ${editingWeekNum}?\n\nThis will remove the questions permanently.`
        );

        if (confirmDelete) {
            setIsLoading(true);
            try {
                await deleteQuizWeek(editingWeekNum);
                alert(`Week ${editingWeekNum} deleted.`);
                await loadDashboard();
                setViewMode('dashboard');
            } catch (err) {
                alert("Failed to delete week.");
            } finally {
                setIsLoading(false);
            }
        }
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
            prompt: '',
            testCases: '',
            isMaster: false,
            isOpen: true,
            solutionCode: {} // Initialize empty object for solutions
        };
        setQuestions(prev => [...prev.map(q => ({ ...q, isOpen: false })), newQ]);
    };

    const removeQuestion = (index) => {
        if (questions.length <= 1) return alert("Keep at least one question.");
        setQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async (isLive) => {
        // VALIDATION
        if (isLive) {
            const hasMaster = questions.some(q => q.isMaster);
            if (!hasMaster) {
                alert("⚠️ Cannot Publish:\nYou must mark at least one question as the 'Master Question' (Mandatory).");
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
                // Pass the full multi-language object only if on Explanation page
                solutionCode: pageType === 'Explanation' ? q.solutionCode : {},
                explanation: pageType === 'Explanation' ? q.explanation : ''
            }));
            
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
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <h3 style={{margin:0}}>Manage Content ({pageType})</h3>
            </div>

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
                    <div style={{display: 'flex', gap: '10px'}}>
                         {/* <button className="btn" style={{ background: '#ffdddd', color: '#d93025', border: '1px solid #d93025' }} onClick={handleDelete}>
                            🗑️ Delete Week
                        </button> */}
                        <button className="btn" style={{ border: '1px solid #ddd' }} onClick={() => setViewMode('dashboard')}>
                            Cancel
                        </button>
                    </div>
                </div>
                
                <div style={{ background: '#f1f3f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Competition Start Date & Time (Locks +7 Days from this time)</label>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
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
                                <div style={{marginBottom:'15px', padding:'10px', background:'#fff8e1', borderRadius:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
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
                                    <textarea className="code-input" rows={3} value={q.testCases} onChange={e => updateQuestion(index, 'testCases', e.target.value)} />
                                </div>

                                {/* 💡 CONDITIONAL FIELDS: Only show for Explanations Page */}
                                {pageType === 'Explanation' && (
                                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #ccc' }}>
                                        <div className="input-group">
                                            <label style={{color:'#1a73e8'}}>Solution Code (Multi-Language)</label>

                                            {/* ✨ NEW: Multi-Language Input Component */}
                                            <SolutionInput
                                                solutions={q.solutionCode}
                                                onChange={(newSolutions) => updateQuestion(index, 'solutionCode', newSolutions)}
                                            />

                                        </div>
                                        <div className="input-group" style={{marginTop:'15px'}}>
                                            <label style={{color:'#1a73e8'}}>Detailed Explanation Text</label>
                                            <textarea
                                                rows={4}
                                                placeholder="Explain the logic here..."
                                                value={q.explanation}
                                                onChange={e => updateQuestion(index, 'explanation', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                <button className="btn" style={{color:'red', fontSize:'0.8rem', padding:0, marginTop:'10px'}} onClick={() => removeQuestion(index)}>Delete Question</button>
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