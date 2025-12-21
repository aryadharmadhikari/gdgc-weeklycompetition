// Complete GDG Theme Configuration
export const gdgTheme = {
    // Typography System - Following GDG Guidelines
    typography: {
        // Font families
        primary: {
            family: '"Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            weights: {
                regular: 400,
                medium: 500,
                bold: 700
            }
        },

        secondary: {
            family: '"Google Sans Mono", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            weights: {
                regular: 400,
                medium: 500,
                bold: 700
            }
        },

        // Predefined styles following GDG guidelines
        styles: {
            // Hero title - Google Sans Bold for impact
            heroTitle: {
                fontFamily: '"Google Sans", sans-serif',
                fontWeight: 700,
                fontSize: '3rem',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
            },

            // Section titles - Medium weight to avoid heaviness
            sectionTitle: {
                fontFamily: '"Google Sans", sans-serif',
                fontWeight: 500,
                fontSize: '2rem',
                lineHeight: '1.3'
            },

            // Subtitles - Regular weight
            subtitle: {
                fontFamily: '"Google Sans", sans-serif',
                fontWeight: 400,
                fontSize: '1.5rem',
                lineHeight: '1.4'
            },

            // Paragraphs - Always regular for readability
            paragraph: {
                fontFamily: '"Google Sans", sans-serif',
                fontWeight: 400,
                fontSize: '1rem',
                lineHeight: '1.6'
            },

            // Large paragraphs - Regular but bigger
            largeParagraph: {
                fontFamily: '"Google Sans", sans-serif',
                fontWeight: 400,
                fontSize: '1.2rem',
                lineHeight: '1.6'
            },

            // Code-style elements - Google Sans Mono
            codeStyle: {
                fontFamily: '"Google Sans Mono", monospace',
                fontWeight: 400,
                fontSize: '0.9rem',
                lineHeight: '1.4'
            },

            // Labels and talent names - Google Sans Mono
            label: {
                fontFamily: '"Google Sans Mono", monospace',
                fontWeight: 500,
                fontSize: '0.8rem',
                lineHeight: '1.3',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            },

            // Metadata and small additional data - Google Sans Mono
            metadata: {
                fontFamily: '"Google Sans Mono", monospace',
                fontWeight: 400,
                fontSize: '0.75rem',
                lineHeight: '1.4'
            },

            // Navigation links
            navLink: {
                fontFamily: '"Google Sans", sans-serif',
                fontWeight: 400,
                fontSize: '1rem',
                lineHeight: '1.5'
            },

            // Button text
            button: {
                fontFamily: '"Google Sans", sans-serif',
                fontWeight: 500,
                fontSize: '1rem',
                lineHeight: '1.5'
            }
        }
    },

    // Color Palette - Official GDG Colors
    colors: {
        // Primary Google Colors
        primary: {
            blue: '#4285f4',      // Google Blue
            lightBlue: '#8ab4f8',
            darkBlue: '#1565c0'
        },

        secondary: {
            green: '#34a853',     // Google Green
            lightGreen: '#81c784',
            darkGreen: '#2e7d32'
        },

        accent: {
            yellow: '#f9ab00',    // Google Yellow
            red: '#ea4335'        // Google Red
        },

        // Neutral Colors
        neutral: {
            white: '#ffffff',
            lightGray: '#f8f9fa',
            gray: '#5f6368',
            darkGray: '#202124',
            black: '#1a1a1a'
        },

        // Background Colors
        background: {
            primary: '#ffffff',
            secondary: '#f8f9fa',
            dark: '#1a1a1a'
        },

        // Text Colors
        text: {
            primary: '#202124',
            secondary: '#5f6368',
            inverse: '#ffffff',
            muted: '#888888'
        }
    },

    // Spacing System
    spacing: {
        xs: '0.25rem',    // 4px
        sm: '0.5rem',     // 8px
        md: '1rem',       // 16px
        lg: '1.5rem',     // 24px
        xl: '2rem',       // 32px
        xxl: '3rem',      // 48px
        xxxl: '4rem'      // 64px
    },

    // Border Radius
    borderRadius: {
        small: '4px',
        medium: '6px',
        large: '8px',
        xl: '12px'
    },

    // Shadows
    shadows: {
        small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        medium: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        large: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        button: '0 2px 8px rgba(66, 133, 244, 0.3)',
        buttonHover: '0 4px 12px rgba(66, 133, 244, 0.4)'
    },

    // Breakpoints for responsive design
    breakpoints: {
        mobile: '480px',
        tablet: '768px',
        desktop: '1024px',
        large: '1200px'
    }
};

// Font loader function (replaces index.html approach)
export const loadGoogleFonts = () => {
    // Create link elements for Google Fonts
    const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap',
        'https://fonts.googleapis.com/css2?family=Google+Sans+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap'
    ];

    fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    });
};

// Helper functions for common styles
export const getTypographyStyle = (variant) => {
    return gdgTheme.typography.styles[variant] || gdgTheme.typography.styles.paragraph;
};

export const getColor = (category, variant = 'main') => {
    const colorCategory = gdgTheme.colors[category];
    if (!colorCategory) return gdgTheme.colors.text.primary;

    return colorCategory[variant] || colorCategory;
};

// Component style generators
export const createButtonStyle = (variant = 'primary', size = 'medium') => {
    const baseStyle = {
        ...gdgTheme.typography.styles.button,
        border: 'none',
        borderRadius: gdgTheme.borderRadius.medium,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        outline: 'none'
    };

    const variants = {
        primary: {
            backgroundColor: gdgTheme.colors.primary.blue,
            color: gdgTheme.colors.neutral.white,
            boxShadow: gdgTheme.shadows.button,
            '&:hover': {
                backgroundColor: gdgTheme.colors.primary.darkBlue,
                boxShadow: gdgTheme.shadows.buttonHover
            }
        },
        secondary: {
            backgroundColor: 'transparent',
            color: gdgTheme.colors.primary.blue,
            border: `2px solid ${gdgTheme.colors.primary.blue}`,
            '&:hover': {
                backgroundColor: gdgTheme.colors.primary.blue,
                color: gdgTheme.colors.neutral.white
            }
        }
    };

    const sizes = {
        small: { padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}`, fontSize: '0.9rem' },
        medium: { padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.xl}`, fontSize: '1rem' },
        large: { padding: `${gdgTheme.spacing.lg} ${gdgTheme.spacing.xxl}`, fontSize: '1.1rem' }
    };

    return {
        ...baseStyle,
        ...variants[variant],
        ...sizes[size]
    };
};