import React from 'react';

const GoogleOrbs = () => {
    return (
        <>
            <style>{`
                @keyframes blueOrbit {
                    0% {
                        transform: translate(0, 0) scale(1);
                    }
                    20% {
                        transform: translate(120px, -80px) scale(1.15);
                    }
                    40% {
                        transform: translate(180px, 0px) scale(1.1);
                    }
                    60% {
                        transform: translate(120px, 80px) scale(1.05);
                    }
                    80% {
                        transform: translate(-50px, 50px) scale(1.2);
                    }
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                }

                @keyframes redOrbit {
                    0% {
                        transform: translate(0, 0) scale(1);
                    }
                    20% {
                        transform: translate(-100px, 60px) scale(1.1);
                    }
                    40% {
                        transform: translate(-140px, -40px) scale(1.15);
                    }
                    60% {
                        transform: translate(60px, -100px) scale(1);
                    }
                    80% {
                        transform: translate(120px, 40px) scale(1.08);
                    }
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                }

                @keyframes yellowOrbit {
                    0% {
                        transform: translate(0, 0) scale(1);
                    }
                    20% {
                        transform: translate(100px, 100px) scale(0.95);
                    }
                    40% {
                        transform: translate(-80px, 120px) scale(1.12);
                    }
                    60% {
                        transform: translate(-130px, -60px) scale(1.05);
                    }
                    80% {
                        transform: translate(90px, -90px) scale(0.9);
                    }
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                }

                @keyframes greenOrbit {
                    0% {
                        transform: translate(0, 0) scale(1);
                    }
                    20% {
                        transform: translate(-110px, -70px) scale(1.08);
                    }
                    40% {
                        transform: translate(80px, -110px) scale(0.92);
                    }
                    60% {
                        transform: translate(140px, 60px) scale(1.1);
                    }
                    80% {
                        transform: translate(-70px, 100px) scale(1.05);
                    }
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                }

                .color-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                    mix-blend-mode: screen;
                }

                .orb-blue {
                    width: 450px;
                    height: 450px;
                    background: #4285F4;
                    top: -80px;
                    right: 8%;
                    animation: blueOrbit 28s;
                    opacity: 0.75;
                }

                .orb-red {
                    width: 400px;
                    height: 400px;
                    background: #EA4335;
                    top: 35%;
                    left: -30px;
                    animation: redOrbit 32s;
                    animation-delay: -8s;
                    opacity: 0.7;
                }

                .orb-yellow {
                    width: 380px;
                    height: 380px;
                    background: #FBBC04;
                    bottom: -60px;
                    right: 20%;
                    animation: yellowOrbit 30s;
                    animation-delay: -16s;
                    opacity: 0.7;
                }

                .orb-green {
                    width: 420px;
                    height: 420px;
                    background: #34A853;
                    bottom: 20%;
                    left: 10%;
                    animation: greenOrbit 26s;
                    animation-delay: -22s;
                    opacity: 0.75;
                }
            `}</style>

            <div style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0
            }}>
                <div className="color-orb orb-blue" />
                <div className="color-orb orb-red" />
                <div className="color-orb orb-yellow" />
                <div className="color-orb orb-green" />
            </div>
        </>
    );
};

export default GoogleOrbs;
