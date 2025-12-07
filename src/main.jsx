import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext'; // Ensure this import is correct

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* The Provider MUST wrap the App */}
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>,
);