import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LiveQuiz.css';
import { useAuth } from '../contexts/AuthContext';
import AdminPanel from '../Admin/AdminPanel';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getQuizWeeks } from '../services/quizService'; // Import the service

// --- Sub-components (Keep these as they are) ---
const ReadOnlyCodeEditor = ({ code, lang }) => {
    const languages = ['javascript', 'python', 'java', 'c', 'cpp'];
    return (
        <div className="editor-wrapper">
            <div className="editor-toolbar">
                <label>Language:</label>
                <select value={lang} readOnly disabled className="lang-select">
                    {languages.map((l) => (
                        <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
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

const TestCaseViewer = ({ testCases }) => (
    <div className="test-cases-wrapper">
        <h4 className="test-cases-title">Test Cases</h4>
        <div className="test-cases-content">
            {(testCases || []).map((testCase, index) => (
                <pre key={index} className="test-case">
                    {testCase}
                </pre>
            ))}
        </div>
    </div>
);

const ExplanationViewer = ({ text }) => (
    <div className="explanation-wrapper">
        <h4 className="explanation-title">Explanation</h4>
        <p className="explanation-text">{text || "No explanation provided yet."}</p>
    </div>
);

const ExplanationAccordion = ({ question, isOpen, onClick }) => {
    return (
        <div className={`question-card ${question.isMaster ? 'master-question' : ''}`}>
            <div className="question-header" onClick={onClick}>
                <h3>{question.title} {question.isMaster && <span className="master-tag">(Mandatory)</span>}</h3>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && (
                <div className="question-body">
                    <p className="question-prompt">{question.prompt}</p>
                    {/* Ensure testCases is an array before passing */}
                    <TestCaseViewer testCases={Array.isArray(question.testCases) ? question.testCases : []} />
                    
                    <div style={{marginTop: '20px', borderTop: '2px dashed #eee', paddingTop: '20px'}}>
                        <h4 style={{color: '#1a73e8', marginBottom: '10px'}}>Official Solution</h4>
                        <ReadOnlyCodeEditor
                            code={question.solutionCode}
                            lang={question.language || 'javascript'}
                        />
                        <ExplanationViewer text={question.explanation} />
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---
const Explanations = () => {
    const { user } = useAuth();
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    
    // Data States
    const [allWeeks, setAllWeeks] = useState({});
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [openQuestionId, setOpenQuestionId] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Data from Firebase
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getQuizWeeks();
                setAllWeeks(data);

                // Default to latest week
                const weekKeys = Object.keys(data);
                if (weekKeys.length > 0) {
                    const sortedWeeks = weekKeys.sort((a, b) => Number(b) - Number(a));
                    setSelectedWeek(sortedWeeks[0]);
                }
            } catch (error) {
                console.error("Error loading explanations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to get questions for render
    const currentQuestions = (selectedWeek && allWeeks[selectedWeek]) 
        ? (allWeeks[selectedWeek].questions || []) 
        : [];

    const handleToggle = (questionId) => {
        setOpenQuestionId(prev => (prev === questionId ? null : questionId));
    };

    if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Loading Solutions...</div>;

    return (
        <>
            <Header />
            <div className="quiz-page-container">
                <div className="quiz-content">

                    {showAdminPanel && (
                        <AdminPanel
                            pageType="Explanation"
                            onClose={() => setShowAdminPanel(false)}
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
                                style={{backgroundColor: '#34a853'}} // Green color to distinguish
                            >
                                + Manage Solutions
                            </button>
                        )}
                    </div>

                    <h1 className="quiz-title">Weekly Explanations</h1>

                    <nav className="week-nav">
                        {Object.keys(allWeeks)
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
                        Select a week to view the official solutions and explanations.
                    </p>

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
                        <div style={{textAlign:'center', color:'#666', marginTop:'30px'}}>
                            No data found for Week {selectedWeek}.
                        </div>
                    )}
                </div>

            </div>
            <Footer />
        </>
    );
};

export default Explanations;