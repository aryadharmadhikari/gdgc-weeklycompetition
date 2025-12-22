import React, { useState } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { gdgTheme } from '../../theme/gdgctheme';

const YearSelectionModal = () => {
    const { showYearModal, completeSignup } = useAuth();
    const [year, setYear] = useState('FE');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!showYearModal) return null;

    const handleSave = async () => {
        setIsSubmitting(true);
        await completeSignup(year);
        setIsSubmitting(false);
    };

    // Safety check
    if (!gdgTheme || !gdgTheme.colors) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 9999
        }}>
            <div style={{
                backgroundColor: gdgTheme.colors.background.primary,
                padding: gdgTheme.spacing.xl,
                borderRadius: gdgTheme.borderRadius.xl,
                width: '90%', maxWidth: '400px',
                textAlign: 'center',
                boxShadow: gdgTheme.shadows.large,
                fontFamily: gdgTheme.typography.primary.family
            }}>
                <h2 style={{
                    color: gdgTheme.colors.text.primary,
                    marginBottom: gdgTheme.spacing.md,
                    marginTop: 0,
                    // ✅ FIXED: Added .primary
                    fontWeight: gdgTheme.typography.primary.weights.bold
                }}>
                    Welcome to the Bootcamp! 🚀
                </h2>
                <p style={{
                    color: gdgTheme.colors.text.secondary,
                    marginBottom: gdgTheme.spacing.lg,
                    lineHeight: '1.5'
                }}>
                    We noticed this is your first time here.<br/>
                    <strong>Please select your current year.</strong>
                </p>

                <div style={{ marginBottom: gdgTheme.spacing.lg, textAlign: 'left' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: gdgTheme.spacing.sm,
                        // ✅ FIXED: Added .primary
                        fontWeight: gdgTheme.typography.primary.weights.bold,
                        color: gdgTheme.colors.text.primary
                    }}>
                        Year of Engineering
                    </label>
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: gdgTheme.borderRadius.medium,
                            border: `1px solid #ccc`,
                            fontSize: '1rem',
                            backgroundColor: gdgTheme.colors.background.secondary,
                            fontFamily: gdgTheme.typography.primary.family,
                            color: gdgTheme.colors.text.primary
                        }}
                    >
                        <option value="FE">FE (First Year)</option>
                        <option value="SE">SE (Second Year)</option>
                        <option value="TE">TE (Third Year)</option>
                        <option value="BE">BE (Fourth Year)</option>
                    </select>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    style={{
                        backgroundColor: gdgTheme.colors.primary.blue,
                        color: gdgTheme.colors.neutral.white,
                        border: 'none',
                        padding: '14px 24px',
                        borderRadius: gdgTheme.borderRadius.medium,
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        width: '100%',
                        transition: 'background 0.2s',
                        boxShadow: gdgTheme.shadows.button
                    }}
                >
                    {isSubmitting ? 'Saving Profile...' : 'Complete Registration'}
                </button>
            </div>
        </div>
    );
};

export default YearSelectionModal;