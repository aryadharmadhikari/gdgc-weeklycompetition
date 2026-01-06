import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LiveQuiz.css';
import { useAuth } from '../contexts/useAuth';
import AdminPanel from '../Admin/AdminPanel';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import { getQuizWeeks, submitQuizWeek, getUserSubmission} from '../services/quizService';

// --- HELPER FUNCTION ---
const isWeekExpired = (weekData) => {
    if (!weekData || !weekData.startDate) return false;

    const start = new Date(weekData.startDate);
    const deadline = new Date(start);
    deadline.setDate(start.getDate() + 7);

    return new Date() > deadline;
};

const CodeEditor = ({ code, setCode, lang, setLang }) => {
    const languages = ['c', 'python', 'java', 'c++', 'javascript'];

    // Function to handle the Tab key press
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault(); // Stops the focus from moving to the next box

            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const spaces = "    "; // 4 spaces for a tab

            // Insert spaces at the cursor position
            const newCode = code.substring(0, start) + spaces + code.substring(end);
            
            setCode(newCode);

            // Move the cursor forward by 4 spaces
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4;
            }, 0);
        }
    };

    return (
        <div className="editor-wrapper">
            <div className="editor-toolbar">
                <label>Language:</label>
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="lang-select">
                    {languages.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
            </div>
            <textarea
                className="code-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown} 
                placeholder="Write your code here..."
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
const QnaBox = ({ qna, setQna }) => (
    <div className="qna-wrapper">
        <h4 className="qna-title">Q&A / Notes</h4>
        <textarea className="qna-textarea" value={qna} onChange={(e) => setQna(e.target.value)} placeholder="Type questions or notes..." />
    </div>
);

// --- NEW COMPONENT: Explanation Box ---
const ExplanationBox = ({ explanation, setExplanation }) => (
    <div className="explanation-wrapper">
        <h4 className="explanation-title">Logic Explanation <span className="required-star">*</span></h4>
        <textarea
            className="explanation-textarea"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Please explain the logic behind your solution..."
        />
    </div>
);

const QuestionAccordion = ({ question, solution, onSolutionChange, qna, onQnaChange, explanation, onExplanationChange, isOpen, onClick, index }) => (
    <div className={`question-card ${question.isMaster ? 'master-question' : ''}`}>
        <div className="question-header" onClick={onClick}>
            <h3>{question.title} {question.isMaster && <span className="master-tag">(Mandatory)</span>}</h3>
            <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
        </div>
        {isOpen && (
            <div className="question-body">
                <h4 className="question-title">Problem Statement:</h4>
                <p className="question-prompt">{question.description || question.prompt || "No details provided."}</p>
                <TestCaseViewer testCases={question.testCases} />
                <CodeEditor
                    code={solution.code} setCode={(c) => onSolutionChange(question.id, { ...solution, code: c })}
                    lang={solution.lang} setLang={(l) => onSolutionChange(question.id, { ...solution, lang: l })}
                />

                {/* Render ExplanationBox ONLY for the 3rd question (index 2) */}
                {index === 2 && (
                    <ExplanationBox
                        explanation={explanation}
                        setExplanation={(val) => onExplanationChange(question.id, val)}
                    />
                )}

                <QnaBox qna={qna} setQna={(q) => onQnaChange(question.id, q)} />
            </div>
        )}
    </div>
);

// --- MAIN COMPONENT ---
const LiveQuiz = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [allQuestions, setAllQuestions] = useState({});
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);

    const [openQuestionId, setOpenQuestionId] = useState(null);
    const [solutions, setSolutions] = useState({});
    const [qnaMessages, setQnaMessages] = useState({});
    const [explanations, setExplanations] = useState({}); // New state for explanations

    // 1. AUTH CHECK
    useEffect(() => {
        if (!user && !loading) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    // 2. DATA FETCHING
    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const data = await getQuizWeeks();
                setAllQuestions(data);

                const weekKeys = Object.keys(data);
                if (weekKeys.length > 0) {
                    const sortedWeeks = weekKeys.sort((a, b) => Number(b) - Number(a));
                    const latestWeek = sortedWeeks[0];

                    setSelectedWeek(latestWeek);
                    setCurrentQuestions(data[latestWeek].questions || []);
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

    // Update current questions when selected week changes
    useEffect(() => {
        if (selectedWeek && allQuestions[selectedWeek]) {
            setCurrentQuestions(allQuestions[selectedWeek].questions || []);
            setOpenQuestionId(null);
            setError('');
        }
    }, [selectedWeek, allQuestions]);

    useEffect(() => {
        const loadWeekData = async () => {
            if (selectedWeek && allQuestions[selectedWeek]) {
                setCurrentQuestions(allQuestions[selectedWeek].questions || []);
                setOpenQuestionId(null);
                setError('');

                setAlreadySubmitted(false);
                setSolutions({});
                setQnaMessages({});
                setExplanations({});

                if (user) {
                    setLoading(true);
                    // Updated to handle the new return structure (full object)
                    const submissionData = await getUserSubmission(user.email, selectedWeek);

                    if (submissionData && submissionData.solutions) {
                        setAlreadySubmitted(true);
                        const prevSolutions = {};
                        const prevQna = {};
                        const prevExplanations = {};

                        submissionData.solutions.forEach(sol => {
                            prevSolutions[sol.questionId] = {
                                code: sol.code,
                                lang: sol.language
                            };

                            // Logic to extract explanation from qna if it exists
                            if (sol.qna && sol.qna.includes('|||EXPL|||')) {
                                const parts = sol.qna.split('|||EXPL|||');
                                prevExplanations[sol.questionId] = parts[0];
                                prevQna[sol.questionId] = parts[1];
                            } else {
                                prevQna[sol.questionId] = sol.qna;
                            }
                        });

                        setSolutions(prevSolutions);
                        setQnaMessages(prevQna);
                        setExplanations(prevExplanations);
                    }
                    setLoading(false);
                }
            }
        };

        loadWeekData();
    }, [selectedWeek, allQuestions, user]);

    const handleSolutionChange = (questionId, newSolution) => {
        setSolutions(prev => ({ ...prev, [questionId]: newSolution }));
    };

    const handleQnaChange = (questionId, newQna) => {
        setQnaMessages(prev => ({ ...prev, [questionId]: newQna }));
    };

    const handleExplanationChange = (questionId, newExpl) => {
        setExplanations(prev => ({ ...prev, [questionId]: newExpl }));
    };

    const handleToggle = (questionId) => {
        setOpenQuestionId(prev => (prev === questionId ? null : questionId));
    };

    // --- EXPIRATION CHECK ---
    const currentWeekData = allQuestions[selectedWeek];
    const isExpired = isWeekExpired(currentWeekData);

    const handleSubmit = async () => {
        if (!user) return;

        // 1. Strict Expiration Check
        if (isExpired) {
            setError('⛔ Competition Closed. You cannot submit anymore.');
            return;
        }

        const masterQuestion = currentQuestions.find(q => q.isMaster);
        const masterSolution = solutions[masterQuestion?.id]?.code || '';

        if (!masterQuestion || masterSolution.trim() === '') {
            setError('Error: The mandatory question for this week must be answered.');
            setOpenQuestionId(masterQuestion?.id);
            return;
        }

        // 2. Validate Explanation for 3rd Question (Index 2)
        if (currentQuestions.length > 2) {
            const thirdQuestion = currentQuestions[2];
            const expl = explanations[thirdQuestion.id] || '';
            if (!expl.trim()) {
                setError(`Error: Please provide an explanation for Question 3 (${thirdQuestion.title}).`);
                setOpenQuestionId(thirdQuestion.id);
                return;
            }
        }

        if (alreadySubmitted) {
            if (!window.confirm("You have already submitted this week. Do you want to overwrite your previous answers?")) {
                return;
            }
        }

        setIsSubmitting(true);
        setError('');

        try {
            const formattedSolutions = currentQuestions.map((q, index) => {
                let finalQna = qnaMessages[q.id] || '';

                // Append explanation to QnA for the 3rd question to save it
                if (index === 2) {
                    const expl = explanations[q.id] || '';
                    finalQna = `${expl}|||EXPL|||${finalQna}`;
                }

                return {
                    questionId: q.id,
                    title: q.title,
                    language: solutions[q.id]?.lang || 'c',
                    code: solutions[q.id]?.code || '',
                    qna: finalQna
                };
            });

            // UPDATED: Pass the full user object to include name/uid/email
            await submitQuizWeek(
                {
                    email: user.email,
                    name: user.displayName,
                    uid: user.uid
                },
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
    if (!user) return null;

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

                    <h1 className="quiz-title">Live Coding Competition</h1>

                    <nav className="week-nav">
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

                    {error && <div className="quiz-error-message">{error}</div>}

                    <div className="questions-container">
                        {currentQuestions.length > 0 ? (
                            currentQuestions.map((question, index) => {
                                const solution = solutions[question.id] || { code: '', lang: 'c' };
                                const qna = qnaMessages[question.id] || '';
                                const explanation = explanations[question.id] || '';
                                return (
                                    <QuestionAccordion
                                        key={question.id}
                                        index={index}
                                        question={question}
                                        solution={solution}
                                        onSolutionChange={handleSolutionChange}
                                        qna={qna}
                                        onQnaChange={handleQnaChange}
                                        explanation={explanation}
                                        onExplanationChange={handleExplanationChange}
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
                            {/* --- DATE DISPLAY --- */}
                            {currentWeekData?.startDate && (
                                <div style={{textAlign: 'center', marginBottom: '1rem', color: isExpired ? 'red' : 'green', fontWeight: 'bold'}}>
                                    {isExpired
                                        ? `Competition Closed (Ended ${new Date(new Date(currentWeekData.startDate).setDate(new Date(currentWeekData.startDate).getDate() + 7)).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'})})`
                                        : `Ends on ${new Date(new Date(currentWeekData.startDate).setDate(new Date(currentWeekData.startDate).getDate() + 7)).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'})}`
                                    }
                                </div>
                            )}

                            {/* --- SUBMIT BUTTON --- */}
                            <button
                                className="submit-quiz-button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || isExpired} // STRICTLY DISABLED IF EXPIRED
                                style={{
                                    opacity: (isSubmitting || isExpired) ? 0.7 : 1,
                                    cursor: (isSubmitting || isExpired) ? 'not-allowed' : 'pointer',
                                    marginTop: 0
                                }}
                            >
                                {isSubmitting
                                    ? 'Processing...'
                                    : isExpired
                                        ? '⛔ Competition Closed'
                                        : alreadySubmitted
                                            ? `Update / Resubmit Week ${selectedWeek}`
                                            : `Submit Week ${selectedWeek} Answers`
                                }
                            </button>

                            {alreadySubmitted && !isExpired && (
                                <p style={{
                                    fontSize: '0.85rem',
                                    color: '#5f6368',
                                    marginTop: '0.8rem',
                                    fontStyle: 'italic'
                                }}>
                                    Note: Your latest submission will overwrite any previous answers and will be used for the final score.
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