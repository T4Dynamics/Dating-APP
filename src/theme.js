import { DefaultTheme } from 'react-native-paper';

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
        button: {
            primary: '#212121',
        }
    },
    fonts: {
        judson: {
            regular: 'Judson-Regular',
            bold: 'Judson-Bold',
            italic: 'Judson-Italic',
        },
        montserrat: {
            regular: 'Montserrat-Regular',
            bold: 'Montserrat-SemiBold',
        }
    }

};


export { theme }