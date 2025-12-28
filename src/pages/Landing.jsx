import React from 'react';
import Header from '../components/layout/Header';
import Hero from '../components/common/Hero';
import Footer from '../components/layout/Footer'; // Add this
import Rulebook from './Rules';

const Landing = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Hero />

            <Rulebook />

            <Footer /> {/* Add this */}
        </div>
    );
};

export default Landing;
