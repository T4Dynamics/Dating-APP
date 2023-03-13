import { DefaultTheme } from 'react-native-paper';

export const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        text: '#000000',
        primary: '#624DE1',
        secondary: '#414a77',
        accent: '#cdd4f8',
        error: '#e74c3c',
    },
};