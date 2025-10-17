import React from 'react';
import Header from '../components/layout/Header';
import Hero from '../components/common/Hero';

const Landing = () => {
    return (
        <div style={{ minHeight: '100vh' }}>
            <Header />
            <Hero />

            {/* Additional sections will go here later */}
            <main style={{ padding: '2rem' }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '2rem 0'
                }}>
                    <h2 style={{
                        color: '#4285f4',
                        fontSize: '2rem',
                        marginBottom: '1rem'
                    }}>
                        Competition Features Coming Soon
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Weekly challenges, real-time leaderboards, and learning resources
                        will be available here once you sign in with your DBIT Gmail account.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Landing;
