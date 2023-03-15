import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { theme } from '../theme'
import { Icon } from 'react-native-elements'

const navItems = [
    {icon: 'toggle-left', page: 'HomeScreen'},
    {icon: 'heart', page: 'MatchesScreen'},
    {icon: 'message-square', page: 'MessagesScreen'},
    {icon: 'user', page: 'Dashboard'},
]

export default function Nav({ navigation }) {
    const [currentPage, setCurrentPage] = React.useState(0);

    //  Handle navigation - Do not move to prevent prop drilling
    function handleOnPress(props) {
        navigation.navigate(props.page)
        setCurrentPage(props.id)
    }

    function IconButton(props) {
        return (
            <Icon 
                name={props.icon}
                type='feather' 
                color={props.currentPage === props.id ? 'white' : 'black'} 
                size={30} 
                onPress={() => handleOnPress(props)} 
                style={styles.button} 
            />
        );
    }

    return (
        <View style={styles.container}>
            <View id='highlight' style={styles.highlight} />
            <View style={styles.buttonContainer}>
                {navItems.map((item, index) => (
                    <IconButton key={index} id={index} icon={item.icon} page={item.page} currentPage={currentPage} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '8%',
        width: '90%',
        backgroundColor: '#F6F6F6',
        borderRadius: '100%',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
    },
    buttonContainer: {
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button: {
        position: 'relative',
        zIndex: 20,
    },
    highlight: {
        zIndex: 10,
        padding: 25,
        backgroundColor: theme.colors.button.primary,
        borderRadius: '100%',
        margin: 10,
        position: 'absolute',
        left: 9,
    }
});