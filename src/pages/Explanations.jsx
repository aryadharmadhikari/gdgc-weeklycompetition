import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LiveQuiz.css'; // We can reuse the same CSS file for a consistent look

// --- Mock Database of Explanations (Populate with your expert answers) ---
const allExplanations = {
    '1': [
        { 
            id: 'w1q1', 
            title: 'Question 1: FizzBuzz', 
            prompt: "Write a program that prints numbers from 1 to 100...", 
            explanation: "This solution uses a 'for' loop to iterate from 1 to 100. Inside the loop, it checks for divisibility by 15 (for 'FizzBuzz'), then 3 (for 'Fizz'), then 5 (for 'Buzz') using the modulo operator (%). If none of these conditions are met, it prints the number itself.",
            solution: { lang: 'javascript', code: `for (let i = 1; i <= 100; i++) {\n  if (i % 15 === 0) {\n    console.log("FizzBuzz");\n  } else if (i % 3 === 0) {\n    console.log("Fizz");\n  } else if (i % 5 === 0) {\n    console.log("Buzz");\n  } else {\n    console.log(i);\n  }\n}` }
        },
        { 
            id: 'w1q2', 
            title: 'Question 2: Palindrome Check', 
            prompt: 'Given a string, write a function to determine if it is a palindrome.', 
            explanation: "The most straightforward way to check for a palindrome is to compare the original string with its reversed version. This solution cleans the input string, splits it into an array of characters, reverses the array, and joins it back into a string.",
            solution: { lang: 'python', code: `def is_palindrome(s):\n    # Clean the string and reverse it\n    reversed_s = s[::-1]\n    return s == reversed_s\n\n# Example\nprint(is_palindrome("racecar"))` }
        },
    ],
    '2': [
         { 
            id: 'w2q1', 
            title: 'Question 1: Reverse a String', 
            prompt: 'Write a function that takes a string as input and returns the string reversed.', 
            explanation: "This solution leverages built-in JavaScript methods. The .split('') method converts the string into an array of characters, .reverse() reverses the elements in that array, and .join('') merges them back into a single string.",
            solution: { lang: 'javascript', code: `function reverseString(str) {\n  return str.split('').reverse().join('');\n}\n\nconsole.log(reverseString("hello")); // "olleh"` }
        },
    ]
};

// Modified CodeEditor to be read-only
const CodeEditor = ({ code, lang }) => {
    const languages = ['javascript', 'python', 'java', 'c', 'cpp'];
    return (
        <div className="editor-wrapper">
            <div className="editor-toolbar">
                <label>Language:</label>
                <select value={lang} disabled className="lang-select">
                    {languages.map((l) => (
                        <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                    ))}
                </select>
            </div>
            <textarea
                className="code-editor"
                value={code}
                readOnly // This makes the editor non-editable
            />
        </div>
    );
};

// Accordion for showing explanations
const ExplanationAccordion = ({ item, isOpen, onClick }) => {
    return (
        <div className="question-card">
            <div className="question-header" onClick={onClick}>
                <h3>{item.title}</h3>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && (
                <div className="question-body">
                    <p className="question-prompt"><strong>Prompt:</strong> {item.prompt}</p>
                    <hr className="explanation-divider" />
                    <p className="explanation-text"><strong>Explanation:</strong> {item.explanation}</p>
                    <CodeEditor
                        code={item.solution.code}
                        lang={item.solution.lang}
                    />
                </div>
            )}
        </div>
    );
};

const Explanations = () => {
    const [selectedWeek, setSelectedWeek] = useState(Object.keys(allExplanations)[0]);
    const [openQuestionId, setOpenQuestionId] = useState(null);

    const currentExplanations = allExplanations[selectedWeek] || [];

    const handleToggle = (questionId) => {
        setOpenQuestionId(prev => (prev === questionId ? null : questionId));
    };

    return (
        <div className="quiz-page-container">
            <div className="quiz-content">
            <Link to="/" className="back-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Back</span>
                    </Link>
                <h1 className="quiz-title">Weekly Code Explanations</h1>
                
                <nav className="week-nav">
                    {Object.keys(allExplanations).map(week => (
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
                    Select a week to review the official solutions and explanations for the coding challenges.
                </p>

                {currentExplanations.map(item => (
                    <ExplanationAccordion
                        key={item.id}
                        item={item}
                        isOpen={openQuestionId === item.id}
                        onClick={() => handleToggle(item.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Explanations;
