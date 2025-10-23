import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Leaderboard from './pages/Leaderboard';
import { AuthProvider } from './hooks/useAuth.jsx';
import { loadGoogleFonts, gdgTheme } from './theme/gdgctheme';
import LiveQuiz from "./pages/LiveQuiz.jsx";

function App() {
    useEffect(() => {
        loadGoogleFonts();
    }, []);

    return (
        <AuthProvider>
            <div
                className="App"
                style={{
                    fontFamily: gdgTheme.typography.primary.family,
                    color: gdgTheme.colors.text.primary
                }}
            >
                <Router>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/live-quiz" element={<LiveQuiz />} />
                    </Routes>
                </Router>
            </div>
        </AuthProvider>
    );
}

export default App;
