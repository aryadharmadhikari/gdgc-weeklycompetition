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

    // 🎯 CHANGE THIS TO SWITCH BETWEEN USER/ADMIN
    const MOCK_USER_ROLE = 'user';  // Change to 'admin' to test admin features

    // Simple sign-in (no parameters needed for mock)
    const signIn = async () => {
        try {
            // Mock sign-in with your details
            const mockUser = {
                uid: 'mock-user-123',
                displayName: 'Arya Dharmadhikari',
                email: 'arya.dharmadhikari@dbit.in',
                photoURL: 'https://via.placeholder.com/150',
                role: MOCK_USER_ROLE  // Uses the role set above
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUser(mockUser);
            return { success: true, user: mockUser };
        } catch (error) {
            throw new Error('Sign-in failed. Please try again.');
        }
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

    // Mock user persistence
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
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
