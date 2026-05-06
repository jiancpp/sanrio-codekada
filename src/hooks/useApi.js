import { useState } from 'react';
import { BASE_URL } from './constants';

export const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async ({name, email, password}) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/users/register`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ name, email, password })
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Register failed');
            }
            
            return data; // Return user data to the component

        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    return { 
        // Add new API calls here
        register, 
        isLoading, 
        error 
    };   
}

