import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gdgTheme } from './theme/gdgctheme';
import Home from './pages/Landing.jsx';
import LiveQuiz from './pages/LiveQuiz';
import Leaderboard from './pages/Leaderboard';
import Explanations from './pages/Explanations.jsx';

// IMPORT THE NEW MODAL
import YearSelectionModal from './components/auth/YearSelectionModal';

function App() {
    return (
            <Router>
                <div style={{
                    fontFamily: gdgTheme.typography.primary.family,
                    color: gdgTheme.colors.text.primary
                }}>

                    {/* PLACE THE MODAL HERE */}
                    {/* It will be invisible unless a new user is signing up */}
                    <YearSelectionModal />

                    <main style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/live-quiz" element={<LiveQuiz />} />
                            <Route path="/leaderboard" element={<Leaderboard />} />
                            <Route path="/Explanations" element={<Explanations />} />
                        </Routes>
                    </main>

                </div>
            </Router>
    );
}

export default App;