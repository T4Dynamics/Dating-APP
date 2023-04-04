import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Icon } from 'react-native-elements'

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

import SwipeScreen from '../screens/SwipeScreen';
import MessagesScreen from '../screens/MessagesScreen';
import MatchesScreen from '../screens/MatchesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MainScreen from '../screens/MainScreen';

import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

function Nav() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="SwipeScreen"
                screenOptions={({route}) => ({
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarItemStyle: {
                        width: 50,
                        height: 50,
                    },
                    tabBarStyle: {
                        position: 'absolute',
                        display: 'block',
                        borderTopEndRadius: '25%',
                        borderTopStartRadius: '25%',
                        backgroundColor: '#F6F6F6',
                        height: 140,
                        padding: 15,
                        shadowColor: 'black',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                    }
                })}
            >
            
            {TabButtons.map((item, index) => (
                <Tab.Screen key={index} name={item.name} component={item.component} options={{
                    tabBarIcon: ({focused, color, size}) => {
                        return <Icon 
                            name={item.iconName} 
                            type="feather" 
                            size={32} 
                            color={focused ? 'white' : styles.button.primary}
                            backgroundColor={focused ? '#121212' : undefined}
                            style={styles.button}
                        />
                    }
                }}/>
            ))} 
            </Tab.Navigator>   
            <Tab.Screen name="MainScreen" component={MainScreen} />
        </NavigationContainer> 
    );
}


export default Nav;