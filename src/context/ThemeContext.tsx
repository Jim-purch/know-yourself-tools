import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'tech';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('ky-theme');
        // Default to 'light' if 'dark' or invalid is found, or allow 'tech' if saved
        return (saved === 'tech') ? 'tech' : 'light';
    });

    useEffect(() => {
        const root = document.documentElement;

        // Ensure only 'light' or 'tech' is applied
        if (theme === 'tech') {
            root.setAttribute('data-theme', 'tech');
        } else {
            root.removeAttribute('data-theme'); // default to light (no data-theme usually implies light in many setups, or explicitly set light)
            root.setAttribute('data-theme', 'light');
        }

        localStorage.setItem('ky-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
