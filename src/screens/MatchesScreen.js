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

            <Card>
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