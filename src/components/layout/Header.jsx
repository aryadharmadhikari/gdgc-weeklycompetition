// src/components/layout/Header.jsx
import React from 'react';
import { gdgTheme } from '../../theme/gdgctheme';
import gdgLogo from '../../assets/images/light_gdgdbit_logo.jpg'; // Direct import

const Header = () => {
    return (
        <header style={{
            backgroundColor: gdgTheme.colors.background.white,
            color: gdgTheme.colors.text.primary,
            padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.xl}`,
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
                {/* Direct logo usage */}
                <div style={{ display: 'flex', alignItems: 'center', gap: gdgTheme.spacing.md }}>
                    <img
                        src={gdgLogo}
                        alt="GDG Logo"
                        style={{
                            height: '80px',
                            width: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                </div>

                {/* Navigation */}
                <nav style={{ display: 'flex', gap: gdgTheme.spacing.lg, alignItems: 'center' }}>
                    {['Home', 'Events', 'Leaderboard'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            style={{
                                color: gdgTheme.colors.text.primary,
                                textDecoration: 'none',
                                ...gdgTheme.typography.styles.navLink,
                                padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}`,
                                borderRadius: gdgTheme.borderRadius.medium
                            }}
                        >
                            {item}
                        </a>
                    ))}

                    <button
                        style={{
                            backgroundColor: gdgTheme.colors.primary.blue,
                            color: gdgTheme.colors.text.inverse,
                            border: 'none',
                            ...gdgTheme.typography.styles.button,
                            padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.lg}`,
                            borderRadius: gdgTheme.borderRadius.medium,
                            cursor: 'pointer',
                            boxShadow: gdgTheme.shadows.button
                        }}
                    >
                        Live Quiz
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;