'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<any>({ user: null, loading: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    return (
        <AuthContext.Provider value={{ user, loading: false }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
