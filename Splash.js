import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { CONSTANTS } from './src/Constants'

export default function Splash({ navigation }) {

    useEffect(() => {

        AsyncStorage.getItem('mech_id', (res) => {
            if (res) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
            }
        })
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require('./assets/images/logo.png')} />
            <Text style={{ fontFamily: 'ManropeBold' }}>MERCHANT</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CONSTANTS.COLOR,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
