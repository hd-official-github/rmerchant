import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, ActivityIndicatorBase, Alert } from 'react-native'
import { Avatar } from 'react-native-paper'
import auth from '@react-native-firebase/auth';
import Loader from '../Loader';
import {
    GoogleSignin,
    GoogleSigninButton
    // statusCodes,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { CONSTANTS } from '../Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
export default function Verifyemail({ navigation, route }) {
    const { numuuid } = route.params;
    const [loggedIn, setloggedIn] = useState(true)
    useEffect(() => {
        AsyncStorage.getItem('emailuuid', (err, res) => {
            if (res) {
                navigation.reset({
                    routes: [{ name: 'GarageInfo', params: { emailuuid: res } }],
                })
            } else {
                setloggedIn(false)
            }

        });
        GoogleSignin.configure({
            scopes: ['email'],
            webClientId:
                '640559556492-q7jomc5ptfg9fkc1b87sm7vf17o9an7k.apps.googleusercontent.com',
            offlineAccess: true,
        });
    }, []);
    const signIn = async () => {

        await GoogleSignin.hasPlayServices();
        const { idToken } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        setloggedIn(true);
        // Sign-in the user with the credential
        const data = await auth().signInWithCredential(googleCredential);

        const payload = {
            'numuuid': numuuid,
            'uuid': data.user.uid,
            'user_email': data.user.email,
        };
        await uploadUser(payload);
    };

    const uploadUser = async (payload) => {

        axios.post(CONSTANTS.BASE_URL + "/setmechanicemail", JSON.stringify(payload)).then(res => {
            if (res.data.ok) {
                AsyncStorage.setItem('emailuuid', payload.uuid).then(res => {
                    navigation.reset({
                        routes: [{ name: 'GarageInfo', params: { emailuuid: payload.uuid } }],
                    })
                })
            } else {
                Toaster('error', 'INTERNAL SERVER ERROR', "There was internal server error");
            }
        }).catch((err) => {
            Alert.alert(err)
        });
    }
    function Toaster(type, text1, text2) {
        Toast.show({
            type: type,
            text1: text1,
            text2: JSON.stringify(text2),
            position: 'bottom',
            visibilityTime: 4000,
            autoHide: true,
        })
    }
    return (
        <View style={{ flex: 1 }}>
            {
                loggedIn ? <Loader />

                    :
                    <View style={{ padding: 10, backgroundColor: "#fff", flex: 1, paddingTop: 50, paddingLeft: 20 }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Avatar.Image source={require('../../assets/images/verified.png')} size={82} />
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={styles.text}>Phone Number Verified</Text>
                                <Avatar.Image source={require('../../assets/images/tick.png')} size={32} />
                            </View>
                        </View>
                        <View style={styles.bottom}>
                            <Text style={{ fontFamily: "ManropeMedium", fontSize: 16, marginTop: 10, paddingBottom: 20, textAlign: 'left' }}>Connect Your Google Account For Further verification</Text>
                            <GoogleSigninButton size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={signIn} style={{ backgroundColor: '#000', paddingVertical: 20, }} />
                        </View>
                    </View>
            }
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "ManropeBold",
        fontSize: 20
    },
    bottom: {
        marginTop: 50,

    },
})