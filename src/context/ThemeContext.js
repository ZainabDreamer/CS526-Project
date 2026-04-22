import {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      darkMode,
      toggleTheme,
      colors: {
        background: darkMode ? '#181622' : '#F3F1FA',
        card: darkMode ? '#232031' : '#FFFFFF',
        text: darkMode ? '#FFFFFF' : '#111111',
        subText: darkMode ? '#B7B2C9' : '#6E6A8A',
        primary: '#4B3F72',
        primaryDark: '#40357E' ,
        primaryDarker: '#312767',
        border: darkMode ? '#312D45' : '#EAEAEA',
        iconBg: darkMode ? '#2E2A40' : '#F0EEF7',
        danger: '#D94B4B',
        headerBtnBg: darkMode ? '#232031' : '#FFFFFF',
        arrow: darkMode ? '#A9A5BC' : '#B0AEBB',
        switchTrackOn: darkMode ? '#6F5CDE' : '#3B2B93',
        switchTrackOff: darkMode ? '#45405E' : '#D8D4E6',
        switchThumb: '#FFFFFF',
        logoutBg: darkMode ? '#33232A' : '#FBEDEE',
        moonCut: darkMode ? '#2E2A40' : '#F0EEF7',
      },
    }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};