import { createContext, useContext } from 'react';
import { Theme, User } from '../types';

export interface AppContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    login: (email: string, pass: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
