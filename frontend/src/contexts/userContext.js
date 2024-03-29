// src/contexts/UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function useUser() {
    return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    return (
        <UserContext.Provider value={{ role, setRole }}>
        {children}
        </UserContext.Provider>
    );
};
