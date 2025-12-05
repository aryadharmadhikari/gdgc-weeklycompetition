import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LiveQuiz.css';
import { useAuth } from '../contexts/AuthContext';  // <-- IMPORT MOCK AUTH
import AdminPanel from '../Admin/AdminPanel'; // <-- IMPORT ADMIN MODAL
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';


// --- Mock Database of Questions (from your file) ---
const allQuestions = {
    '1': [
        { 
            id: 'w1q1', 
            title: 'Question 1: FizzBuzz', 
            prompt: "Write a program that prints numbers from 1 to 100. For multiples of three print 'Fizz', for multiples of five print 'Buzz', and for multiples of both, print 'FizzBuzz'.", 
            isMaster: false,
            testCases: [
                "Case 1: No input needed.",
                "Output: 1, 2, Fizz, 4, Buzz, Fizz, ..., 14, FizzBuzz, ..."
            ]
        },
        { 
            id: 'w1q2', 
            title: 'Question 2: Palindrome Check', 
            prompt: 'Given a string, write a function to determine if it is a palindrome.', 
            isMaster: false,
            testCases: [
                "Case 1:\nInput: \"racecar\"\nOutput: true",
                "Case 2:\nInput: \"hello\"\nOutput: false",
            ]
        },
        { 
            id: 'w1q3', 
            title: 'Question 3: Two Sum', 
            prompt: "Given an array of integers 'nums' and an integer 'target', return indices of the two numbers that add up to the target.", 
            isMaster: true,
            testCases: [
                "Case 1:\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]",
                "Case 2:\nInput: nums = [3, 2, 4], target = 6\nOutput: [1, 2]"
            ]
        },
    ],
    '2': [
        { id: 'w2q1', title: 'Question 1: Reverse a String', prompt: 'Write a function that takes a string as input and returns the string reversed.', isMaster: false, testCases: ["Input: \"hello\"\nOutput: \"olleh\""] },
        { id: 'w2q2', title: 'Question 2: Find the Largest Number', prompt: 'Given an array of numbers, find and return the largest element.', isMaster: false, testCases: ["Input: [1, 5, 2, 9, 3]\nOutput: 9"] },
        { id: 'w2q3', title: 'Question 3: Factorial Calculation', prompt: 'Write a function to calculate the factorial of a non-negative integer.', isMaster: true, testCases: ["Input: 5\nOutput: 120", "Input: 0\nOutput: 1"] },
    ],
};

// --- Child Components (CodeEditor, TestCaseViewer, QnaBox, QuestionAccordion) ---

const CodeEditor = ({ code, setCode, lang, setLang }) => {
    const languages = ['javascript', 'python', 'java', 'c', 'cpp'];
    return (
        <div className="editor-wrapper">
            <div className="editor-toolbar">
                <label>Language:</label>
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="lang-select">
                    {languages.map((l) => (
                        <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                    ))}
                </select>
            </div>
            <textarea
                className="code-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                spellCheck="false"
            />
        </div>
    );
};
const TestCaseViewer = ({ testCases }) => (
    <div className="test-cases-wrapper">
        <h4 className="test-cases-title">Test Cases</h4>
        <div className="test-cases-content">
            {testCases.map((testCase, index) => (
                <pre key={index} className="test-case">
                    {testCase}
                </pre>
            ))}
        </div>
    </div>
);
const QnaBox = ({ qna, setQna }) => (
    <div className="qna-wrapper">
        <h4 className="qna-title">Q&A / Notes</h4>
        <p className="qna-subtitle">Have questions or notes? Write them here.</p>
        <textarea
            className="qna-textarea"
            value={qna}
            onChange={(e) => setQna(e.target.value)}
            placeholder="Type your questions or thoughts here..."
        />
    </div>
);
const QuestionAccordion = ({ question, solution, onSolutionChange, qna, onQnaChange, isOpen, onClick }) => {
    return (
        <div className={`question-card ${question.isMaster ? 'master-question' : ''}`}>
            <div className="question-header" onClick={onClick}>
                <h3>{question.title} {question.isMaster && <span className="master-tag">(Mandatory)</span>}</h3>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && (
                <div className="question-body">
                    <p className="question-prompt">{question.prompt}</p>
                    <TestCaseViewer testCases={question.testCases} />
                    <CodeEditor
                        code={solution.code}
                        setCode={(newCode) => onSolutionChange(question.id, { ...solution, code: newCode })}
                        lang={solution.lang}
                        setLang={(newLang) => onSolutionChange(question.id, { ...solution, lang: newLang })}
                    />
                    <QnaBox
                        qna={qna}
                        setQna={(newQna) => onQnaChange(question.id, newQna)}
                    />
                </div>
            )}
        </div>
    );
};


