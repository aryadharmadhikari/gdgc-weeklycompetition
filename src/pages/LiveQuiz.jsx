// src/components/LiveQuiz.jsx

import React, { useState } from 'react';
import './LiveQuiz.css'; // We will create this CSS file next

// This is a reusable component for the language selector and editor
const CodeEditor = ({ code, setCode, lang, setLang }) => {
  const languages = ['javascript', 'python', 'java', 'c', 'cpp'];

  return (
    <div className="editor-wrapper">
      <div className="editor-toolbar">
        <label htmlFor={`lang-select-${lang}`}>Language: </label>
        <select
          id={`lang-select-${lang}`}
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="lang-select"
        >
          {languages.map((l) => (
            <option key={l} value={l}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </option>
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

// This is the main accordion item component
const QuestionAccordion = ({
  title,
  prompt,
  code,
  setCode,
  lang,
  setLang,
  isOpen,
  onClick,
  isMaster = false,
}) => {
  return (
    <div className={`question-card ${isMaster ? 'master-question' : ''}`}>
      <div className="question-header" onClick={onClick}>
        <h3>
          {title} {isMaster && <span className="master-tag">(Mandatory)</span>}
        </h3>
        <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <div className="question-body">
          <p className="question-prompt">{prompt}</p>
          <CodeEditor
            code={code}
            setCode={setCode}
            lang={lang}
            setLang={setLang}
          />
        </div>
      )}
    </div>
  );
};

// Main page component
const LiveQuiz = () => {
  // State to manage which accordion is open
  const [openQuestion, setOpenQuestion] = useState(null); // null, 1, 2, or 3

  // State for each question's code and language
  const [q1Code, setQ1Code] = useState('');
  const [q1Lang, setQ1Lang] = useState('javascript');

  const [q2Code, setQ2Code] = useState('');
  const [q2Lang, setQ2Lang] = useState('javascript');

  const [q3Code, setQ3Code] = useState('');
  const [q3Lang, setQ3Lang] = useState('javascript');

  // State for submission error
  const [error, setError] = useState('');

  const handleToggle = (index) => {
    if (openQuestion === index) {
      setOpenQuestion(null); // Close it if it's already open
    } else {
      setOpenQuestion(index); // Open the clicked one
    }
  };

  const handleSubmit = () => {
    // **MANDATORY CHECK for Question 3**
    if (q3Code.trim() === '') {
      setError('Error: Question 3 is mandatory and cannot be empty. Your submission was not recorded.');
      setOpenQuestion(3); // Automatically open the Q3 accordion
      return;
    }

    // Clear any previous errors
    setError('');

    // --- Database Submission Logic (for later) ---
    // Here you would send the data to your backend
    const submissionData = {
      question1: { language: q1Lang, code: q1Code },
      question2: { language: q2Lang, code: q2Code },
      question3: { language: q3Lang, code: q3Code },
      submittedAt: new Date().toISOString(),
    };

    console.log('Submitting to database:', submissionData);
    alert('Submission Successful!\n(Check the console for data)');
    // --- End of DB Logic ---
  };

  return (
    <div className="quiz-page-container">
      <div className="quiz-content">
        <h1 className="quiz-title">Live Coding Competition</h1>
        <p className="quiz-subtitle">
          Welcome! You can attempt questions in any order, but Question 3 is mandatory for submission.
        </p>

        {error && <div className="quiz-error-message">{error}</div>}

        {/* Question 1 */}
        <QuestionAccordion
          title="Question 1: FizzBuzz"
          prompt="Write a program that prints the numbers from 1 to 100. But for multiples of three print 'Fizz' instead of the number and for the multiples of five print 'Buzz'. For numbers which are multiples of both three and five print 'FizzBuzz'."
          code={q1Code}
          setCode={setQ1Code}
          lang={q1Lang}
          setLang={setQ1Lang}
          isOpen={openQuestion === 1}
          onClick={() => handleToggle(1)}
        />

        {/* Question 2 */}
        <QuestionAccordion
          title="Question 2: Palindrome Check"
          prompt="Given a string, write a function to determine if it is a palindrome. A palindrome is a word, phrase, number, or other sequence of characters that reads the same backward as forward."
          code={q2Code}
          setCode={setQ2Code}
          lang={q2Lang}
          setLang={setQ2Lang}
          isOpen={openQuestion === 2}
          onClick={() => handleToggle(2)}
        />

        {/* Question 3 (Master Question) */}
        <QuestionAccordion
          title="Question 3: Two Sum"
          prompt="Given an array of integers 'nums' and an integer 'target', return indices of the two numbers such that they add up to 'target'. You may assume that each input would have exactly one solution, and you may not use the same element twice."
          code={q3Code}
          setCode={setQ3Code}
          lang={q3Lang}
          setLang={setQ3Lang}
          isOpen={openQuestion === 3}
          onClick={() => handleToggle(3)}
          isMaster={true}
        />

        <button className="submit-quiz-button" onClick={handleSubmit}>
          Submit Final Answers
        </button>
      </div>
    </div>
  );
};

export default LiveQuiz;