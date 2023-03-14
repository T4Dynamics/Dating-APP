import React, { useState, useEffect }  from 'react';
import { Text } from 'react-native-paper';
import { Button, TextInput } from 'react-native';
import { firebaseAuth, onAuthStateChanged } from '../../firebase';

import Background from '../components/Background';

export default function VerifyPhoneNum() {
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');
    
    async function signInWithPhoneNumber(phoneNum) {
        const confirmation = await Auth().signInWithPhoneNumber(phoneNum);
        setConfirm(confirmation);
    }

    useEffect(() => {
        const subscriber = Auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
      }, []);

    // Wait for confirmation code
    async function confirmCode() {
        try {
          await confirm.confirm(code);
        } catch (error) {
          console.log('Invalid code.');
        }
    }

    if (!confirm) {
        return (
          <Button
            title="Phone Number Sign In"
            onPress={() => signInWithPhoneNumber('+1 650-555-3434')}
          />
        );
      }

    return (
        <Background>
             <Text style={styles.title}>Enter Phone Number</Text>
             <TextInput value={code} onChangeText={text => setCode(text)} />
            <Button title="Confirm Code" onPress={() => confirmCode()} />
        </Background>
    );
}