import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gdgTheme } from '../../theme/gdgctheme';
import gdgLogo from '../../assets/images/light_gdgdbit_logo.jpg';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Header = () => {
    const { user, isAuthenticated, signIn, signOut } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            setLoading(true);
            setError(null);
            await signIn();
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            setLoading(true);
            await signOut();
            setShowDropdown(false);
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleLiveQuizClick = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            setError('Please sign in with your DBIT Gmail to access Live Competition');
            setTimeout(() => setError(null), 3000);
            return;
        }
        navigate('/live-quiz');
    };

    return (
        <>
            <header style={{
                backgroundColor: gdgTheme.colors.background.primary,
                color: gdgTheme.colors.text.primary,
                padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.xl}`,
                position: 'static',
                top: 0,
                zIndex: 1000,
                boxShadow: gdgTheme.shadows.small
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Logo links to the homepage */}
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: gdgTheme.spacing.md }}>
                            <img
                                src={gdgLogo}
                                alt="GDG Logo"
                                style={{
                                    height: '60px',
                                    width: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav style={{ display: 'flex', gap: gdgTheme.spacing.lg, alignItems: 'center' }}>
                        {/* Navigation Links - Removed Events */}
                        {['Home', 'Leaderboard', 'Explanations'].map((item) => {
                            if (item === 'Home') {
                                return (
                                    <Link
                                        key={item}
                                        to="/"
                                        style={{
                                            color: gdgTheme.colors.text.primary,
                                            textDecoration: 'none',
                                            ...gdgTheme.typography.styles.navLink,
                                            padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}`,
                                            borderRadius: gdgTheme.borderRadius.medium,
                                            transition: 'background-color 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = gdgTheme.colors.background.secondary;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        {item}
                                    </Link>
                                );
                            } else if (item === 'Leaderboard') {
                                return (
                                    <Link
                                        key={item}
                                        to="/leaderboard"
                                        style={{
                                            color: gdgTheme.colors.text.primary,
                                            textDecoration: 'none',
                                            ...gdgTheme.typography.styles.navLink,
                                            padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}`,
                                            borderRadius: gdgTheme.borderRadius.medium,
                                            transition: 'background-color 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = gdgTheme.colors.background.secondary;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        {item}
                                    </Link>
                                );
                            } else if (item === 'Explanations') {
                                return (
                                    <Link
                                        key={item}
                                        to="/explanations"
                                        style={{
                                            color: gdgTheme.colors.text.primary,
                                            textDecoration: 'none',
                                            ...gdgTheme.typography.styles.navLink,
                                            padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}`,
                                            borderRadius: gdgTheme.borderRadius.medium,
                                            transition: 'background-color 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = gdgTheme.colors.background.secondary;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        {item}
                                    </Link>
                                );
                            }
                            return null;
                        })}

                        {/* Live Quiz Button - Protected */}
                        <button
                            onClick={handleLiveQuizClick}
                            style={{
                                backgroundColor: gdgTheme.colors.primary.blue,
                                color: gdgTheme.colors.text.inverse,
                                border: 'none',
                                ...gdgTheme.typography.styles.button,
                                padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.md}`,
                                borderRadius: gdgTheme.borderRadius.medium,
                                cursor: 'pointer',
                                boxShadow: gdgTheme.shadows.button,
                                textDecoration: 'none',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = gdgTheme.colors.primary.darkBlue;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = gdgTheme.colors.primary.blue;
                            }}
                        >
                            Live Competition
                        </button>

                        {/* Authentication Section */}
                        {!isAuthenticated ? (
                            /* Sign In Button */
                            <button
                                onClick={handleSignIn}
                                disabled={loading}
                                style={{
                                    backgroundColor: loading
                                        ? gdgTheme.colors.neutral.gray
                                        : gdgTheme.colors.secondary.green,
                                    color: gdgTheme.colors.text.inverse,
                                    border: 'none',
                                    ...gdgTheme.typography.styles.button,
                                    padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.lg}`,
                                    borderRadius: gdgTheme.borderRadius.medium,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: gdgTheme.shadows.button,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: gdgTheme.spacing.sm,
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.target.style.backgroundColor = gdgTheme.colors.secondary.darkGreen;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.backgroundColor = gdgTheme.colors.secondary.green;
                                    }
                                }}
                            >
                                {loading ? (
                                    <>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid transparent',
                                            borderTop: '2px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }} />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                    </>
                                )}
                            </button>
                        ) : (
                            /* User Dropdown - FIXED SECTION */
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: gdgTheme.spacing.sm,
                                        padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}`,
                                        backgroundColor: gdgTheme.colors.background.primary,
                                        border: `1px solid ${gdgTheme.colors.neutral.lightGray}`,
                                        borderRadius: gdgTheme.borderRadius.medium,
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s ease',
                                        ...gdgTheme.typography.styles.button
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = gdgTheme.colors.primary.blue;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = gdgTheme.colors.neutral.lightGray;
                                    }}
                                >
                                    {/* Avatar - Always stays blue */}
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: gdgTheme.colors.primary.blue,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        flexShrink: 0,
                                        pointerEvents: 'none'
                                    }}>
                                        {user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                    </div>

                                    {/* Name */}
                                    <span style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        maxWidth: '100px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        color: gdgTheme.colors.text.primary
                                    }}>
                                        {user?.displayName?.split(' ')[0] || 'User'}
                                    </span>

                                    {/* Dropdown Arrow */}
                                    <span style={{
                                        fontSize: '0.8rem',
                                        color: gdgTheme.colors.text.primary
                                    }}>
                                        ▼
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '8px',
                                        backgroundColor: gdgTheme.colors.background.primary,
                                        border: `1px solid ${gdgTheme.colors.neutral.lightGray}`,
                                        borderRadius: gdgTheme.borderRadius.medium,
                                        boxShadow: gdgTheme.shadows.large,
                                        minWidth: '80px',
                                        maxWidth: '400px',
                                        width: 'max-content',
                                        zIndex: 1000
                                    }}>
                                        {/* User Info */}
                                        <div style={{
                                            padding: gdgTheme.spacing.md,
                                            borderBottom: `1px solid ${gdgTheme.colors.neutral.lightGray}`
                                        }}>
                                            <div style={{
                                                fontSize: '1rem',
                                                fontWeight: '500',
                                                marginBottom: '0.25rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {user?.displayName}
                                            </div>
                                            <div style={{
                                                fontSize: '0.8rem',
                                                color: gdgTheme.colors.text.secondary,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {user?.email}
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div>
                                            <div style={{
                                                height: '1px',
                                                backgroundColor: gdgTheme.colors.neutral.lightGray,
                                            }} />

                                            <button
                                                onClick={handleSignOut}
                                                disabled={loading}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: gdgTheme.spacing.sm,
                                                    padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.md}`,
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    color: gdgTheme.colors.accent.red,
                                                    fontSize: '0.9rem',
                                                    cursor: loading ? 'not-allowed' : 'pointer',
                                                    transition: 'background-color 0.2s ease',
                                                    textAlign: 'left',
                                                    whiteSpace: 'nowrap'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!loading) {
                                                        e.target.style.backgroundColor = 'rgba(234, 67, 53, 0.1)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = 'transparent';
                                                }}
                                            >
                                                {loading ? 'Signing out...' : 'Sign Out'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </nav>
                </div>

                {/* Loading spinner CSS */}
                <style>
                    {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                </style>
            </header>

            {/* Error Toast */}
            {error && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    right: '20px',
                    backgroundColor: gdgTheme.colors.accent.red,
                    color: 'white',
                    padding: gdgTheme.spacing.md,
                    borderRadius: gdgTheme.borderRadius.medium,
                    boxShadow: gdgTheme.shadows.large,
                    zIndex: 2000,
                    maxWidth: '300px',
                    fontSize: '0.9rem'
                }}>
                    {error}
                </div>
            )}

            {/* Close dropdown when clicking outside */}
            {showDropdown && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </>
    );
};

export default Header;
