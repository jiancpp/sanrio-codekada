import { useState } from 'react';
import { BASE_URL } from './constants';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async ({email, name, familyCode, password, rememberMe}) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, familyCode, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // --- The "Remember Me" Logic ---
            if (!rememberMe) {
                localStorage.setItem('token', data.token); // Persistent
                localStorage.setItem('user', JSON.stringify(data.user)); 
            } else {
                sessionStorage.setItem('token', data.token); // Temporary
                sessionStorage.setItem('user', JSON.stringify(data.user)); 
            }

            setIsLoading(false);
            return data.user; // Return user data to the component

        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            return null;
        }
    };

    const logout = () => {
        // Clear BOTH storages just to be safe
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    };

    return { login, logout, isLoading, error };
};