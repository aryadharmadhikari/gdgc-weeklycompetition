import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.jsx";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { gdgTheme } from '../theme/gdgctheme';
import GoogleBrandLines from '../components/common/GoogleBrandLines';
import GoogleOrbs from '../components/common/GoogleOrbs';
// Removed unused import 'useAuth' to fix linting warning

const Leaderboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const buildDynamicLeaderboard = async () => {
            try {
                setLoading(true);

                // 1. FETCH ALL WEEKS
                const lbColRef = collection(db, "leaderboard");
                const lbSnapshot = await getDocs(lbColRef);

                // 2. AGGREGATE DATA
                const aggregator = {};
                let latestWeekNo = -1;

                lbSnapshot.forEach(doc => {
                    if (doc.id === 'global') return;

                    const weekData = doc.data().users || [];

                    // Scan for the highest week number
                    weekData.forEach(item => {
                        const wNo = Number(item.weekNo);
                        if (!isNaN(wNo) && wNo > latestWeekNo) {
                            latestWeekNo = wNo;
                        }
                    });

                    // PROCESS THIS WEEK'S DATA
                    weekData.forEach(submission => {
                        const email = submission.email;
                        if (!email) return;

                        // Initialize record if seeing this student for the first time
                        if (!aggregator[email]) {
                            aggregator[email] = {
                                // FIX: Added 'id' so React key={participant.id} works
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

                        // Parse Scores (Safety check for numbers)
                        const q1 = Number(submission.q1_score) || 0;
                        const q2 = Number(submission.q2_score) || 0;
                        const q3 = Number(submission.q3_score) || 0;
                        const total = Number(submission.total_score) || 0;
                        const weekNum = Number(submission.weekNo);

                        // Update Totals
                        aggregator[email].totalPoints += total;
                        aggregator[email].browniePoints += (q1 + q2);
                        aggregator[email].q3Score += q3;
                        if (!isNaN(weekNum)) {
                            aggregator[email].submittedWeeks.push(weekNum);
                        }

                        // Count Questions (> 0 score means attempted/solved)
                        if (q1 > 0) aggregator[email].questionsCompleted++;
                        if (q2 > 0) aggregator[email].questionsCompleted++;
                        if (q3 > 0) aggregator[email].questionsCompleted++;

                        // Update name if a newer one is found
                        if (submission.name) aggregator[email].name = submission.name;
                    });
                });

                // 3. CALCULATE STREAK & FINALIZE
                const processed = Object.values(aggregator).map(p => {
                    let streak = 0;
                    const weeksSet = new Set(p.submittedWeeks);

                    for (let i = latestWeekNo; i >= 0; i--) {
                        if (weeksSet.has(i)) {
                            streak++;
                        } else {
                            break;
                        }
                    }

                    return { ...p, streak };
                });

                // 4. SORTING LOGIC
                processed.sort((a, b) => {
                    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
                    if (b.browniePoints !== a.browniePoints) return b.browniePoints - a.browniePoints;
                    if (b.q3Score !== a.q3Score) return b.q3Score - a.q3Score;
                    if (b.questionsCompleted !== a.questionsCompleted) return b.questionsCompleted - a.questionsCompleted;
                    return b.streak - a.streak;
                });

                // 5. ASSIGN RANKS
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

        // FIX: Handle the promise returned by the async function
        buildDynamicLeaderboard().catch(err => console.error("Effect Error:", err));

    }, []);

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
                    /* GRID LAYOUT (5 Columns) */
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
                    
                    /* PODIUM */
                    .podium-row .grid-row-item {
                        padding: 22px 16px;
                        font-size: 1.1rem;
                    }
                    .rank-1 { background-color: #FFF9E6; border-left: 4px solid #FFD700; }
                    .rank-2 { background-color: #F8F9FA; border-left: 4px solid #C0C0C0; }
                    .rank-3 { background-color: #FFF0E0; border-left: 4px solid #CD7F32; }
                    .leaderboard-row-container:hover { background-color: #F1F3F4; transition: 0.2s; }

                    /* MOBILE */
                    .table-scroll-wrapper { overflow-x: auto; width: 100%; padding-bottom: 4px; }
                    .table-min-width { min-width: 900px; }
                `}
            </style>

            <div style={{
                backgroundColor: gdgTheme.colors.background.dark,
                width: '100%',
                padding: `${gdgTheme.spacing.xxl} 0`,
                borderBottom: `1px solid ${gdgTheme.colors.neutral.lightGray}`,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <GoogleOrbs />
                <div style={{
                    maxWidth: CONTAINER_MAX_WIDTH,
                    margin: '0 auto',
                    padding: `0 ${gdgTheme.spacing.xl}`,
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <GoogleBrandLines variant="dynamic" size="medium" gap="8px" style={{ justifyContent: 'center', marginBottom: gdgTheme.spacing.lg }} />
                    <h1 style={{ ...gdgTheme.typography.styles.heroTitle, color: gdgTheme.colors.primary.blue, marginBottom: gdgTheme.spacing.sm }}>
                        Leaderboard
                    </h1>
                </div>
            </div>

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
                                                // FIX: 'id' is now defined in the aggregator
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