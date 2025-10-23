import { useState, useEffect, useContext, createContext } from 'react';

// Create Auth Context
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

    // Mock authentication functions (replace with real Firebase later)
    const signIn = async () => {
        try {
            // Mock sign-in logic - replace with Firebase
            const mockUser = {
                uid: 'mock-user-123',
                displayName: 'Arya Dharmadhikari',
                email: 'sum-rndm-nga@dbit.in',
                photoURL: 'https://via.placeholder.com/150'
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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setUser(null);
            return { success: true };
        } catch (error) {
            throw new Error('Sign-out failed. Please try again.');
        }
    };

    // Mock user persistence (replace with Firebase onAuthStateChanged)
    useEffect(() => {
        // Mock checking for existing session
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
