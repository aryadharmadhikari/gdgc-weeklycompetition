import React from 'react';
import { gdgTheme } from '../../theme/gdgctheme';
import GoogleBrandLines from './GoogleBrandLines';
import GoogleOrbs from './GoogleOrbs';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Hero = () => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <section style={{
                backgroundColor: gdgTheme.colors.background.dark,
                color: gdgTheme.colors.text.inverse,
                padding: `${gdgTheme.spacing.xxxl} ${gdgTheme.spacing.xl}`,
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Google Orbs Background Component */}
                <GoogleOrbs />

                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ maxWidth: '1600px' }}>
                        <GoogleBrandLines
                            size="medium"
                            gap="8px"
                            style={{ marginBottom: gdgTheme.spacing.lg }}
                        />

                        <h1 style={{
                            ...gdgTheme.typography.styles.heroTitle,
                            marginBottom: gdgTheme.spacing.md,
                            color: gdgTheme.colors.text.inverse
                        }}>
                            Welcome to the<br />
                            Google Developer Group<br />
                            <div className="text-glow" style={{ maxWidth: '1200px', margin: '0 auto', color: "#4285f4" }}>
                                Don Bosco Institute of Technology
                            </div>
                        </h1>

                        <p style={{
                            ...gdgTheme.typography.styles.largeParagraph,
                            color: '#cccccc',
                            marginBottom: gdgTheme.spacing.xl
                        }}>
                            A place where you can connect with developers, learn new technologies,
                            and grow together in DBIT's vibrant tech community.
                        </p>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: gdgTheme.spacing.md, flexWrap: 'wrap' }}>
                            {/* Learn More Button - Always visible */}
                            <a
                                href="https://gdgc.dbit.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    backgroundColor: gdgTheme.colors.primary.blue,
                                    color: gdgTheme.colors.text.inverse,
                                    border: 'none',
                                    padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.xl}`,
                                    borderRadius: gdgTheme.borderRadius.medium,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                    ...gdgTheme.typography.styles.button,
                                    boxShadow: gdgTheme.shadows.button,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = gdgTheme.colors.primary.darkBlue;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = gdgTheme.colors.primary.blue;
                                }}
                            >
                                Learn More About GDG DBIT
                            </a>

                            {isAuthenticated ? (
                                <>
                                    {/* Join Competition Button - Only for authenticated users */}
                                    <Link
                                        to="/live-quiz"
                                        style={{
                                            backgroundColor: gdgTheme.colors.secondary.green,
                                            color: gdgTheme.colors.text.inverse,
                                            border: 'none',
                                            padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.xl}`,
                                            borderRadius: gdgTheme.borderRadius.medium,
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s',
                                            ...gdgTheme.typography.styles.button,
                                            boxShadow: gdgTheme.shadows.button,
                                            textDecoration: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = gdgTheme.colors.secondary.darkGreen;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = gdgTheme.colors.secondary.green;
                                        }}
                                    >
                                        🏆 Join Current Competition
                                    </Link>
                                </>
                            ) : (
                                /* Explore Button - Only for non-authenticated users */
                                <a
                                    href="https://gdgc.dbit.in/#/events"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        backgroundColor: gdgTheme.colors.secondary.green,
                                        color: gdgTheme.colors.text.inverse,
                                        border: 'none',
                                        padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.xl}`,
                                        borderRadius: gdgTheme.borderRadius.medium,
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s',
                                        ...gdgTheme.typography.styles.button,
                                        boxShadow: gdgTheme.shadows.button,
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = gdgTheme.colors.secondary.darkGreen;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = gdgTheme.colors.secondary.green;
                                    }}
                                >
                                    Explore Events
                                </a>
                            )}
                        </div>

                        <p style={{
                            ...gdgTheme.typography.styles.metadata,
                            color: gdgTheme.colors.text.muted,
                            marginTop: gdgTheme.spacing.md
                        }}>
                            {!isAuthenticated && 'Sign in with your @dbit.in email to join competitions'}
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;
