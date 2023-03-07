import React from "react";

import Background from "../components/Background";
import Button from "../components/Button";

import { Text, View, StyleSheet } from 'react-native';
import Header from "../components/Header";
import Nav from "../components/Nav";
import Card from "../components/Card";
import CardItem from "../components/CardItem";


export default function MatchesScreen({ navigation }) {
    return (
        <Background>
            <Header/>

            <Card
                name='John Doe'
                age='20'
                style={{
                    zIndex: 2,
                    position: 'relative',
                    backgroundColor: '#FFBF00',
                }}
            >
                <CardItem>
                    <Text>Swimming</Text>
                </CardItem>
                <CardItem>
                    <Text>Scorpio</Text>
                </CardItem>
                <CardItem>
                    <Text>Drinks</Text>
                </CardItem>
                <CardItem>
                    <Text>Shopping</Text>
                </CardItem>
            </Card>

            <Card
                name='Jane Doe'
                age='25'
                style={{
                    zIndex: 1,
                    position: 'absolute',
                    top: 126.5,
                    left: 19.5,
                    backgroundColor: '#F28C28',
                }}
            >
                <CardItem>
                    <Text>Swimming</Text>
                </CardItem>
                <CardItem>
                    <Text>Scorpio</Text>
                </CardItem>
                <CardItem>
                    <Text>Drinks</Text>
                </CardItem>
                <CardItem>
                    <Text>Shopping</Text>
                </CardItem>
            </Card>

            <Nav/>
        </Background>
    );
}