import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator, useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { Icon } from 'react-native-elements'
import { theme } from '../theme'

import SwipeScreen from './SwipeScreen';
import MessagesScreen from './MessagesScreen';
import MatchesScreen from './MatchesScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const TabButtons = [
    {
        name: 'Swipe',
        component: SwipeScreen,
        iconName: 'toggle-left'
    },
    {
        name: 'Messages',
        component: MessagesScreen,
        iconName: 'message-square'
    },
    {
        name: 'Matches',
        component: MatchesScreen,
        iconName: 'heart'
    },
    {
        name: 'Profile',
        component: ProfileScreen,
        iconName: 'user'
    },
]

export default function MainContainer(props) {
    return (
        <>
            <NavigationContainer>
                    <Tab.Navigator
                        initialRouteName="Swipe"
                        screenOptions={({route}) => ({
                            headerShown: false,
                            tabBarShowLabel: false,
                            tabBarStyle: {
                                position: 'absolute',
                                bottom: '5%',
                                display: 'block',
                                borderRadius: '100%',
                                backgroundColor: '#222',
                                height: 50,
                                width: '90%',
                                marginHorizontal: '5%',
                                padding: 10,
                            }
                        })}
                    >
                    
                    {TabButtons.map((item, index) => (
                        <Tab.Screen key={index} name={item.name} component={item.component} options={{
                            tabBarIcon: ({focused, color, size}) => {
                                return <Icon name={item.iconName} type="feather" size={size} color={color} />
                            }
                        }}/>
                    ))} 

                    </Tab.Navigator>    
            </NavigationContainer>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: '5%',
        position: 'absolute',
        bottom: '5%',
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