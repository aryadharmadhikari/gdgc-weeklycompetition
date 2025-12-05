import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gdgTheme } from '../../theme/gdgctheme';
import gdgLogo from '../../assets/images/light_gdgdbit_logo.jpg';
// TODO: Import your mobile specific logo here
// import gdgLogoMobile from '../../assets/images/gdg_logo_icon.png';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Header = () => {
    const { user, isAuthenticated, signIn, signOut } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Responsive States
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();

    // Monitor Screen Size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false); // Close mobile menu if switching to desktop
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            setIsMobileMenuOpen(false);
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
        setIsMobileMenuOpen(false);
    };

    // Reusable Nav Links Array
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'Explanations', path: '/explanations' }
    ];

    return (
        <>
            <header style={{
                backgroundColor: gdgTheme.colors.background.primary,
                color: gdgTheme.colors.text.primary,
                padding: isMobile ? `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}` : `${gdgTheme.spacing.sm} ${gdgTheme.spacing.xl}`,
                position: 'sticky', // Changed to sticky for better mobile UX
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
                    {/* Logo Section */}
                    <Link to="/" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: gdgTheme.spacing.md }}>
                            <img
                                // Logic: Use specific mobile logo if on mobile, else desktop logo
                                src={gdgLogo}
                                alt="GDG Logo"
                                style={{
                                    height: isMobile ? '40px' : '60px', // Smaller logo on mobile
                                    width: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    </Link>

                    {/* DESKTOP NAVIGATION */}
                    {!isMobile && (
                        <nav style={{ display: 'flex', gap: gdgTheme.spacing.lg, alignItems: 'center' }}>
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    style={{
                                        color: gdgTheme.colors.text.primary,
                                        textDecoration: 'none',
                                        ...gdgTheme.typography.styles.navLink,
                                        padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}`,
                                        borderRadius: gdgTheme.borderRadius.medium,
                                        transition: 'background-color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = gdgTheme.colors.background.secondary}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    {item.name}
                                </Link>
                            ))}

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
                                }}
                            >
                                Live Competition
                            </button>

                            {/* Desktop Auth Button / User Menu */}
                            {!isAuthenticated ? (
                                <button
                                    onClick={handleSignIn}
                                    disabled={loading}
                                    style={{
                                        backgroundColor: loading ? gdgTheme.colors.neutral.gray : gdgTheme.colors.secondary.green,
                                        color: gdgTheme.colors.text.inverse,
                                        border: 'none',
                                        ...gdgTheme.typography.styles.button,
                                        padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.lg}`,
                                        borderRadius: gdgTheme.borderRadius.medium,
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: gdgTheme.spacing.sm
                                    }}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            ) : (
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: gdgTheme.spacing.sm,
                                            padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}`,
                                            backgroundColor: gdgTheme.colors.background.primary,
                                            border: `1px solid ${gdgTheme.colors.neutral.lightGray}`,
                                            borderRadius: gdgTheme.borderRadius.medium,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            backgroundColor: gdgTheme.colors.primary.blue,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'white', fontWeight: 'bold'
                                        }}>
                                            {user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                        </div>
                                    </button>
                                    {/* Desktop Dropdown */}
                                    {showDropdown && (
                                        <div style={{
                                            position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                                            backgroundColor: gdgTheme.colors.background.primary,
                                            border: `1px solid ${gdgTheme.colors.neutral.lightGray}`,
                                            borderRadius: gdgTheme.borderRadius.medium,
                                            boxShadow: gdgTheme.shadows.large,
                                            minWidth: '200px', zIndex: 1000
                                        }}>
                                            <div style={{ padding: gdgTheme.spacing.md, borderBottom: `1px solid ${gdgTheme.colors.neutral.lightGray}` }}>
                                                <div style={{ fontWeight: '500' }}>{user?.displayName}</div>
                                                <div style={{ fontSize: '0.8rem', color: gdgTheme.colors.text.secondary }}>{user?.email}</div>
                                            </div>
                                            <button
                                                onClick={handleSignOut}
                                                style={{
                                                    width: '100%', padding: gdgTheme.spacing.md,
                                                    backgroundColor: 'transparent', border: 'none',
                                                    color: gdgTheme.colors.accent.red, textAlign: 'left', cursor: 'pointer'
                                                }}
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </nav>
                    )}

                    {/* MOBILE HAMBURGER ICON */}
                    {isMobile && (
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '5px'
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={gdgTheme.colors.text.primary}>
                                {isMobileMenuOpen ? (
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /> // X icon
                                ) : (
                                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /> // Hamburger icon
                                )}
                            </svg>
                        </button>
                    )}
                </div>

                {/* MOBILE MENU DROPDOWN */}
                {isMobile && isMobileMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: gdgTheme.colors.background.primary,
                        borderTop: `1px solid ${gdgTheme.colors.neutral.lightGray}`,
                        boxShadow: gdgTheme.shadows.large,
                        padding: gdgTheme.spacing.lg,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: gdgTheme.spacing.md,
                        zIndex: 999
                    }}>
                        {/* Mobile User Info (if logged in) */}
                        {isAuthenticated && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: gdgTheme.spacing.sm,
                                paddingBottom: gdgTheme.spacing.md,
                                borderBottom: `1px solid ${gdgTheme.colors.neutral.lightGray}`
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    backgroundColor: gdgTheme.colors.primary.blue,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: 'bold'
                                }}>
                                    {user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontWeight: '500' }}>{user?.displayName}</div>
                                    <div style={{ fontSize: '0.8rem', color: gdgTheme.colors.text.secondary }}>{user?.email}</div>
                                </div>
                            </div>
                        )}

                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{
                                    color: gdgTheme.colors.text.primary,
                                    textDecoration: 'none',
                                    fontSize: '1.1rem',
                                    padding: gdgTheme.spacing.sm
                                }}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <button
                            onClick={handleLiveQuizClick}
                            style={{
                                backgroundColor: gdgTheme.colors.primary.blue,
                                color: gdgTheme.colors.text.inverse,
                                border: 'none',
                                padding: gdgTheme.spacing.md,
                                borderRadius: gdgTheme.borderRadius.medium,
                                cursor: 'pointer',
                                width: '100%',
                                textAlign: 'center'
                            }}
                        >
                            Live Competition
                        </button>

                        {!isAuthenticated ? (
                            <button
                                onClick={() => { handleSignIn(); setIsMobileMenuOpen(false); }}
                                style={{
                                    backgroundColor: gdgTheme.colors.secondary.green,
                                    color: gdgTheme.colors.text.inverse,
                                    border: 'none',
                                    padding: gdgTheme.spacing.md,
                                    borderRadius: gdgTheme.borderRadius.medium,
                                    cursor: 'pointer',
                                    width: '100%',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: gdgTheme.spacing.sm
                                }}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        ) : (
                            <button
                                onClick={handleSignOut}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: gdgTheme.colors.accent.red,
                                    border: `1px solid ${gdgTheme.colors.accent.red}`,
                                    padding: gdgTheme.spacing.md,
                                    borderRadius: gdgTheme.borderRadius.medium,
                                    cursor: 'pointer',
                                    width: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                Sign Out
                            </button>
                        )}
                    </div>
                )}
            </header>

            {/* Error Toast */}
            {error && (
                <div style={{
                    position: 'fixed', top: '80px', right: '20px',
                    backgroundColor: gdgTheme.colors.accent.red, color: 'white',
                    padding: gdgTheme.spacing.md, borderRadius: gdgTheme.borderRadius.medium,
                    boxShadow: gdgTheme.shadows.large, zIndex: 2000, maxWidth: '300px'
                }}>
                    {error}
                </div>
            )}
        </>
    );
};

export default Header;