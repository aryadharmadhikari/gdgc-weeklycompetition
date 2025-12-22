import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.jsx";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { gdgTheme } from '../theme/gdgctheme';
import GoogleBrandLines from '../components/common/GoogleBrandLines';

const Leaderboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- LOGIC START (UNTOUCHED) ---
    useEffect(() => {
        const buildDynamicLeaderboard = async () => {
            try {
                setLoading(true);
                const lbColRef = collection(db, "leaderboard");
                const lbSnapshot = await getDocs(lbColRef);
                const aggregator = {};
                let latestWeekNo = -1;

                lbSnapshot.forEach(doc => {
                    if (doc.id === 'global') return;
                    const weekData = doc.data().users || [];
                    weekData.forEach(item => {
                        const wNo = Number(item.weekNo);
                        if (!isNaN(wNo) && wNo > latestWeekNo) latestWeekNo = wNo;
                    });
                    weekData.forEach(submission => {
                        const email = submission.email;
                        if (!email) return;
                        if (!aggregator[email]) {
                            aggregator[email] = {
                                id: email,
                                email: email,
                                name: submission.name || "Unknown Participant",
                                totalPoints: 0,
                                browniePoints: 0,
                                q3Score: 0,
                                questionsCompleted: 0,
                                submittedWeeks: []
                            };
                        }
                        const q1 = Number(submission.q1_score) || 0;
                        const q2 = Number(submission.q2_score) || 0;
                        const q3 = Number(submission.q3_score) || 0;
                        const total = Number(submission.total_score) || 0;
                        const weekNum = Number(submission.weekNo);

                        aggregator[email].totalPoints += total;
                        aggregator[email].browniePoints += (q1 + q2);
                        aggregator[email].q3Score += q3;
                        if (!isNaN(weekNum)) aggregator[email].submittedWeeks.push(weekNum);
                        if (q1 > 0) aggregator[email].questionsCompleted++;
                        if (q2 > 0) aggregator[email].questionsCompleted++;
                        if (q3 > 0) aggregator[email].questionsCompleted++;
                        if (submission.name) aggregator[email].name = submission.name;
                    });
                });

                const processed = Object.values(aggregator).map(p => {
                    let streak = 0;
                    const weeksSet = new Set(p.submittedWeeks);
                    for (let i = latestWeekNo; i >= 0; i--) {
                        if (weeksSet.has(i)) streak++;
                        else break;
                    }
                    return { ...p, streak };
                });

                processed.sort((a, b) => {
                    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
                    if (b.browniePoints !== a.browniePoints) return b.browniePoints - a.browniePoints;
                    if (b.q3Score !== a.q3Score) return b.q3Score - a.q3Score;
                    if (b.questionsCompleted !== a.questionsCompleted) return b.questionsCompleted - a.questionsCompleted;
                    return b.streak - a.streak;
                });

                const ranked = processed.map((p, index) => ({
                    ...p,
                    rank: index + 1
                }));

                setData(ranked);
            } catch (err) {
                console.error("Aggregation Error:", err);
                setError("Failed to load leaderboard.");
            } finally {
                setLoading(false);
            }
        };
        buildDynamicLeaderboard().catch(err => console.error("Effect Error:", err));
    }, []);
    // --- LOGIC END ---

    const CONTAINER_MAX_WIDTH = '1200px';

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: gdgTheme.colors.background.secondary,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Roboto', sans-serif"
        }}>
            <Header />

            <style>
                {`
                    /* High Energy Animations */
                    @keyframes floatCenter {
                        0% { transform: translate(0, 0) scale(1); }
                        50% { transform: translate(-10px, -20px) scale(1.1); }
                        100% { transform: translate(0, 0) scale(1); }
                    }
                    @keyframes floatLeft {
                        0% { transform: translate(0, 0) rotate(0deg); }
                        50% { transform: translate(30px, 30px) rotate(10deg); }
                        100% { transform: translate(0, 0) rotate(0deg); }
                    }
                    @keyframes floatRight {
                        0% { transform: translate(0, 0) rotate(0deg); }
                        50% { transform: translate(-30px, 20px) rotate(-10deg); }
                        100% { transform: translate(0, 0) rotate(0deg); }
                    }

                    /* General Grid Styles */
                    .leaderboard-grid {
                        display: grid;
                        grid-template-columns: 80px minmax(200px, 1fr) 1fr 1fr 1fr;
                        align-items: center;
                        width: 100%;
                    }
                    .grid-header {
                        font-weight: 700;
                        font-size: 0.85rem;
                        color: #5f6368;
                        padding: 16px;
                        border-bottom: 2px solid #e0e0e0;
                        text-align: center;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .grid-header.name-col { text-align: left; padding-left: 24px; }
                    .grid-row-item {
                        font-weight: 500;
                        font-size: 0.95rem;
                        color: #3c4043;
                        padding: 14px 16px;
                        text-align: center;
                    }
                    .name-col {
                        text-align: left;
                        padding-left: 24px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .podium-row .grid-row-item { padding: 22px 16px; font-size: 1.1rem; }
                    .rank-1 { background-color: #FFF9E6; border-left: 4px solid #FFD700; }
                    .rank-2 { background-color: #F8F9FA; border-left: 4px solid #C0C0C0; }
                    .rank-3 { background-color: #FFF0E0; border-left: 4px solid #CD7F32; }
                    .leaderboard-row-container:hover { background-color: #F1F3F4; transition: 0.2s; }
                    .table-scroll-wrapper { overflow-x: auto; width: 100%; padding-bottom: 4px; }
                    .table-min-width { min-width: 900px; }
                `}
            </style>

            {/* --- HERO / HEADER SECTION --- */}
            <div style={{
                backgroundColor: '#0F172A', // Rich Dark Blue-Black (Better than pitch black)
                width: '100%',
                padding: `${gdgTheme.spacing.xxxl} 0`,
                borderBottom: `1px solid ${gdgTheme.colors.neutral.lightGray}`,
                position: 'relative',
                overflow: 'hidden',
                isolation: 'isolate'
            }}>

                {/* 1. VIBRANT LIQUID BACKGROUND (Centered & Bright) */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    zIndex: 0
                }}>
                    {/* CENTER GLOW (Yellow/Gold for Leaderboard Optimism) */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '600px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(251, 188, 4, 0.4) 0%, rgba(234, 67, 53, 0.1) 60%, transparent 100%)',
                        filter: 'blur(60px)',
                        animation: 'floatCenter 8s ease-in-out infinite',
                        zIndex: 1
                    }} />

                    {/* LEFT ACCENT (Google Blue - High Visibility) */}
                    <div style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '-10%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, #4285F4 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        opacity: 0.7,
                        animation: 'floatLeft 12s ease-in-out infinite',
                    }} />

                    {/* RIGHT ACCENT (Google Green - High Visibility) */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-20%',
                        right: '-10%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, #34A853 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        opacity: 0.6,
                        animation: 'floatRight 15s ease-in-out infinite',
                    }} />
                </div>

                {/* 2. FROSTED OVERLAY (Noise + Blur)
                   This binds the colors together so they don't look like separate blobs.
                */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    background: 'rgba(15, 23, 42, 0.3)', // Slight tint matching bg color
                    zIndex: 1,
                    pointerEvents: 'none'
                }} />

                {/* 3. CONTENT (Text) */}
                <div style={{
                    maxWidth: CONTAINER_MAX_WIDTH,
                    margin: '0 auto',
                    padding: `0 ${gdgTheme.spacing.xl}`,
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <GoogleBrandLines
                        variant="dynamic"
                        size="medium"
                        gap="8px"
                        style={{ justifyContent: 'center', marginBottom: gdgTheme.spacing.lg }}
                    />

                    <h1 style={{
                        ...gdgTheme.typography.styles.heroTitle,
                        color: '#ffffff',
                        marginBottom: gdgTheme.spacing.sm,
                        letterSpacing: '-0.02em',
                        position: 'relative'
                    }}>
                        <span style={{
                            // Crisp White text with a colored glow is more readable on bright backgrounds
                            color: '#ffffff',
                            textShadow: '0 0 30px rgba(66, 133, 244, 0.6), 0 0 10px rgba(0,0,0,0.5)',
                            display: 'inline-block',
                            paddingBottom: '10px'
                        }}>
                            Leaderboard
                        </span>
                    </h1>
                </div>
            </div>
            {/* --- END HERO --- */}

            <div style={{ width: '100%', padding: `${gdgTheme.spacing.xl} 0`, flex: 1 }}>
                <div style={{ maxWidth: CONTAINER_MAX_WIDTH, margin: '0 auto', padding: `0 ${gdgTheme.spacing.xl}` }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: gdgTheme.borderRadius.large,
                        boxShadow: '0 1px 3px 0 rgba(60,64,67,0.3)',
                        overflow: 'hidden'
                    }}>
                        <div className="table-scroll-wrapper">
                            <div className="table-min-width">
                                <div className="leaderboard-grid" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="grid-header">Rank</div>
                                    <div className="grid-header name-col">Participant</div>
                                    <div className="grid-header">Questions</div>
                                    <div className="grid-header">Score</div>
                                    <div className="grid-header">Streak</div>
                                </div>
                                {loading ? (
                                    <div style={{ padding: '60px', textAlign: 'center', color: '#5f6368' }}>Calculating Scores...</div>
                                ) : error ? (
                                    <div style={{ padding: '60px', textAlign: 'center', color: '#d93025' }}>{error}</div>
                                ) : (
                                    <div>
                                        {data.map((participant) => (
                                            <ParticipantRow
                                                key={participant.id}
                                                participant={participant}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const ParticipantRow = ({ participant }) => {
    const rank = participant.rank;
    const isPodium = rank <= 3;
    let rowClasses = "leaderboard-grid leaderboard-row-container";
    if (isPodium) rowClasses += ` podium-row rank-${rank}`;

    const renderRank = () => {
        if (rank === 1) return <span style={{ fontSize: '1.8rem' }}>🥇</span>;
        if (rank === 2) return <span style={{ fontSize: '1.8rem' }}>🥈</span>;
        if (rank === 3) return <span style={{ fontSize: '1.8rem' }}>🥉</span>;
        return <span style={{ color: '#5f6368', fontWeight: 'bold' }}>{rank}</span>;
    };

    return (
        <div className={rowClasses} style={{ borderBottom: '1px solid #f1f3f4' }}>
            <div className="grid-row-item">{renderRank()}</div>
            <div className="grid-row-item name-col">
                <span style={{ fontWeight: isPodium ? 700 : 500, color: '#202124' }}>
                    {participant.name}
                </span>
            </div>
            <div className="grid-row-item">{participant.questionsCompleted}</div>
            <div className="grid-row-item" style={{ color: gdgTheme.colors.primary.blue, fontWeight: 700 }}>
                {participant.totalPoints}
            </div>
            <div className="grid-row-item">
                {participant.streak > 0 ? (
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center',
                        backgroundColor: isPodium ? 'rgba(230, 81, 0, 0.1)' : '#fce8e6',
                        padding: '4px 12px', borderRadius: '16px',
                        color: '#c5221f', fontWeight: '700', fontSize: '0.85rem'
                    }}>
                        <span>🔥</span> {participant.streak}
                    </div>
                ) : <span style={{ color: '#bdc1c6' }}>-</span>}
            </div>
        </div>
    );
};

export default Leaderboard;