// --- Main LiveQuiz Component ---
const LiveQuiz = () => {
    const { user } = useAuth(); // <-- Get the mock user
    const [showAdminPanel, setShowAdminPanel] = useState(false); // State to show/hide modal

    const [selectedWeek, setSelectedWeek] = useState(Object.keys(allQuestions)[0]);
    const [openQuestionId, setOpenQuestionId] = useState(null);
    const [solutions, setSolutions] = useState({});
    const [qnaMessages, setQnaMessages] = useState({}); 
    const [error, setError] = useState('');

    const currentQuestions = allQuestions[selectedWeek] || [];

    const handleSolutionChange = (questionId, newSolution) => {
        setSolutions(prev => ({ ...prev, [questionId]: newSolution, }));
    };
    
    const handleQnaChange = (questionId, newQna) => {
        setQnaMessages(prev => ({ ...prev, [questionId]: newQna, }));
    };

    const handleToggle = (questionId) => {
        setOpenQuestionId(prev => (prev === questionId ? null : questionId));
    };

    const handleSubmit = () => {
        const masterQuestion = currentQuestions.find(q => q.isMaster);
        const masterSolution = solutions[masterQuestion.id]?.code || '';

        if (!masterQuestion || masterSolution.trim() === '') {
            setError('Error: The mandatory question for this week must be answered. Your submission was not recorded.');
            setOpenQuestionId(masterQuestion.id);
            return;
        }

        setError('');
        const submissionData = { 
            week: selectedWeek,
            solutions: currentQuestions.map(q => ({
                questionId: q.id,
                title: q.title,
                language: solutions[q.id]?.lang || 'javascript',
                code: solutions[q.id]?.code || '',
                qna: qnaMessages[q.id] || ''
            })),
            submittedAt: new Date().toISOString(),
        };
        console.log('Submitting to database:', submissionData);
        alert('Submission Successful!\n(Check the console for the submitted data)');
    };

    return (
        <>
         <Header />
        <div className="quiz-page-container">
            <div className="quiz-content">
                
                {/* --- NEW: Show Admin Panel modal if true --- */}
                {showAdminPanel && (
                    <AdminPanel 
                        pageType="Quiz" 
                        onClose={() => setShowAdminPanel(false)} 
                    />
                )}

                <div className="quiz-header-controls">
                    <Link to="/" className="back-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Back</span>
                    </Link>

                    {/* --- NEW: Show "Add Week" button ONLY if user is admin --- */}
                    {user && user.role === 'admin' && (
                        <button 
                            className="admin-add-week-btn" 
                            onClick={() => setShowAdminPanel(true)}
                        >
                            + Add New Week
                        </button>
                    )}
                </div>

                <h1 className="quiz-title">Live Coding Competition</h1>
                
                <nav className="week-nav">
                    {Object.keys(allQuestions).map(week => (
                        <button
                            key={week}
                            className={`week-nav-button ${selectedWeek === week ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedWeek(week);
                                setOpenQuestionId(null); 
                                setError(''); 
                            }}
                        >
                            Week {week}
                        </button>
                    ))}
                </nav>

                <p className="quiz-subtitle">
                    Select a week to view questions. The final question of each week is mandatory for submission.
                </p>

                {error && <div className="quiz-error-message">{error}</div>}

                {currentQuestions.map(question => {
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
})}

                <button className="submit-quiz-button" onClick={handleSubmit}>
                    Submit Week {selectedWeek} Answers
                </button>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default LiveQuiz;