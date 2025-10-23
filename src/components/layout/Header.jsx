// import React from 'react';
// import { Link } from 'react-router-dom'; // Import Link for routing
// import { gdgTheme } from '../../theme/gdgctheme';
// import gdgLogo from '../../assets/images/light_gdgdbit_logo.jpg'; // Direct import

// const Header = () => {
//     return (
//         <header style={{
//             backgroundColor: gdgTheme.colors.background.white,
//             color: gdgTheme.colors.text.primary,
//             padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.xl}`,
//             position: 'static',
//             top: 0,
//             zIndex: 1000,
//             boxShadow: gdgTheme.shadows.small
//         }}>
//             <div style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 maxWidth: '1200px',
//                 margin: '0 auto'
//             }}>
//                 {/* Logo links to the homepage */}
//                 <Link to="/" style={{ textDecoration: 'none' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: gdgTheme.spacing.md }}>
//                         <img
//                             src={gdgLogo}
//                             alt="GDG Logo"
//                             style={{
//                                 height: '80px',
//                                 width: 'auto',
//                                 objectFit: 'contain'
//                             }}
//                         />
//                     </div>
//                 </Link>

//                 {/* Navigation */}
//                 <nav style={{ display: 'flex', gap: gdgTheme.spacing.lg, alignItems: 'center' }}>
//                     {['Home', 'Events', 'Leaderboard'].map((item) => {
//                         // Use Link for 'Home', and standard 'a' tags for on-page links
//                         if (item === 'Home') {
//                             return (
//                                 <Link
//                                     key={item}
//                                     to="/"
//                                     style={{
//                                         color: gdgTheme.colors.text.primary,
//                                         textDecoration: 'none',
//                                         ...gdgTheme.typography.styles.navLink,
//                                         padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}`,
//                                         borderRadius: gdgTheme.borderRadius.medium
//                                     }}
//                                 >
//                                     {item}
//                                 </Link>
//                             );
//                         }
//                         return (
//                             <a
//                                 key={item}
//                                 href={`#${item.toLowerCase()}`}
//                                 style={{
//                                     color: gdgTheme.colors.text.primary,
//                                     textDecoration: 'none',
//                                     ...gdgTheme.typography.styles.navLink,
//                                     padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}`,
//                                     borderRadius: gdgTheme.borderRadius.medium
//                                 }}
//                             >
//                                 {item}
//                             </a>
//                         );
//                     })}

//                     {/* Converted the button to a Link for routing */}
//                     <Link
//                         to="/explanations"
//                         style={{
//                             color: gdgTheme.colors.text.primary,
//                                     textDecoration: 'none',
//                                     ...gdgTheme.typography.styles.navLink,
//                                     padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}`,
//                                     borderRadius: gdgTheme.borderRadius.medium
//                         }}
//                     >
//                         Explanations
//                     </Link>
//                     <Link
//                         to="/live-quiz"
//                         style={{
//                             backgroundColor: gdgTheme.colors.primary.blue,
//                             color: gdgTheme.colors.text.inverse,
//                             border: 'none',
//                             ...gdgTheme.typography.styles.button,
//                             padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.lg}`,
//                             borderRadius: gdgTheme.borderRadius.medium,
//                             cursor: 'pointer',
//                             boxShadow: gdgTheme.shadows.button,
//                             textDecoration: 'none' // Ensures it doesn't look like a hyperlink
//                         }}
//                     >
//                         Live Quiz
//                     </Link>
                    
//                 </nav>
//             </div>
//         </header>
//     );
// };

// export default Header;


import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import Link and NavLink
import { gdgTheme } from '../../theme/gdgctheme';
import gdgLogo from '../../assets/images/light_gdgdbit_logo.jpg';
import { useAuth } from '../../Admin/AuthContext'; // <-- IMPORT AUTH HOOK

const Header = () => {
    const { user, loginAsAdmin, logout } = useAuth(); // <-- Get auth state and functions

    // Define styles for NavLink
    const navLinkStyle = {
        color: gdgTheme.colors.text.primary,
        textDecoration: 'none',
        ...gdgTheme.typography.styles.navLink,
        padding: `${gdgTheme.spacing.sm} ${gdgTheme.spacing.md}`,
        borderRadius: gdgTheme.borderRadius.medium
    };
    
    // Style for the *active* link
    const activeStyle = {
        fontWeight: '700',
        color: gdgTheme.colors.primary.blue,
    };

    const navItems = ['Home', 'Events', 'Leaderboard', 'Explanations'];

    return (
        <header style={{
            backgroundColor: gdgTheme.colors.background.white,
            color: gdgTheme.colors.text.primary,
            padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.xl}`,
            position: 'static',
            top: 0,
            zIndex: 1000,
            boxShadow: gdgTheme.shadows.small
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: gdgTheme.spacing.md }}>
                        <img
                            src={gdgLogo}
                            alt="GDG Logo"
                            style={{
                                height: '80px',
                                width: 'auto',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                </Link>

                <nav style={{ display: 'flex', gap: gdgTheme.spacing.lg, alignItems: 'center' }}>
                    {navItems.map((item) => {
                        let path = `/${item.toLowerCase()}`;
                        if (item === 'Home') path = '/';

                        // Use NavLink for links that should have an "active" state
                        if (item === 'Home' || item === 'Explanations') {
                            return (
                                <NavLink
                                    key={item}
                                    to={path}
                                    style={({ isActive }) => ({
                                        ...navLinkStyle,
                                        ...(isActive ? activeStyle : {})
                                    })}
                                >
                                    {item}
                                </NavLink>
                            );
                        }
                        // Use regular 'a' for on-page links or external
                        return (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`} // Assuming Events/Leaderboard are sections
                                style={navLinkStyle}
                            >
                                {item}
                            </a>
                        );
                    })}

                    <Link
                        to="/live-quiz"
                        style={{
                            backgroundColor: gdgTheme.colors.primary.blue,
                            color: gdgTheme.colors.text.inverse,
                            border: 'none',
                            ...gdgTheme.typography.styles.button,
                            padding: `${gdgTheme.spacing.md} ${gdgTheme.spacing.lg}`,
                            borderRadius: gdgTheme.borderRadius.medium,
                            cursor: 'pointer',
                            boxShadow: gdgTheme.shadows.button,
                            textDecoration: 'none' 
                        }}
                    >
                        Live Quiz
                    </Link>

                    {/* --- NEW LOGIN TOGGLE FOR TESTING --- */}
                    {user ? (
                        <button onClick={logout} className="admin-toggle-btn admin-logout">
                            Log Out (Logged in as {user.role})
                        </button>
                    ) : (
                        <button onClick={loginAsAdmin} className="admin-toggle-btn admin-login">
                            Test: Login as Admin
                        </button>
                    )}
                </nav>
            </div>
            
            {/* --- Simple styles for the test button --- */}
            <style>{`
                :root {
                --google-red: #db4437;
                --google-yellow: #f4b400;
                --google-text-dark: #3c4043;
            }

            .admin-toggle-btn {
                padding: 0.6rem 1rem;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                font-family: 'Roboto', 'Arial', sans-serif;
                white-space: nowrap; /* Prevents button from wrapping */
                transition: background-color 0.2s ease, box-shadow 0.2s ease;
            }
            .admin-login {
                background-color: var(--google-yellow); 
                color: var(--google-text-dark);
            }
            .admin-login:hover {
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            .admin-logout {
                background-color: var(--google-red); 
                color: white;
            }
            .admin-logout:hover {
                 box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
        `}</style>
        </header>
    );
};

export default Header;