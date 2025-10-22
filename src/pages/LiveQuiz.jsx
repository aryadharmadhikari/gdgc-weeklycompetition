import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './LiveQuiz.css'; // We will update this CSS file next

// --- Mock Database of Questions (Replace with actual DB call later) ---
const allQuestions = {
    '1': [
        { id: 'w1q1', title: 'Question 1: FizzBuzz', prompt: "Write a program that prints numbers from 1 to 100. For multiples of three print 'Fizz', for multiples of five print 'Buzz', and for multiples of both, print 'FizzBuzz'.", isMaster: false },
        { id: 'w1q2', title: 'Question 2: Palindrome Check', prompt: 'Given a string, write a function to determine if it is a palindrome.', isMaster: false },
        { id: 'w1q3', title: 'Question 3: Two Sum', prompt: "Given an array of integers 'nums' and a target, return indices of the two numbers that add up to the target.", isMaster: true },
    ],
    '2': [
        { id: 'w2q1', title: 'Question 1: Reverse a String', prompt: 'Write a function that takes a string as input and returns the string reversed.', isMaster: false },
        { id: 'w2q2', title: 'Question 2: Find the Largest Number', prompt: 'Given an array of numbers, find and return the largest element.', isMaster: false },
        { id: 'w2q3', title: 'Question 3: Factorial Calculation', prompt: 'Write a function to calculate the factorial of a non-negative integer.', isMaster: true },
    ],
    '3': [
        { id: 'w3q1', title: 'Question 1: Vowel Count', prompt: 'Return the number of vowels in a given string.', isMaster: false },
        { id: 'w3q2', title: 'Question 2: Anagram Check', prompt: 'Write a function to check if two strings are anagrams of each other.', isMaster: false },
        { id: 'w3q3', title: 'Question 3: Fibonacci Sequence', prompt: 'Write a function to generate the nth Fibonacci number.', isMaster: true },
    ]
};

const CodeEditor = ({ code, setCode, lang, setLang }) => {
    const languages = ['javascript', 'python', 'java', 'c', 'c++'];
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

const QuestionAccordion = ({ question, solution, onSolutionChange, isOpen, onClick }) => {
    return (
        <div className={`question-card ${question.isMaster ? 'master-question' : ''}`}>
            <div className="question-header" onClick={onClick}>
                <h3>{question.title} {question.isMaster && <span className="master-tag">(Mandatory)</span>}</h3>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && (
                <div className="question-body">
                    <p className="question-prompt">{question.prompt}</p>
                    <CodeEditor
                        code={solution.code}
                        setCode={(newCode) => onSolutionChange(question.id, { ...solution, code: newCode })}
                        lang={solution.lang}
                        setLang={(newLang) => onSolutionChange(question.id, { ...solution, lang: newLang })}
                    />
                </div>
            )}
        </div>
    );
};

const LiveQuiz = () => {
    const [selectedWeek, setSelectedWeek] = useState(Object.keys(allQuestions)[0]);
    const [openQuestionId, setOpenQuestionId] = useState(null);
    const [solutions, setSolutions] = useState({});
    const [error, setError] = useState('');

    const currentQuestions = allQuestions[selectedWeek] || [];

    const handleSolutionChange = (questionId, newSolution) => {
        setSolutions(prev => ({
            ...prev,
            [questionId]: newSolution,
        }));
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
            })),
            submittedAt: new Date().toISOString(),
        };

        console.log('Submitting to database:', submissionData);
        alert('Submission Successful!\n(Check the console for the submitted data)');
    };

    return (
        <div className="quiz-page-container">
            <div className="quiz-content">
                <div className="quiz-header-controls">
                    <Link to="/" className="back-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Back</span>
                    </Link>
                </div>

                <h1 className="quiz-title">Live Coding Competition</h1>
                
                {/* Weekly Navigation */}
                <nav className="week-nav">
                    {Object.keys(allQuestions).map(week => (
                        <button
                            key={week}
                            className={`week-nav-button ${selectedWeek === week ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedWeek(week);
                                setOpenQuestionId(null); // Close accordion on week change
                                setError(''); // Clear errors
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
                    return (
                        <QuestionAccordion
                            key={question.id}
                            question={question}
                            solution={solution}
                            onSolutionChange={handleSolutionChange}
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
    );
};

export default LiveQuiz;
