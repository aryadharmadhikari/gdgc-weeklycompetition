import React from 'react';
import { Link } from 'react-router-dom';
import { gdgTheme } from '../../theme/gdgctheme';
import gdgLogo from '../../assets/images/light_gdgdbit_logo.jpg';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            backgroundColor: gdgTheme.colors.background.primary,
            color: gdgTheme.colors.text.primary,
            marginTop: 'auto'
        }}>
            {/* Google-Colored Separator with Smooth Blending */}
            <div style={{
                height: '4px',
                background: 'linear-gradient(to right, #4285F4 0%, #4285F4 25%, #EA4335 25%, #EA4335 50%, #FBBC04 50%, #FBBC04 75%, #34A853 75%, #34A853 100%)',
                width: '100%'
            }} />

            <div style={{
                padding: `${gdgTheme.spacing.xxxl} ${gdgTheme.spacing.xl} ${gdgTheme.spacing.xl}`,
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Main Footer Content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: gdgTheme.spacing.xl,
                    marginBottom: gdgTheme.spacing.xxxl
                }}>
                    {/* About Section */}
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: gdgTheme.spacing.sm,
                            marginBottom: gdgTheme.spacing.lg
                        }}>
                            <img
                                src={gdgLogo}
                                alt="GDG Logo"
                                style={{
                                    height: '60px',
                                    width: 'auto'
                                }}
                            />
                        </div>
                        <p style={{
                            ...gdgTheme.typography.styles.paragraph,
                            color: gdgTheme.colors.text.secondary,
                            marginBottom: gdgTheme.spacing.md
                        }}>
                            Empowering developers, fostering innovation.
                        </p>
                    </div>

                    {/* Connect With Us Section */}
                    <div>
                        <h3 style={{
                            ...gdgTheme.typography.styles.subtitle,
                            alignItems: 'center',
                            fontSize: '1.1rem',
                            marginBottom: gdgTheme.spacing.lg,
                            color: gdgTheme.colors.text.primary
                        }}>
                            Connect With Us
                        </h3>

                        {/* Social Media Icons */}
                        <div style={{
                            display: 'flex',
                            gap: gdgTheme.spacing.md
                        }}>
                            {/* LinkedIn Icon */}
                            <a
                                href="https://linkedin.com/company/gdgc-dbit"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: gdgTheme.colors.background.secondary,
                                    border: `1px solid ${gdgTheme.colors.neutral.lightGray}`,
                                    borderRadius: gdgTheme.borderRadius.medium,
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#0077B5';
                                    e.currentTarget.style.borderColor = '#0077B5';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    const svg = e.currentTarget.querySelector('svg');
                                    if (svg) svg.style.fill = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = gdgTheme.colors.background.secondary;
                                    e.currentTarget.style.borderColor = gdgTheme.colors.neutral.lightGray;
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    const svg = e.currentTarget.querySelector('svg');
                                    if (svg) svg.style.fill = gdgTheme.colors.text.primary;
                                }}
                                aria-label="LinkedIn"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill={gdgTheme.colors.text.primary}
                                    style={{ transition: 'fill 0.2s ease' }}
                                >
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                            </a>

                            {/* YouTube Icon */}
                            <a
                                href="https://youtube.com/@gdgcdbit"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: gdgTheme.colors.background.secondary,
                                    border: `1px solid ${gdgTheme.colors.neutral.lightGray}`,
                                    borderRadius: gdgTheme.borderRadius.medium,
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FF0000';
                                    e.currentTarget.style.borderColor = '#FF0000';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    const svg = e.currentTarget.querySelector('svg');
                                    if (svg) svg.style.fill = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = gdgTheme.colors.background.secondary;
                                    e.currentTarget.style.borderColor = gdgTheme.colors.neutral.lightGray;
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    const svg = e.currentTarget.querySelector('svg');
                                    if (svg) svg.style.fill = gdgTheme.colors.text.primary;
                                }}
                                aria-label="YouTube"
                            >
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill={gdgTheme.colors.text.primary}
                                    style={{ transition: 'fill 0.2s ease' }}
                                >
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                </svg>
                            </a>

                            {/* Instagram Icon with Gradient on Hover */}
                            <a
                                href="https://instagram.com/gdgcdbit"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: gdgTheme.colors.background.secondary,
                                    border: `1px solid ${gdgTheme.colors.neutral.lightGray}`,
                                    borderRadius: gdgTheme.borderRadius.medium,
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'radial-gradient(circle at 30% 110%, #ffdb8b 0%, #ee653d 25%, #d42e81 50%, #a237b6 75%, #3e57bc 100%)';
                                    e.currentTarget.style.borderColor = '#d42e81';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(238, 42, 123, 0.4)';
                                    const svg = e.currentTarget.querySelector('svg');
                                    if (svg) svg.style.fill = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = gdgTheme.colors.background.secondary;
                                    e.currentTarget.style.borderColor = gdgTheme.colors.neutral.lightGray;
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    const svg = e.currentTarget.querySelector('svg');
                                    if (svg) svg.style.fill = gdgTheme.colors.text.primary;
                                }}
                                aria-label="Instagram"
                            >
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill={gdgTheme.colors.text.primary}
                                    style={{ transition: 'fill 0.2s ease', position: 'relative', zIndex: 1 }}
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Join Community Section */}
                    <div>
                        <h3 style={{
                            ...gdgTheme.typography.styles.subtitle,
                            fontSize: '1.1rem',
                            marginBottom: gdgTheme.spacing.lg,
                            color: gdgTheme.colors.text.primary
                        }}>
                            Join Our Community
                        </h3>
                        <p style={{
                            color: gdgTheme.colors.text.secondary,
                            fontSize: '0.9rem',
                            marginBottom: gdgTheme.spacing.lg
                        }}>
                            Connect with fellow developers, attend workshops, and grow your skills.
                        </p>
                        <a
                            href="https://gdg.community.dev/gdg-on-campus-don-bosco-institute-of-technology-mumbai-india/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                backgroundColor: gdgTheme.colors.primary.blue,
                                color: gdgTheme.colors.text.inverse,
                                border: 'none',
                                padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.lg}`,
                                borderRadius: gdgTheme.borderRadius.medium,
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: gdgTheme.spacing.sm,
                                transition: 'background-color 0.2s ease',
                                boxShadow: '0 2px 8px rgba(66, 133, 244, 0.2)',
                                textDecoration: 'none',
                                width: 'fit-content'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = gdgTheme.colors.primary.darkBlue;
                                e.target.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = gdgTheme.colors.primary.blue;
                                e.target.style.boxShadow = '0 2px 8px rgba(66, 133, 244, 0.2)';
                            }}
                        >
                            Join Community
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: `1px solid ${gdgTheme.colors.neutral.lightGray}`,
                    paddingTop: gdgTheme.spacing.lg,
                    textAlign: 'center'
                }}>
                    <p style={{
                        color: gdgTheme.colors.text.secondary,
                        fontSize: '0.85rem',
                        margin: 0
                    }}>
                        © {currentYear} Google Developer Group On Campus Don Bosco Institute of Technology. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
