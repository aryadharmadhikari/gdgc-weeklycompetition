import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LiveQuiz.css'; // 👈 Uses the same professional UI styles
import { useAuth } from '../contexts/AuthContext';
import AdminPanel from '../Admin/AdminPanel';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getQuizWeeks } from '../services/quizService'; // Import the service

// 🔌 IMPORT REAL SERVICES
import { getQuizWeeks } from '../services/quizService';

// --- COMPONENT: Read-Only Code Editor ---
const ReadOnlyCodeEditor = ({ solutions }) => {
    // State to handle language switching
    const [viewLang, setViewLang] = useState('javascript');

    const languages = [
        { id: 'javascript', label: 'JavaScript' },
        { id: 'python', label: 'Python' },
        { id: 'java', label: 'Java' },
        { id: 'c', label: 'C' },
        { id: 'cpp', label: 'C++' }
    ];

    // 🛡️ Logic to handle both Old Data (String) and New Data (Object)
    let displayCode = "// Solution not available.";

    if (typeof solutions === 'string') {
        // Legacy/Simple: If database has just a string, show it.
        displayCode = solutions;
    } else if (solutions && typeof solutions === 'object') {
        // Modern: If database has multi-lang object, show selected lang.
        displayCode = solutions[viewLang] || solutions['javascript'] || "// No code provided.";
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
            <textarea
                className="code-editor"
                value={code || ''} // Handle nulls
                readOnly
                spellCheck="false"
            />
        </div>
    );
};

// --- COMPONENT: Test Case Viewer ---
const TestCaseViewer = ({ testCases }) => (
    <div className="test-cases-wrapper">
        <h4 className="test-cases-title">Test Cases</h4>
        <div className="test-cases-content">
            {/* Handle both Array (New) and String (Old) formats safely */}
            {(Array.isArray(testCases) ? testCases : [testCases]).map((testCase, index) => (
                <pre key={index} className="test-case">
                    {testCase}
                </pre>
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

            {/* Header */}
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

                    {/* Professional UI: Problem Statement */}
                    <div className="prompt-container">
                        <p className="question-prompt">{question.description || question.prompt || "No details provided."}</p>
                    </div>

                    <TestCaseViewer testCases={question.testCases} />

                    {/* Solution Viewer: Passes data dynamically */}
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

    // 1. STATE: Store Real Data from Firebase
    const [allData, setAllData] = useState({});
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [openQuestionId, setOpenQuestionId] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2. FETCH DATA: Load from Firestore on Mount
    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getQuizWeeks();
            setAllData(data);

            // Auto-select the latest week if available
            const weekKeys = Object.keys(data);
            if (weekKeys.length > 0 && !selectedWeek) {
                const sortedWeeks = weekKeys.sort((a, b) => Number(b) - Number(a));
                setSelectedWeek(sortedWeeks[0]);
            }
        } catch (error) {
            console.error("Failed to load explanations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 3. REFRESH HANDLER: Called when Admin Panel closes
    const handleAdminClose = () => {
        setShowAdminPanel(false);
        fetchData(); // 🔄 Re-fetch data to show new edits immediately
    };

    const currentQuestions = allData[selectedWeek] || [];

    const handleToggle = (questionId) => {
        setOpenQuestionId(prev => (prev === questionId ? null : questionId));
    };

    if (loading && !selectedWeek) return <div style={{padding:'2rem', textAlign:'center'}}>Loading Solutions...</div>;

    return (
        <>
            <Header />
            <div className="quiz-page-container">
                <div className="quiz-content">

                    {/* 🛡️ ADMIN PANEL INTEGRATION */}
                    {showAdminPanel && (
                        <AdminPanel
                            pageType="Explanation" // 👈 This tells AdminPanel to show Solution/Explanation fields
                            onClose={handleAdminClose}
                        />
                    )}

                    <div className="quiz-header-controls">
                        <Link to="/" className="back-link">
                            <span>← Back to Dashboard</span>
                        </Link>

                        {user && user.role === 'admin' && (
                            <button
                                className="admin-add-week-btn"
                                onClick={() => setShowAdminPanel(true)}
                                style={{backgroundColor: '#34a853'}} // Green color to distinguish
                            >
                                + Manage Solutions
                            </button>
                        )}
                    </div>

                    <h1 className="quiz-title">Solution Archive</h1>

                    {/* Navigation */}
                    <nav className="week-nav">
                        {Object.keys(allData)
                            .sort((a, b) => Number(a) - Number(b)) // Sort logic: 1, 2, 3...
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

                    {/* Content List */}
                    <div className="questions-container">
                        {currentQuestions.length > 0 ? (
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
                                No solutions published for Week {selectedWeek} yet.
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