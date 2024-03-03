import React, { createContext, useState } from 'react';

// import { theDarkTheme, theLightTheme } from '../theme/theme';

export const ThemeContext = createContext()

function ThemeContextProvider(props) {
    // eslint-disable-next-line
    const [theme, setTheme] = useState('dark');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isDark, setDark] = useState(true);

    const setHandleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    const changeTheme = () => {
            setTheme(theme => (theme === 'dark' ? 'light' : 'dark'));
            setDark(!isDark);
    }

    const value = { theme, drawerOpen, setHandleDrawer, changeTheme, isDark }
    return (
        <ThemeContext.Provider value={value}>
            {props.children}
        </ThemeContext.Provider>
    )
}


export default ThemeContextProvider;