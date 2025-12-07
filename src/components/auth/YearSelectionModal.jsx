import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { gdgTheme } from '../../theme/gdgctheme';

const YearSelectionModal = () => {
    const { showYearModal, completeSignup } = useAuth();
    const [year, setYear] = useState('FE'); // Default to First Year
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If the context says the modal is hidden, return null (render nothing)
    if (!showYearModal) return null;

    const handleSave = async () => {
        setIsSubmitting(true);
        await completeSignup(year);
        setIsSubmitting(false);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', // Dark overlay
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 9999
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                width: '90%', maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
                <h2 style={{ color: '#333', marginBottom: '1rem', marginTop: 0 }}>
                    Welcome to the Bootcamp! 🚀
                </h2>
                <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                    We noticed this is your first time here.<br/>
                    <strong>Please select your current year.</strong>
                </p>

                <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>
                        Year of Engineering
                    </label>
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        style={{
                            width: '100%', padding: '12px',
                            borderRadius: '6px', border: '1px solid #ccc',
                            fontSize: '1rem', backgroundColor: '#f9f9f9'
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
                        backgroundColor: '#4285F4', color: 'white',
                        border: 'none', padding: '14px 24px',
                        borderRadius: '6px', fontSize: '1rem',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        width: '100%', fontWeight: '600',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#3367D6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#4285F4'}
                >
                    {isSubmitting ? 'Saving Profile...' : 'Complete Registration'}
                </button>
            </div>
        </div>
    );
};

export default YearSelectionModal;