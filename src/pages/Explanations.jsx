import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './LiveQuiz.css';
import { useAuth } from '../contexts/useAuth';
import AdminPanel from '../Admin/AdminPanel';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getSolutionWeeks } from '../services/quizService';

// --- COMPONENT: Read-Only Code Editor ---
const ReadOnlyCodeEditor = ({ solutions }) => {
    const [viewLang, setViewLang] = useState('c');

    const languages = [
        { id: 'c', label: 'C' },
        { id: 'python', label: 'Python' },
        { id: 'java', label: 'Java' },
        { id: 'c++', label: 'C++' },
        { id: 'javascript', label: 'JavaScript' }
    ];

    let displayCode = "// Solution not available.";

    if (typeof solutions === 'string') {
        displayCode = solutions;
    } else if (solutions && typeof solutions === 'object') {
        // Fallback to JS if specific lang missing, or show specific message
        displayCode = solutions[viewLang] || solutions['c'] || "// No code provided for this language.";
    }

    return (
        <div className="editor-wrapper">
            <div className="editor-toolbar">
                <label>View Solution In:</label>
                <select
                    value={viewLang}
                    onChange={(e) => setViewLang(e.target.value)}
                    className="lang-select"
                    style={{cursor: 'pointer'}}
                >
                    {languages.map((l) => (
                        <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                </select>
            </div>
            {/* 🔴 FIX: Changed 'code' to 'displayCode' */}
            <textarea
                className="code-editor"
                value={displayCode || ''}
                readOnly
                spellCheck="false"
            />
        </div>
    );
};

const TestCaseViewer = ({ testCases }) => (
    <div className="test-cases-wrapper">
        <div className="test-cases-header">
            <h4 className="test-cases-title">Test Cases</h4>
            {/* Optional: Badge showing count */}
            <span className="test-cases-count">{(testCases || []).length} Total</span>
        </div>
        
        <div className="test-cases-content">
            {(testCases || []).map((testCase, index) => (
                <div key={index} className="test-case-card">
                    <span className="test-case-label">Case {index + 1}</span>
                    <pre className="test-case-code">{testCase}</pre>
                </div>
            ))}
        </div>
    </div>
);

// --- COMPONENT: Explanation Text ---
const ExplanationViewer = ({ text }) => (
    <div className="explanation-wrapper" style={{ marginTop: '2rem', padding: '1.5rem', background: '#e6f4ea', borderRadius: '12px', border: '1px solid #ceead6' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#137333', fontSize: '1.1rem', fontWeight: 'bold' }}>
            Detailed Explanation
        </h4>
        <p style={{ margin: 0, lineHeight: '1.6', color: '#3c4043', whiteSpace: 'pre-wrap' }}>
            {text || "No explanation provided for this question."}
        </p>
    </div>
);

// --- COMPONENT: Accordion Item ---
const ExplanationAccordion = ({ question, isOpen, onClick }) => {
    return (
        <div className={`question-card ${question.isMaster ? 'master-question' : ''}`}>
            <div className="question-header" onClick={onClick}>
                <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                    <h3 style={{margin:0}}>{question.title}</h3>
                    {question.isMaster && <span className="master-tag">(Mandatory)</span>}
                </div>
                <span className="accordion-icon" style={{fontSize:'1.2rem', fontWeight:'bold'}}>
                    {isOpen ? '−' : '+'}
                </span>
            </div>

            {isOpen && (
                <div className="question-body">
                    <div className="prompt-container">
                        <p className="question-prompt">{question.description || question.prompt || "No details provided."}</p>
                    </div>

                    <TestCaseViewer testCases={question.testCases} />

                    {/* Passes the solutionCode object/string from DB to the editor */}
                    <ReadOnlyCodeEditor solutions={question.solutionCode} />

                    <ExplanationViewer text={question.explanation} />
                </div>
            )}
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const Explanations = () => {
    const { user } = useAuth();
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [allData, setAllData] = useState({});
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [openQuestionId, setOpenQuestionId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getSolutionWeeks();
            setAllData(data);

            const weekKeys = Object.keys(data);
            // Check if we need to set a default week (only if one isn't selected yet)
            if (weekKeys.length > 0) {
                // Use functional state update to safely check 'selectedWeek' without adding it as a dependency
                setSelectedWeek(prevWeek => {
                    if (!prevWeek) {
                        const sortedWeeks = weekKeys.sort((a, b) => Number(b) - Number(a));
                        return sortedWeeks[0];
                    }
                    return prevWeek;
                });
            }
        } catch (error) {
            console.error("Failed to load explanations:", error);
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array means this function never changes

    // 3. Add fetchData to useEffect dependencies
    useEffect(() => {
        fetchData();
    }, [fetchData]); // Safe to add now because of useCallback

    const handleAdminClose = () => {
        setShowAdminPanel(false);
        fetchData();
    };

    const currentQuestions = allData[selectedWeek]?.questions || [];

    const handleToggle = (questionId) => {
        setOpenQuestionId(prev => (prev === questionId ? null : questionId));
    };

    console.log("Selected Week:", selectedWeek);
    console.log("Week Data Object:", allData[selectedWeek]);
    console.log("Questions Array:", currentQuestions);

    return (
        <>
            <Header />
            <div className="quiz-page-container">
                <div className="quiz-content">
                    {showAdminPanel && (
                        <AdminPanel
                            pageType="Explanation"
                            onClose={handleAdminClose}
                        />
                    )}

                    <div className="quiz-header-controls">
                        <Link to="/" className="back-link">
                            <span>← Back</span>
                        </Link>

                        {user && user.role === 'admin' && (
                            <button
                                className="admin-add-week-btn"
                                onClick={() => setShowAdminPanel(true)}
                                style={{backgroundColor: '#34a853'}}
                            >
                                + Manage Solutions
                            </button>
                        )}
                    </div>

                    <h1 className="quiz-title">Solution Archive</h1>

                    <nav className="week-nav">
                        {Object.keys(allData)
                            .sort((a, b) => Number(a) - Number(b))
                            .map(week => (
                                <button
                                    key={week}
                                    className={`week-nav-button ${selectedWeek === week ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedWeek(week);
                                        setOpenQuestionId(null);
                                    }}
                                >
                                    Week {week}
                                </button>
                            ))}
                    </nav>

                    <p className="quiz-subtitle">
                        Select a week below to view official solutions and detailed explanations.
                    </p>

                    <div className="questions-container">
                        {loading ? (
                            <div style={{textAlign:'center', padding:'3rem'}}>Loading...</div>
                        ) : currentQuestions.length > 0 ? (
                            currentQuestions.map(question => (
                                <ExplanationAccordion
                                    key={question.id}
                                    question={question}
                                    isOpen={openQuestionId === question.id}
                                    onClick={() => handleToggle(question.id)}
                                />
                            ))
                        ) : (
                            <div style={{textAlign:'center', padding:'3rem', color:'#666'}}>
                                No solutions found for Week {selectedWeek}.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Explanations;