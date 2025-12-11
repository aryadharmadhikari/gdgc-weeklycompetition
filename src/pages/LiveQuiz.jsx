import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LiveQuiz.css';
import { useAuth } from '../contexts/AuthContext';
import AdminPanel from '../Admin/AdminPanel';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// IMPORT SERVICES
import { getQuizWeeks, submitQuizWeek, getUserSubmission} from '../services/quizService';

// --- Child Components (Keep these exactly as they were) ---
const CodeEditor = ({ code, setCode, lang, setLang }) => {
    const languages = ['javascript', 'python', 'java', 'c', 'c++'];
    return (
        <div className="editor-wrapper">
            <div className="editor-toolbar">
                <label>Language:</label>
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="lang-select">
                    {languages.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
            </div>
            <textarea className="code-editor" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Write your code here..." spellCheck="false" />
        </div>
    );
};
const TestCaseViewer = ({ testCases }) => (
    <div className="test-cases-wrapper">
        <h4 className="test-cases-title">Test Cases</h4>
        <div className="test-cases-content">
            {(testCases || []).map((testCase, index) => <pre key={index} className="test-case">{testCase}</pre>)}
        </div>
    </div>
);
const QnaBox = ({ qna, setQna }) => (
    <div className="qna-wrapper">
        <h4 className="qna-title">Q&A / Notes</h4>
        <textarea className="qna-textarea" value={qna} onChange={(e) => setQna(e.target.value)} placeholder="Type questions or notes..." />
    </div>
);
const QuestionAccordion = ({ question, solution, onSolutionChange, qna, onQnaChange, isOpen, onClick }) => (
    <div className={`question-card ${question.isMaster ? 'master-question' : ''}`}>
        <div className="question-header" onClick={onClick}>
            <h3>{question.title} {question.isMaster && <span className="master-tag">(Mandatory)</span>}</h3>
            <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
        </div>
        {isOpen && (
            <div className="question-body">
                <p className="question-prompt">{question.description || question.prompt || "No details provided."}</p>
                <TestCaseViewer testCases={question.testCases} />
                <CodeEditor
                    code={solution.code} setCode={(c) => onSolutionChange(question.id, { ...solution, code: c })}
                    lang={solution.lang} setLang={(l) => onSolutionChange(question.id, { ...solution, lang: l })}
                />
                <QnaBox qna={qna} setQna={(q) => onQnaChange(question.id, q)} />
            </div>
        )}
    </div>
);
// --- MAIN COMPONENT ---
const LiveQuiz = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // UI States
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Data States
    const [allQuestions, setAllQuestions] = useState({}); // Stores all fetched weeks
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);

    // User Input States
    const [openQuestionId, setOpenQuestionId] = useState(null);
    const [solutions, setSolutions] = useState({});
    const [qnaMessages, setQnaMessages] = useState({});


    // 1. AUTH CHECK: Redirect if not signed in
    useEffect(() => {
        if (!user && !loading) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    // 2. DATA FETCHING: Load Weeks and Set Latest
    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const data = await getQuizWeeks();
                setAllQuestions(data);

                // LOGIC TO SELECT MOST RECENT WEEK
                const weekKeys = Object.keys(data);
                if (weekKeys.length > 0) {
                    // Sort keys numerically in descending order (e.g., [3, 2, 1])
                    const sortedWeeks = weekKeys.sort((a, b) => Number(b) - Number(a));
                    const latestWeek = sortedWeeks[0];

                    setSelectedWeek(latestWeek);
                    setCurrentQuestions(data[latestWeek]);
                }
            } catch (err) {
                console.error("Failed to load quiz data", err);
                setError("Failed to load questions. Please refresh.");
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchWeeks();
    }, [user]);

    // Update current questions when selected week changes manually
    useEffect(() => {
        if (selectedWeek && allQuestions[selectedWeek]) {
            setCurrentQuestions(allQuestions[selectedWeek]);
            setOpenQuestionId(null);
            setError('');
        }
    }, [selectedWeek, allQuestions]);

    useEffect(() => {
        const loadWeekData = async () => {
            if (selectedWeek && allQuestions[selectedWeek]) {
                setCurrentQuestions(allQuestions[selectedWeek]);
                setOpenQuestionId(null);
                setError('');

                // Reset states
                setAlreadySubmitted(false);
                setSolutions({});
                setQnaMessages({});

                if (user) {
                    setLoading(true); // Short load state for checking submission
                    const submission = await getUserSubmission(user.email, selectedWeek);

                    if (submission) {
                        setAlreadySubmitted(true);

                        // 🔄 RE-POPULATE ANSWERS
                        // Map the array from DB back to the object structure UI expects
                        const prevSolutions = {};
                        const prevQna = {};

                        submission.solutions.forEach(sol => {
                            prevSolutions[sol.questionId] = {
                                code: sol.code,
                                lang: sol.language
                            };
                            prevQna[sol.questionId] = sol.qna;
                        });

                        setSolutions(prevSolutions);
                        setQnaMessages(prevQna);
                    }
                    setLoading(false);
                }
            }
        };

        loadWeekData();
    }, [selectedWeek, allQuestions, user]);

    // --- HANDLERS ---

    const handleSolutionChange = (questionId, newSolution) => {
        setSolutions(prev => ({ ...prev, [questionId]: newSolution }));
    };

    const handleQnaChange = (questionId, newQna) => {
        setQnaMessages(prev => ({ ...prev, [questionId]: newQna }));
    };

    const handleToggle = (questionId) => {
        setOpenQuestionId(prev => (prev === questionId ? null : questionId));
    };

    const handleSubmit = async () => {
        if (!user) return;

        // Validation
        const masterQuestion = currentQuestions.find(q => q.isMaster);
        const masterSolution = solutions[masterQuestion?.id]?.code || '';

        if (!masterQuestion || masterSolution.trim() === '') {
            setError('Error: The mandatory question for this week must be answered.');
            setOpenQuestionId(masterQuestion?.id);
            return;
        }

        // Optional: Confirm resubmission if they already submitted
        if (alreadySubmitted) {
            if (!window.confirm("You have already submitted this week. Do you want to overwrite your previous answers?")) {
                return;
            }
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Format Data
            const formattedSolutions = currentQuestions.map(q => ({
                questionId: q.id,
                title: q.title,
                language: solutions[q.id]?.lang || 'javascript',
                code: solutions[q.id]?.code || '',
                qna: qnaMessages[q.id] || ''
            }));

            // Submit to Firebase
            await submitQuizWeek(
                user.email,
                selectedWeek,
                formattedSolutions
            );

            const actionType = alreadySubmitted ? "updated" : "submitted";
            alert(`Success! Week ${selectedWeek} answers ${actionType}.`);
            navigate('/leaderboard');

        } catch (err) {
            console.error(err);
            setError("Failed to submit. Please check connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div style={{padding:'2rem', textAlign:'center'}}>Loading Quiz...</div>;
    if (!user) return null; // Handled by useEffect redirect

    return (
        <>
            <Header />
            <div className="quiz-page-container">
                <div className="quiz-content">

                    {showAdminPanel && (
                        <AdminPanel pageType="Quiz" onClose={() => setShowAdminPanel(false)} />
                    )}

                    <div className="quiz-header-controls">
                        <Link to="/" className="back-link">
                            <span>← Back</span>
                        </Link>
                        {user.role === 'admin' && (
                            <button className="admin-add-week-btn" onClick={() => setShowAdminPanel(true)}>
                                + Add New Week
                            </button>
                        )}
                    </div>
                    {/* ... (Header Controls and Title remain the same) ... */}

                    <h1 className="quiz-title">Live Coding Competition</h1>

                    <nav className="week-nav">
                        {/* ... (Week navigation buttons remain the same) ... */}
                        {Object.keys(allQuestions)
                            .sort((a, b) => Number(a) - Number(b))
                            .map(week => (
                                <button
                                    key={week}
                                    className={`week-nav-button ${selectedWeek === week ? 'active' : ''}`}
                                    onClick={() => setSelectedWeek(week)}
                                >
                                    Week {week}
                                </button>
                            ))}
                    </nav>

                    <p className="quiz-subtitle">
                        Select a week to view questions. The final question of each week is mandatory.
                    </p>

                    {/* Error Message is OUTSIDE the questions container, so it won't affect colors */}
                    {error && <div className="quiz-error-message">{error}</div>}

                    {/* 🛡️ FIX: Wrapper Div isolates questions so nth-child colors don't shift */}
                    <div className="questions-container">
                        {currentQuestions.length > 0 ? (
                            currentQuestions.map(question => {
                                const solution = solutions[question.id] || { code: '', lang: 'javascript' };
                                const qna = qnaMessages[question.id] || '';
                                return (
                                    <QuestionAccordion
                                        key={question.id}
                                        question={question}
                                        solution={solution}
                                        onSolutionChange={handleSolutionChange}
                                        qna={qna}
                                        onQnaChange={handleQnaChange}
                                        isOpen={openQuestionId === question.id}
                                        onClick={() => handleToggle(question.id)}
                                    />
                                );
                            })
                        ) : (
                            <div style={{textAlign:'center', padding:'2rem', color:'#666'}}>
                                No questions found for Week {selectedWeek}.
                            </div>
                        )}
                    </div>

                    {currentQuestions.length > 0 && (
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button
                                className="submit-quiz-button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                style={{ opacity: isSubmitting ? 0.7 : 1, marginTop: 0 }} // Reset margin since container has it
                            >
                                {isSubmitting
                                    ? 'Processing...'
                                    : alreadySubmitted
                                        ? `Update / Resubmit Week ${selectedWeek}`
                                        : `Submit Week ${selectedWeek} Answers`
                                }
                            </button>

                            {/* ✨ NEW: Informational Note for Resubmissions */}
                            {alreadySubmitted && (
                                <p style={{
                                    fontSize: '0.85rem',
                                    color: '#5f6368',
                                    marginTop: '0.8rem',
                                    fontStyle: 'italic'
                                }}>
                                    Note: Your latest submission will overwrite previous answers and be used for the final score.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LiveQuiz;