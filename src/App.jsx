import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Landing.jsx';
import LiveQuiz from './pages/LiveQuiz';
import Leaderboard from './pages/Leaderboard';
import { AuthProvider } from './contexts/AuthContext';

// IMPORT THE NEW MODAL
import YearSelectionModal from './components/auth/YearSelectionModal';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                    {/* PLACE THE MODAL HERE */}
                    {/* It will be invisible unless a new user is signing up */}
                    <YearSelectionModal />

                    <main style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/live-quiz" element={<LiveQuiz />} />
                            <Route path="/leaderboard" element={<Leaderboard />} />
                        </Routes>
                    </main>

                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;