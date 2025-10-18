import React from 'react';

const GoogleBrandLines = ({
                              variant = 'dynamic',
                              size = 'medium',
                              gap = '8px',
                              animated = true,
                              alignment = 'flex-end',
                              style = {},
                              className = ''
                          }) => {
    // Google Brand Colors
    const colors = ['#4285f4', '#ea4335', '#f9ab00', '#34a853'];

    // Size configurations
    const sizeConfig = {
        small: { height: '2px', baseWidth: 30 },
        medium: { height: '4px', baseWidth: 50 },
        large: { height: '6px', baseWidth: 70 },
    };

    // Variant configurations
    const variants = {
        equal: [1, 1, 1, 1], // All same length
        dynamic: [1.4, 0.9, 1.7, 1.1], // Different lengths for visual interest
        progressive: [0.6, 0.8, 1.0, 1.2], // Increasing lengths
        data: [1.7, 1.44, 1.86, 1.34], // Data-inspired (85%, 72%, 93%, 67%)
        rhythmic: [1.0, 0.7, 1.3, 0.8], // Rhythmic pattern
        minimal: [0.8, 0.8, 0.8, 0.8] // Subtle equal
    };

    const currentSize = sizeConfig[size];
    const multipliers = variants[variant] || variants.dynamic;

    return (
        <div
            className={className}
            style={{
                display: 'flex',
                gap: gap,
                alignItems: alignment,
                ...style
            }}
        >
            {colors.map((color, index) => (
                <div
                    key={index}
                    style={{
                        width: `${currentSize.baseWidth * multipliers[index]}px`,
                        height: currentSize.height,
                        backgroundColor: color,
                        borderRadius: '2px',
                        ...(animated && {
                            animation: `brandLineSlide 0.8s ease-out ${index * 0.15}s both`,
                            transformOrigin: 'left'
                        })
                    }}
                />
            ))}

            {animated && (
                <style>
                    {`
            @keyframes brandLineSlide {
              0% { 
                transform: scaleX(0);
                opacity: 0;
              }
              100% { 
                transform: scaleX(1);
                opacity: 1;
              }
            }
          `}
                </style>
            )}
        </div>
    );
};

export default GoogleBrandLines;