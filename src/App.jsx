// src/App.js
import React, { useState } from 'react';
import './App.css';

// Import your components (adjust paths as needed)
import Landing from './pages/landing';
import Sidebar from './components/layout/Sidebar';

function App() {
    const [currentView, setCurrentView] = useState('landing');
    const [selectedWeek, setSelectedWeek] = useState(1);

    // Mock authentication for testing
    const mockUser = null; // Change to { displayName: 'Test User' } to test logged-in state

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            {/* Sidebar */}
            <div style={{ width: '280px', backgroundColor: '#f8f9fa', borderRight: '1px solid #ddd' }}>
                <Sidebar
                    open={true}
                    selectedWeek={selectedWeek}
                    onWeekSelect={setSelectedWeek}
                    onClose={() => {}}
                />
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px' }}>
                {/* Navigation Buttons */}
                <div style={{ marginBottom: '20px' }}>
                    <button
                        onClick={() => setCurrentView('landing')}
                        style={{
                            backgroundColor: currentView === 'landing' ? '#4285f4' : '#f0f0f0',
                            color: currentView === 'landing' ? 'white' : 'black',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            marginRight: '10px',
                            cursor: 'pointer'
                        }}
                    >
                        Landing Page
                    </button>

                </div>

                {/* Component Display */}
                {currentView === 'landing' && <Landing />}
            </div>
        </div>
    );
}

export default App;
