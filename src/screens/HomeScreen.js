import React from "react";

import Background from "../components/Background";
import Button from "../components/Button";

import { Text, View, StyleSheet } from 'react-native';
import Header from "../components/Header";
import Nav from "../components/Nav";
import Card from "../components/Card";
import CardItem from "../components/CardItem";

import { matches } from '../helpers/matches';


export default function HomeScreen({ navigation }) {
    
    console.log(matches.length);

    let cards = matches.map((match, index) => {
        return (
            <Card
                user={match}
                key={index}
                navigation={navigation}
                style={{
                    zIndex: 100 - index,
                    position: index === 0 ? 'relative' : 'absolute',
                    top: index === 0 ? 0 : '15%',
                    left: index === 0 ? 0 : '5%',
                    backgroundColor: index === 0 ? '#FFB52E' : '#FFA500',
                }}
            />
        );
    });

    return (
        <Background>
            <Header
                navigation={navigation}
            />

            {cards}

            <Nav
                navigation={navigation}
                page='HomeScreen'
            />
        </Background>
    );
}