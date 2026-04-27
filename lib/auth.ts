import { Role, Utilisateur } from './types';

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const getUser = (): Utilisateur | null => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        if (!user || user === 'undefined') return null;
        try {
            return JSON.parse(user);
        } catch (e) {
            console.error("Erreur parsing localStorage user", e);
            localStorage.removeItem('user'); // Nettoyage si corrompu
            return null;
        }
    }
    return null;
};

export const setUser = (user: Utilisateur): void => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};