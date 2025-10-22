import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import { loadGoogleFonts, gdgTheme } from './theme/gdgctheme';
import LiveQuiz from './pages/LiveQuiz';
import Explanations from './pages/Explanations';
function App() {
    // Load Google Fonts when app starts
    
    useEffect(() => {
        loadGoogleFonts();
    }, []);

    return (
        <div
            className="App"
            style={{
                fontFamily: gdgTheme.typography.primary.family,
                color: gdgTheme.colors.text.primary
            }}
        >
            <Router>
                
                {/* The Routes component will switch between your pages */}
                <Routes>
                    {/* Route for the landing page */}
                    <Route path="/" element={<Landing />} />
                    
                    {/* Route for the live quiz page */}
                    <Route path="/live-quiz" element={<LiveQuiz />} />
                    <Route path="/explanations" element={<Explanations />} />
                    {/* You can add more routes here in the future */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
