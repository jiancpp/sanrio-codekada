import { useState } from 'react';
import { BASE_URL } from './constants';

export const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /* ══════════════════════════════════════════════
        ACCOUNT SETUP FUNCTIONS
        ══════════════════════════════════════════════ */
    const register = async ({ name, email, password }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/users/register`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
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
                headers: { "Content-Type": "application/json" },
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
                headers: { "Content-Type": "application/json" },
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
        FAMILY
        ══════════════════════════════════════════════ */
    const getFamilyMembers = async ({ familyCode, token }) => {
        try {
            const response = await fetch(`${BASE_URL}/family/get/${familyCode}`, {
                method: 'GET',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch members');
            }

            return data.members; // Return family members to the component

        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setIsLoading(false);
        }
    }

    /* ══════════════════════════════════════════════
        DAILY LOG FUNCTIONS
        ══════════════════════════════════════════════ */
    const addLog = async (logData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/daily-log/add`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add log');
            }

            // We return data.value because of the rawResult: true in your controller
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    const getFamilyLogs = async (familyCode, params = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const queryString = Object.keys(params).length 
                ? '?' + new URLSearchParams(params).toString() 
                : '';
            const response = await fetch(`${BASE_URL}/daily-log/family/${familyCode}${queryString}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get family log');
            }

            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    const getUserLogs = async (userId) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/daily-log/user/${userId}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get user logs');
            }

            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    const getFamilyStreak = async (familyCode) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/daily-log/streak/${familyCode}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get family streak');
            }

            return data;
        } catch (err) {
            setError(err.message);
            return 0;
        } finally {
            setIsLoading(false);
        }
    }

    const getDailyLog = async (userId, date) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/daily-log/user/${userId}/date/${date}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get user log for this date');
            }

            return data;
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
        getFamilyMembers,
        addLog,
        getFamilyLogs,
        getFamilyStreak,
        getUserLogs,
        getDailyLog,
        isLoading,
        error
    };
}

