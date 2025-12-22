import React from 'react';
import { gdgTheme } from '../../theme/gdgctheme';
import GoogleBrandLines from './GoogleBrandLines';
import GoogleOrbs from './GoogleOrbs';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

const Hero = () => {
    const { isAuthenticated } = useAuth();

    // Helper style for shared button properties to keep JSX clean
    const baseButtonStyle = {
        border: 'none',
        padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.lg}`,
        borderRadius: '28px', // More rounded "Pill" shape is more modern Google
        cursor: 'pointer',
        transition: 'all 0.2s ease', // Smooth transition for transform & color
        ...gdgTheme.typography.styles.button,
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)', // Lift button off background
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500, // Slightly bolder for readability
        fontSize: '0.95rem'
    };

    return (
        <section style={{
            backgroundColor: gdgTheme.colors.background.dark,
            color: gdgTheme.colors.text.inverse,
            padding: `${gdgTheme.spacing.xxxl} ${gdgTheme.spacing.xl}`,
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '80vh', // Ensure it takes up enough visual space
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            {/* 1. BACKGROUND LAYER: Orbs */}
            <GoogleOrbs />

            {/* 2. SCRIM LAYER: Dark Vignette
                This ensures text is readable even if a bright orb passes behind it.
            */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0) 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* 3. CONTENT LAYER */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
                position: 'relative',
                zIndex: 1 // Important: Keeps buttons clickable above the Scrim
            }}>
                <div style={{ maxWidth: '900px' }}> {/* Limit text width for readability */}
                    <GoogleBrandLines
                        size="medium"
                        gap="8px"
                        style={{ marginBottom: gdgTheme.spacing.lg }}
                    />

                    <h1 style={{
                        ...gdgTheme.typography.styles.heroTitle,
                        marginBottom: gdgTheme.spacing.md,
                        color: gdgTheme.colors.text.inverse,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2
                    }}>
                        Welcome to the<br />
                        Google Developer Groups<br />

                        {/* Gradient Title */}
                        <span style={{
                            display: 'block',
                            marginTop: '8px',
                            background: `linear-gradient(90deg, #4285F4 0%, #8AB4F8 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                            paddingBottom: '10px'
                        }}>
                            Don Bosco Institute of Technology
                        </span>
                    </h1>

                    <p style={{
                        ...gdgTheme.typography.styles.largeParagraph,
                        color: '#e0e0e0',
                        marginBottom: gdgTheme.spacing.xl,
                        maxWidth: '600px', // Prevent text from stretching too wide
                        lineHeight: 1.6,
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>
                        A place where you can connect with developers, learn new technologies,
                        and grow together in DBIT's vibrant tech community.
                    </p>

                    {/* ACTION BUTTONS */}
                    <div style={{
                        display: 'flex',
                        gap: gdgTheme.spacing.md,
                        flexWrap: 'wrap',
                        marginBottom: gdgTheme.spacing.xl
                    }}>
                        {/* Primary Action: Learn More */}
                        <a
                            href="https://gdgc.dbit.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                ...baseButtonStyle,
                                backgroundColor: gdgTheme.colors.primary.blue,
                                color: '#ffffff',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = gdgTheme.colors.primary.darkBlue;
                                e.target.style.transform = 'translateY(-2px)'; // Subtle lift effect
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = gdgTheme.colors.primary.blue;
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            Learn More About GDG DBIT
                        </a>

                        {/* Secondary Action: Competition/Events */}
                        {isAuthenticated ? (
                            <Link
                                to="/live-quiz"
                                style={{
                                    ...baseButtonStyle,
                                    backgroundColor: gdgTheme.colors.secondary.green,
                                    color: '#ffffff',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = gdgTheme.colors.secondary.darkGreen;
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = gdgTheme.colors.secondary.green;
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                🏆 Join Current Competition
                            </Link>
                        ) : (
                            <a
                                href="https://gdgc.dbit.in/#/events"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    ...baseButtonStyle,
                                    backgroundColor: gdgTheme.colors.secondary.green,
                                    color: '#ffffff',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = gdgTheme.colors.secondary.darkGreen;
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = gdgTheme.colors.secondary.green;
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                Explore Events
                            </a>
                        )}
                    </div>

                    {/* METADATA: GLASS CHIP */}
                    {!isAuthenticated && (
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '50px',
                            padding: '8px 20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}>
                            <span style={{
                                ...gdgTheme.typography.styles.metadata,
                                color: '#ffffff',
                                margin: 0,
                                fontWeight: 400,
                                letterSpacing: '0.3px'
                            }}>
                                Sign in with your <strong style={{color: '#8AB4F8'}}>@dbit.in</strong> email to join competitions
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;