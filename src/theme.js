import { DefaultTheme, configureFonts } from 'react-native-paper';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        text: '#000000',
        primary: '#624DE1',
        secondary: '#414a77',
        accent: '#eeeeee',
        error: '#e74c3c',
    },
    font: {
        regular: 'Judson-Regular',
        bold: 'Judson-Bold',
        italic: 'Judson-Italic',
    }
};


export { theme }