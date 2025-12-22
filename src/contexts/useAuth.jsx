// src/contexts/useAuth.js
import { createContext, useContext } from "react";

// Create the context here
export const AuthContext = createContext();

// Export the hook from here
export const useAuth = () => useContext(AuthContext);