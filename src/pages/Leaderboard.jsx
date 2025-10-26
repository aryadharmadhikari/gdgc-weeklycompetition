import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { gdgTheme } from '../theme/gdgctheme';
import GoogleBrandLines from '../components/common/GoogleBrandLines';
import { getLeaderboardData } from '../services/leaderboardService.jsx';

const Leaderboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                const leaderboardData = await getLeaderboardData();
                setData(leaderboardData);
            } catch (err) {
                setError('Failed to load leaderboard');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        loadLeaderboard();
    }, []);

    // Define container styles for perfect alignment
    const CONTAINER_MAX_WIDTH = '1200px';
    const CONTAINER_PADDING = gdgTheme.spacing.xl;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: gdgTheme.colors.background.secondary,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Header />

            {/* Page Header - PERFECTLY ALIGNED */}
            <div style={{
                backgroundColor: gdgTheme.colors.background.dark,
                width: '100%',
                padding: `${gdgTheme.spacing.xxl} 0`, // Only vertical padding on outer container
                borderBottom: `1px solid ${gdgTheme.colors.neutral.lightGray}`
            }}>
                <div style={{
                    maxWidth: CONTAINER_MAX_WIDTH,
                    margin: '0 auto',
                    padding: `0 ${CONTAINER_PADDING}`,
                    textAlign: 'center'
                }}>
                    <GoogleBrandLines
                        variant="dynamic"
                        size="medium"
                        gap="8px"
                        style={{ justifyContent: 'center', marginBottom: gdgTheme.spacing.lg }}
                    />

                    <h1 style={{
                        ...gdgTheme.typography.styles.heroTitle,
                        color: gdgTheme.colors.primary.blue,
                        marginBottom: gdgTheme.spacing.md
                    }}>
                        Leaderboard
                    </h1>

                    <p style={{
                        ...gdgTheme.typography.styles.largeParagraph,
                        color: gdgTheme.colors.background.primary,
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Current rankings for the coding competition
                    </p>
                </div>
            </div>

            {/* Leaderboard Content - PERFECTLY ALIGNED */}
            <div style={{
                width: '100%',
                padding: `${gdgTheme.spacing.xl} 0`, // Only vertical padding on outer container
                flex: 1
            }}>
                <div style={{
                    maxWidth: CONTAINER_MAX_WIDTH,
                    margin: '0 auto',
                    padding: `0 ${CONTAINER_PADDING}`
                }}>
                    {loading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState error={error} />
                    ) : (
                        <LeaderboardTable data={data} />
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

const LoadingState = () => (
    <div style={{
        backgroundColor: gdgTheme.colors.background.primary,
        borderRadius: gdgTheme.borderRadius.large,
        padding: `${gdgTheme.spacing.xxxl} ${gdgTheme.spacing.xl}`,
        textAlign: 'center',
        boxShadow: gdgTheme.shadows.small
    }}>
        <div style={{
            width: '40px',
            height: '40px',
            border: `4px solid ${gdgTheme.colors.background.secondary}`,
            borderTop: `4px solid ${gdgTheme.colors.primary.blue}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
            marginBottom: gdgTheme.spacing.lg
        }} />
        <p style={{ ...gdgTheme.typography.styles.paragraph, color: gdgTheme.colors.text.secondary }}>
            Loading leaderboard...
        </p>
        <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
    </div>
);

const ErrorState = ({ error }) => (
    <div style={{
        backgroundColor: gdgTheme.colors.background.primary,
        borderRadius: gdgTheme.borderRadius.large,
        padding: `${gdgTheme.spacing.xxxl} ${gdgTheme.spacing.xl}`,
        textAlign: 'center',
        boxShadow: gdgTheme.shadows.small,
        border: `1px solid ${gdgTheme.colors.accent.red}`
    }}>
        <h3 style={{
            ...gdgTheme.typography.styles.sectionTitle,
            color: gdgTheme.colors.accent.red,
            marginBottom: gdgTheme.spacing.md
        }}>
            Error Loading Leaderboard
        </h3>
        <p style={{ ...gdgTheme.typography.styles.paragraph, color: gdgTheme.colors.text.secondary }}>
            {error}
        </p>
        <button
            onClick={() => window.location.reload()}
            style={{
                ...gdgTheme.typography.styles.button,
                backgroundColor: gdgTheme.colors.primary.blue,
                color: gdgTheme.colors.text.inverse,
                border: 'none',
                padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.lg}`,
                borderRadius: gdgTheme.borderRadius.medium,
                cursor: 'pointer',
                marginTop: gdgTheme.spacing.md
            }}
        >
            Try Again
        </button>
    </div>
);

const LeaderboardTable = ({ data }) => (
    <div style={{
        backgroundColor: gdgTheme.colors.background.primary,
        borderRadius: gdgTheme.borderRadius.large,
        overflow: 'hidden',
        boxShadow: gdgTheme.shadows.medium,
        width: '100%',
        margin: 0 // Ensure no extra margins
    }}>
        {/* Table Header */}
        <div style={{
            backgroundColor: gdgTheme.colors.background.secondary,
            padding: `${gdgTheme.spacing.lg} ${gdgTheme.spacing.xl}`,
            borderBottom: `1px solid ${gdgTheme.colors.neutral.lightGray}`
        }}>
            <h2 style={{
                ...gdgTheme.typography.styles.sectionTitle,
                margin: 0,
                color: gdgTheme.colors.text.primary,
                textAlign: 'center'
            }}>
                Current Rankings ({data.length} participants)
            </h2>
        </div>

        {/* Table Rows */}
        <div>
            {data.map((participant, index) => (
                <ParticipantRow
                    key={participant.id}
                    participant={participant}
                    isLast={index === data.length - 1}
                />
            ))}
        </div>
    </div>
);

const ParticipantRow = ({ participant, isLast }) => {
    const getRankColor = (rank) => {
        switch (rank) {
            case 1: return gdgTheme.colors.accent.yellow;
            case 2: return '#c0c0c0';
            case 3: return '#cd7f32';
            default: return gdgTheme.colors.primary.blue;
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return null;
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: `${gdgTheme.spacing.lg} ${gdgTheme.spacing.xl}`,
            borderBottom: !isLast ? `1px solid ${gdgTheme.colors.neutral.lightGray}` : 'none',
            transition: 'background-color 0.2s ease',
            minHeight: '100px'
        }}
             onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = gdgTheme.colors.background.secondary;
             }}
             onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = 'transparent';
             }}
        >
            {/* Rank */}
            <div style={{
                minWidth: '100px',
                textAlign: 'center',
                marginRight: gdgTheme.spacing.xl
            }}>
                <div style={{
                    ...gdgTheme.typography.styles.sectionTitle,
                    fontSize: '1.8rem',
                    color: getRankColor(participant.rank),
                    marginBottom: gdgTheme.spacing.xs
                }}>
                    #{participant.rank}
                </div>
                {getRankIcon(participant.rank) && (
                    <div style={{ fontSize: '2rem' }}>
                        {getRankIcon(participant.rank)}
                    </div>
                )}
            </div>

            {/* Avatar */}
            <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: gdgTheme.colors.primary.blue,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: gdgTheme.spacing.xl,
                ...gdgTheme.typography.styles.button,
                color: gdgTheme.colors.text.inverse,
                fontSize: '1.3rem',
                fontWeight: 'bold'
            }}>
                {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>

            {/* Name and Email */}
            <div style={{ flex: 1, marginRight: gdgTheme.spacing.xl }}>
                <div style={{
                    ...gdgTheme.typography.styles.subtitle,
                    fontSize: '1.3rem',
                    color: gdgTheme.colors.text.primary,
                    marginBottom: gdgTheme.spacing.xs
                }}>
                    {participant.name}
                </div>
                <div style={{
                    ...gdgTheme.typography.styles.paragraph,
                    fontSize: '1rem',
                    color: gdgTheme.colors.text.secondary
                }}>
                    {participant.email}
                </div>
            </div>

            {/* Stats */}
            <div style={{
                display: 'flex',
                gap: gdgTheme.spacing.xxxl,
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center', minWidth: '120px' }}>
                    <div style={{
                        ...gdgTheme.typography.styles.sectionTitle,
                        fontSize: '1.8rem',
                        color: gdgTheme.colors.primary.blue,
                        fontWeight: 'bold'
                    }}>
                        {participant.totalPoints}
                    </div>
                    <div style={{
                        ...gdgTheme.typography.styles.metadata,
                        color: gdgTheme.colors.text.secondary,
                        fontSize: '0.9rem'
                    }}>
                        Points
                    </div>
                </div>

                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <div style={{
                        ...gdgTheme.typography.styles.sectionTitle,
                        fontSize: '1.4rem',
                        color: gdgTheme.colors.text.primary
                    }}>
                        {participant.questionsCompleted || 0}
                    </div>
                    <div style={{
                        ...gdgTheme.typography.styles.metadata,
                        color: gdgTheme.colors.text.secondary,
                        fontSize: '0.9rem'
                    }}>
                        Questions
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
