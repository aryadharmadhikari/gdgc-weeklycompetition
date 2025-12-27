import React from 'react';
import { 
    FaCalendarCheck, 
    FaLayerGroup, 
    FaExclamationTriangle, 
    FaQuestionCircle,
    FaPenFancy,
    FaCheckCircle 
} from 'react-icons/fa';

// Google Brand Palette
const colors = {
    blue: '#4285F4',
    red: '#EA4335',
    yellow: '#FBBC04',
    green: '#34A853',
    dark: '#202124',
    gray: '#5f6368',
    lightGray: '#f1f3f4',
    white: '#ffffff',
    bg: '#F0F2F5'
};

const Rulebook = () => {
    return (
        <div className="rb-wrapper">
            {/* 🛡️ RESPONSIVE CSS ENGINE */}
            <style>
                {`
                    /* --- BASE LAYOUT --- */
                    .rb-wrapper {
                        background-color: ${colors.bg};
                        padding: 40px 20px;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        min-height: 100vh;
                        box-sizing: border-box;
                    }
                    .rb-container {
                        max-width: 900px;
                        width: 100%;
                        background-color: ${colors.white};
                        border-radius: 24px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.06);
                        overflow: hidden;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                    }
                    .rb-header {
                        padding: 50px 40px 30px 40px;
                        border-bottom: 1px solid ${colors.lightGray};
                    }
                    .rb-title {
                        font-size: 3rem;
                        font-weight: 800;
                        color: ${colors.dark};
                        margin: 0 0 10px 0;
                        letter-spacing: -1px;
                        line-height: 1.1;
                    }
                    .rb-subtitle {
                        font-size: 1.1rem;
                        color: ${colors.gray};
                        font-weight: 400;
                        margin: 0;
                        max-width: 600px;
                        line-height: 1.5;
                    }
                    .rb-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 24px;
                        padding: 40px;
                    }
                    .rb-card {
                        padding: 28px;
                        border-radius: 16px;
                        background-color: ${colors.white};
                        border: 1px solid ${colors.lightGray};
                        box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                        position: relative;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    /* --- SCORING BLUEPRINT --- */
                    .rb-scoring-card {
                        grid-column: 1 / -1;
                        position: relative;
                        padding: 32px;
                        border-radius: 16px;
                        background-color: ${colors.white};
                        border: 2px solid ${colors.lightGray};
                        overflow: hidden;
                    }

                    .rb-score-grid {
                        display: flex;
                        gap: 20px;
                        position: relative;
                        z-index: 2;
                        width: 100%;
                    }

                    .rb-score-box {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        background-color: #fff;
                        border: 1px solid ${colors.lightGray};
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
                        min-width: 0; 
                    }

                    .rb-score-box-featured {
                        flex: 2;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        background-color: #fffcf0;
                        border: 2px solid ${colors.yellow};
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(251, 188, 4, 0.15);
                        text-align: center;
                        min-width: 0;
                    }

                    /* --- WATERMARK ENGINE --- */
                    .rb-watermark {
                        position: absolute;
                        top: -15px;
                        right: -10px;
                        font-size: 8rem;
                        font-weight: 900;
                        color: #f8f9fa; 
                        z-index: 0;
                        pointer-events: none;
                        line-height: 1;
                        font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    }

                    .rb-content-layer {
                        position: relative;
                        z-index: 1;
                        display: flex;
                        flex-direction: column;
                        height: 100%; /* Ensure full height for layout */
                    }

                    /* --- STRATEGY LIST --- */
                    .rb-list {
                        margin: 15px 0 0 0;
                        padding: 0;
                        list-style: none;
                    }
                    .rb-list-item {
                        display: flex;
                        align-items: flex-start;
                        margin-bottom: 12px;
                        font-size: 0.95rem;
                        color: ${colors.gray};
                        line-height: 1.5;
                    }
                    .rb-list-icon {
                        color: ${colors.green};
                        margin-right: 10px;
                        margin-top: 4px;
                        flex-shrink: 0;
                    }

                    /* --- FOOTER Q&A --- */
                    .rb-footer-note {
                        grid-column: 1 / -1;
                        text-align: center;
                        color: ${colors.gray};
                        font-size: 0.95rem;
                        padding-top: 20px;
                        border-top: 1px solid ${colors.lightGray};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        line-height: 1.5;
                    }

                    /* --- MOBILE OPTIMIZATIONS (< 768px) --- */
                    @media (max-width: 768px) {
                        .rb-wrapper { 
                            padding: 24px 16px; 
                            background-color: ${colors.bg}; 
                        }
                        .rb-container { 
                            border-radius: 16px; 
                            box-shadow: 0 10px 30px rgba(0,0,0,0.08); 
                        }
                        
                        .rb-header { 
                            padding: 30px 20px; 
                        }
                        .rb-title { 
                            font-size: 2.2rem; 
                        }
                        .rb-subtitle {
                            font-size: 1rem;
                        }
                        .rb-grid { 
                            display: flex; 
                            flex-direction: column; 
                            padding: 0 20px 40px 20px; 
                            gap: 20px; 
                        }
                        
                        .rb-card, .rb-scoring-card {
                            padding: 24px 20px;
                        }

                        .rb-score-grid {
                            flex-direction: column;
                            width: 100%;
                        }
                        .rb-score-box, .rb-score-box-featured {
                            width: 100%;
                            flex: none; 
                            box-sizing: border-box;
                        }
                        
                        .rb-watermark {
                            font-size: 6rem;
                            top: -10px;
                            right: -5px;
                            opacity: 0.6; 
                        }

                        .rb-footer-note {
                            flex-direction: row; 
                            text-align: left;
                            align-items: flex-start;
                            padding: 20px 10px;
                        }
                    }
                `}
            </style>

            {/* Top Brand Stripe */}
            <div style={styles.brandStripe}></div>

            <div className="rb-container">
                {/* HEADER */}
                <header className="rb-header">
                    <div style={styles.headerMeta}>OFFICIAL COMPETITION PROTOCOLS • 2025-26</div>
                    <h1 className="rb-title">
                        The Rulebook<span style={{color: colors.blue}}>.</span>
                    </h1>
                    <p className="rb-subtitle">
                        Master the guidelines. Optimize your strategy. Win the code.
                    </p>
                </header>

                <div className="rb-grid">
                    
                    {/* --- CARD 1: THE TIMELINE --- */}
                    <div className="rb-card">
                        <div className="rb-watermark">07</div>

                        <div className="rb-content-layer">
                            {/* NEW: Sequence Tag */}
                            <span style={{...styles.sequenceTag, color: colors.blue}}>Step 01</span>

                            <div style={styles.cardHeaderRow}>
                                <h3 style={styles.cardTitle}>
                                    <FaCalendarCheck style={{...styles.icon, color: colors.dark}} /> 
                                    The Schedule
                                </h3>
                                <span style={styles.badge}>Weekly Cycle</span>
                            </div>
                            
                            <div style={styles.timelineWrapper}>
                                <div style={styles.timelineTrack}>
                                    <div style={styles.timelineProgress}></div>
                                </div>
                                <div style={styles.timelinePointLeft}>
                                    <div style={styles.dotGreen}></div>
                                    <div style={styles.pointContent}>
                                        <strong style={styles.dayText}>SUNDAY</strong>
                                        <span style={styles.actionText}>Questions Live</span>
                                    </div>
                                </div>
                                <div style={styles.timelinePointRight}>
                                    <div style={styles.dotRed}></div>
                                    <div style={{...styles.pointContent, alignItems: 'flex-end'}}>
                                        <strong style={styles.dayText}>SATURDAY</strong>
                                        <span style={styles.actionText}>Submission Close</span>
                                    </div>
                                </div>
                            </div>
                            <p style={styles.noteText}>
                                The submission window is open strictly for these 7 days.
                            </p>
                        </div>
                    </div>

                    {/* --- CARD 2: STRUCTURED STRATEGY --- */}
                    <div className="rb-card">
                        <div className="rb-watermark">03</div>

                        <div className="rb-content-layer">
                            {/* NEW: Sequence Tag */}
                            <span style={{...styles.sequenceTag, color: colors.green}}>Step 02</span>

                            <h3 style={styles.cardTitle}>
                                <FaLayerGroup style={{...styles.icon, color: colors.dark}} /> 
                                Structure Strategy
                            </h3>
                            <p style={styles.bodyText}>
                                The challenge is designed as a ladder. Follow this sequence for maximum efficiency:
                            </p>
                            
                            <ul className="rb-list">
                                <li className="rb-list-item">
                                    <FaCheckCircle className="rb-list-icon" />
                                    <span>
                                        <strong>Start with Basics:</strong> Questions 1 & 2 are strictly prerequisites.
                                    </span>
                                </li>
                                <li className="rb-list-item">
                                    <FaCheckCircle className="rb-list-icon" />
                                    <span>
                                        <strong>Build Logic:</strong> Solving the first two unlocks the pattern for the final problem.
                                    </span>
                                </li>
                                <li className="rb-list-item">
                                    <FaCheckCircle className="rb-list-icon" />
                                    <span>
                                        <strong>Question 3:</strong> Attempt this only after verifying the previous outputs.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* --- CARD 3: SCORING BLUEPRINT --- */}
                    <div className="rb-scoring-card">
                        <div className="rb-watermark">10</div>
                        
                        <div className="rb-content-layer">
                            {/* NEW: Sequence Tag */}
                            <span style={{...styles.sequenceTag, color: colors.yellow}}>Step 03</span>

                            <h3 style={styles.cardTitle}>
                                Scoring Blueprint
                            </h3>
                            <p style={{...styles.bodyText, marginBottom: '24px'}}>
                                Total: <strong>10 Marks</strong> per week. Breakdown below:
                            </p>

                            <div className="rb-score-grid">
                                <div className="rb-score-box">
                                    <span style={styles.scoreCircle}>1</span>
                                    <span style={styles.scoreLabel}>Question 1</span>
                                </div>
                                <div className="rb-score-box">
                                    <span style={styles.scoreCircle}>1</span>
                                    <span style={styles.scoreLabel}>Question 2</span>
                                </div>
                                <div className="rb-score-box-featured">
                                    <div style={styles.featuredHeader}>
                                        <span style={styles.scoreCircleGold}>8</span>
                                        <span style={styles.scoreLabelFeatured}>Question 3</span>
                                    </div>
                                    <div style={styles.mandatoryBlock}>
                                        <FaPenFancy style={{fontSize:'0.8rem', marginRight:'6px'}}/>
                                        Explanation Mandatory
                                    </div>
                                    <p style={styles.scoreFinePrint}>
                                        Full marks require detailed logic explanation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CARD 4: PLAGIARISM (No Step, Alert Only) --- */}
                    <div style={styles.alertCard}>
                        <div style={styles.alertHeader}>
                            <FaExclamationTriangle style={styles.alertIcon} />
                            <span style={styles.alertTitle}>Zero Tolerance Policy</span>
                        </div>
                        <p style={styles.alertText}>
                            <strong>Plagiarism will lead to mark deduction.</strong><br/>
                            Repeated offenses result in immediate disqualification.
                        </p>
                    </div>

                    {/* --- FOOTER --- */}
                    <div className="rb-footer-note">
                        <FaQuestionCircle style={styles.footerIcon} />
                        <span>
                            Need help? You can ask doubts in the <strong>Q&A section</strong> provided below each question.
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Inline styles for elements where media queries aren't critical
const styles = {
    brandStripe: {
        height: '6px',
        width: '100%',
        background: `linear-gradient(90deg, ${colors.blue} 25%, ${colors.red} 25%, ${colors.red} 50%, ${colors.yellow} 50%, ${colors.yellow} 75%, ${colors.green} 75%)`,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
    },
    headerMeta: {
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '1.5px',
        color: colors.gray,
        textTransform: 'uppercase',
        marginBottom: '12px'
    },
    // NEW: Sequence Tag Style
    sequenceTag: {
        display: 'inline-block',
        fontSize: '0.75rem',
        fontWeight: '900',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        marginBottom: '8px',
        opacity: 0.9
    },
    cardHeaderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
    },
    cardTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: colors.dark,
        margin: '0 0 10px 0',
        display: 'flex',
        alignItems: 'center',
        letterSpacing: '0.3px'
    },
    icon: {
        marginRight: '10px',
        fontSize: '1.3rem',
        flexShrink: 0
    },
    badge: {
        fontSize: '0.7rem',
        fontWeight: '700',
        backgroundColor: colors.lightGray,
        padding: '4px 8px',
        borderRadius: '4px',
        color: colors.gray,
        textTransform: 'uppercase'
    },
    bodyText: {
        fontSize: '1rem',
        color: colors.gray,
        lineHeight: '1.6',
        margin: 0
    },
    
    // TIMELINE ELEMENTS
    timelineWrapper: {
        position: 'relative',
        marginTop: '30px',
        marginBottom: '20px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    timelineTrack: {
        position: 'absolute',
        top: '12px',
        left: '10px',
        right: '10px',
        height: '4px',
        backgroundColor: colors.lightGray,
        zIndex: 0,
        borderRadius: '2px'
    },
    timelineProgress: {
        width: '100%',
        height: '100%',
        background: `linear-gradient(90deg, ${colors.green} 0%, ${colors.blue} 50%, ${colors.red} 100%)`,
        borderRadius: '2px',
        opacity: 0.3
    },
    timelinePointLeft: {
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    timelinePointRight: {
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    dotGreen: {
        width: '16px',
        height: '16px',
        backgroundColor: colors.green,
        borderRadius: '50%',
        border: `3px solid ${colors.white}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    dotRed: {
        width: '16px',
        height: '16px',
        backgroundColor: colors.red,
        borderRadius: '50%',
        border: `3px solid ${colors.white}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    pointContent: {
        marginTop: '12px',
        display: 'flex',
        flexDirection: 'column'
    },
    dayText: {
        fontSize: '0.9rem',
        fontWeight: '800',
        color: colors.dark,
        letterSpacing: '0.5px'
    },
    actionText: {
        fontSize: '0.75rem',
        color: colors.gray,
        marginTop: '2px'
    },
    noteText: {
        fontSize: '0.85rem',
        color: colors.gray,
        fontStyle: 'italic',
        marginTop: '10px'
    },

    // SCORING INTERNALS
    scoreCircle: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: colors.lightGray,
        color: colors.dark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: '700',
        marginBottom: '10px'
    },
    scoreLabel: {
        fontSize: '0.9rem',
        color: colors.gray,
        fontWeight: '600'
    },
    featuredHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px'
    },
    scoreCircleGold: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: colors.yellow,
        color: colors.dark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: '800'
    },
    scoreLabelFeatured: {
        fontSize: '1.2rem',
        fontWeight: '800',
        color: colors.dark
    },
    mandatoryBlock: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(234, 67, 53, 0.1)',
        color: '#c5221f',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: '8px',
        whiteSpace: 'nowrap'
    },
    scoreFinePrint: {
        fontSize: '0.85rem',
        color: colors.gray,
        margin: 0,
        lineHeight: '1.4'
    },

    // ALERTS & FOOTER
    alertCard: {
        gridColumn: '1 / -1',
        backgroundColor: '#fce8e6',
        borderRadius: '12px',
        padding: '24px',
        borderLeft: `4px solid ${colors.red}`,
        display: 'flex',
        flexDirection: 'column'
    },
    alertHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px'
    },
    alertIcon: { color: colors.red, fontSize: '1.2rem', marginRight: '10px', flexShrink: 0 },
    alertTitle: { color: '#c5221f', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem' },
    alertText: { color: '#850e0e', margin: 0, fontSize: '1rem', lineHeight: '1.5' },
    
    footerIcon: {
        marginRight: '12px',
        color: colors.blue,
        fontSize: '1.2rem',
        flexShrink: 0, 
        minWidth: '20px'
    }
};

export default Rulebook;