import React, { useEffect } from 'react';
import Landing from './pages/Landing';
import { loadGoogleFonts, gdgTheme } from './theme/gdgctheme';

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
            <Landing />
        </div>
    );
}

export default App;
