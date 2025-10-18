import React from 'react';
import { gdgTheme } from '../../theme/gdgctheme';
import GoogleBrandLines from './GoogleBrandLines';

const Hero = () => {
    return (
        <section style={{
            backgroundColor: gdgTheme.colors.background.dark,
            color: gdgTheme.colors.text.inverse,
            padding: `${gdgTheme.spacing.xxxl} ${gdgTheme.spacing.xl}`,
            textAlign: 'left'
        }}>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ maxWidth: '1600px' }}>
                    {/* Main title - Google Sans Bold for impact */}
                    <GoogleBrandLines
                        size="medium"
                        gap="8px"
                        style={{ marginBottom: gdgTheme.spacing.lg }}
                    />
                    <h1 style={{
                        ...gdgTheme.typography.styles.heroTitle,
                        marginBottom: gdgTheme.spacing.md,
                        color: gdgTheme.colors.text.inverse
                    }}>
                        Welcome to the<br />
                        Google Developer Group<br />
                        <div style={{maxWidth: '1200px', margin: '0 auto', color: "#4285f4"}}>Don Bosco Institute of Technology</div>
                    </h1>

                    {/* Description - Google Sans Regular for paragraphs */}
                    <p style={{
                        ...gdgTheme.typography.styles.largeParagraph,
                        color: '#cccccc',
                        marginBottom: gdgTheme.spacing.xl
                    }}>
                        A place where you can connect with developers, learn new technologies, and grow together DBIT's vibrant tech community.
                    </p>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: gdgTheme.spacing.md, flexWrap: 'wrap' }}>
                        {/* Primary CTA */}
                        <button style={{
                            backgroundColor: gdgTheme.colors.primary.blue,
                            color: gdgTheme.colors.text.inverse,
                            border: 'none',
                            padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.xl}`,
                            borderRadius: gdgTheme.borderRadius.medium,
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            ...gdgTheme.typography.styles.button
                        }}>
                            Sign in with DBIT Gmail
                        </button>

                        {/* Secondary CTA */}
                        <button style={{
                            backgroundColor: 'transparent',
                            color: gdgTheme.colors.text.inverse,
                            border: `2px solid ${gdgTheme.colors.primary.blue}`,
                            padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.xl}`,
                            borderRadius: gdgTheme.borderRadius.medium,
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            ...gdgTheme.typography.styles.button
                        }}>
                            Learn More
                        </button>
                    </div>

                    {/* Small additional info - Google Sans Mono */}
                    <p style={{
                        ...gdgTheme.typography.styles.metadata,
                        color: gdgTheme.colors.text.muted,
                        marginTop: gdgTheme.spacing.md
                    }}>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Hero;
