import { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Unified sign-in with role support
    const signIn = async (email, password, role = 'user') => {
        try {
            // Mock sign-in logic - replace with Firebase
            const mockUser = {
                uid: 'mock-user-123',
                displayName: email.split('@')[0],
                email: email,
                photoURL: 'https://via.placeholder.com/150',
                role: role // Add role here
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUser(mockUser);
            return { success: true, user: mockUser };
        } catch (error) {
            throw new Error('Sign-in failed. Please try again.');
        }
    };

    // Convenience methods for admin/user login
    const loginAsAdmin = () => {
        return signIn('admin@example.com', 'password', 'admin');
    };

    const loginAsUser = () => {
        return signIn('user@example.com', 'password', 'user');
    };

    const signOut = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setUser(null);
            return { success: true };
        } catch (error) {
            throw new Error('Sign-out failed. Please try again.');
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(false);
        };
        checkAuth();
    }, []);

    const value = {
        user,
        loading,
        signIn,
        signOut,
        loginAsAdmin,
        loginAsUser,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
