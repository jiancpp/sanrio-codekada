import { useState } from 'react';
import { BASE_URL } from './constants';

export const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /* ══════════════════════════════════════════════
        ACCOUNT SETUP FUNCTIONS
        ══════════════════════════════════════════════ */
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

    const createFamily = async ({ familyName, userId }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/family/create`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ familyName, userId })
            })

            const family = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Register failed');
            }
            
            return family; // Return family code

        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    const joinFamily = async ({ familyCode, userId }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/family/join`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ familyCode, userId })
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Register failed');
            }
            
            return data; // Return family data to the component

        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    /* ══════════════════════════════════════════════
        <REPLACE HEADER>
        ══════════════════════════════════════════════ */

    return { 
        // Add new API calls here
        register, 
        createFamily,
        joinFamily,
        isLoading, 
        error 
    };   
}

