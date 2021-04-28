import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native'

import auth from '@react-native-firebase/auth';
import axios from 'axios'
import Loader from '../Loader';
import PhoneInput from 'react-native-phone-number-input';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONSTANTS } from '../Constants';
import Toast from 'react-native-toast-message';
import OTPTextView from 'react-native-otp-textinput'

export default function LoginScreen({ navigation }) {

    const [loading, isLoading] = useState(true);
    const [confirm, setConfirm] = useState(null);
    const [num, setNum] = useState(null);
    const [otp, setOtp] = useState('');


    useEffect(() => {

        AsyncStorage.getItem('mobileuuid', (err, res) => {
            if (res) {
                navigation.reset({
                    routes: [{ name: 'VerifyEmail', params: { numuuid: res } }],
                });
            } else {
                isLoading(false)
            }
        });

    }, [])
    async function signInWithPhoneNumber(phoneNumber) {

        isLoading(true);
        const confirmation = await auth().signInWithPhoneNumber("+91" + phoneNumber);
        console.log(confirmation);
        await setConfirm(confirmation);
        isLoading(false);
        // setConfirm('confirmation');


    }
    async function confirmCode() {
        try {
            isLoading(true);
            const user = await confirm.confirm(otp);
            if (user.user) {
                axios.post(CONSTANTS.BASE_URL + '/submitmechanicnumber', { number: num, mobileuuid: user.user.uid }).then(res => {
                    if (res.data.ok == 'true') {
                        AsyncStorage.setItem('mobileuuid', res.data.uuid).then((e) => {
                            navigation.reset({
                                routes: [{ name: 'VerifyEmail', params: { numuuid: res.data.uuid } }],
                            });
                        }).catch(err => {
                            Toaster('error', 'INTERNAL SERVER ERROR', "There was internal server error");
                        });

                    } else {
                        Toaster('error', 'INVALID OTP', "Please enter correct otp");
                    }
                });
            }

        } catch (error) {
            isLoading(false);
            console.log('Invalid code.');
        }
        // const user = 'true'
        // if (user) {
        //     navigation.reset({
        //         routes: [{ name: 'VerifyEmail' }],
        //     });
        // }
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
    if (!confirm) {
        return (
            <View style={styles.container}>
                {
                    loading ? <Loader /> :
                        <View style={{ padding: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
                            <Image source={require('../../assets/images/logo.png')} />
                            <Image source={require('../../assets/images/entry.jpg')} style={{ width: 400, height: 200 }} />
                            <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
                                <Text style={{ paddingHorizontal: 20, fontFamily: "ManropeMedium" }}>Enter your Mobile Number</Text>
                                <PhoneInput
                                    defaultValue={num}
                                    defaultCode="IN"
                                    layout="second"
                                    value={num}
                                    onChangeText={(text) => {
                                        setNum(text)
                                    }}

                                    textContainerStyle={{ backgroundColor: "#fff", height: 70, color: "#000", fontFamily: "ManropeMedium" }}
                                    containerStyle={{ margin: 0, paddingHorizontal: 0, width: 400 }}
                                    textInputStyle={{ color: '#000', fontSize: 16, borderBottomColor: "#ccc", borderBottomWidth: 1, fontFamily: "ManropeMedium" }}
                                    codeTextStyle={{ padding: 0, margin: 0, fontFamily: "ManropeMedium" }}
                                    autoFocus
                                />

                                <TouchableOpacity
                                    onPress={() => signInWithPhoneNumber(num)} style={styles.button}
                                >
                                    <Text style={styles.btntext}>Continue as Rmechanic Merchant</Text>
                                </TouchableOpacity>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontFamily: "ManropeMedium", paddingHorizontal: 20 }}>By clicking on continue you agree to accept our
                                        <TouchableOpacity style={{}}>
                                            <Text style={styles.links}>Terms and Conditions</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity><Text style={styles.links}>   and Privacy policy</Text></TouchableOpacity></Text>
                                </View>
                            </View>
                        </View>
                }

            </View>
        );
    }

    return (
        <View style={styles.container}>
            {
                loading ? <Loader /> :

                    <View style={styles.otp}>


                        <Image source={require('../../assets/images/verify.png')} style={{ width: 140, height: 140 }} />
                        <Text style={{ fontFamily: "ManropeBold", fontSize: 20, marginBottom: 10 }}>Mobile Verification</Text>
                        <Text style={{ fontFamily: "ManropeMedium" }}>You will recieve otp in this number</Text>
                        {/* <OTPInputView
                            style={{ width: '80%', height: 200 }}
                            pinCount={6}
                            code={code}
                            onCodeChanged={code => { setCode(code) }}
                            autoFocusOnLoad
                            codeInputFieldStyle={styles.underlineStyleBase}
                            codeInputHighlightStyle={styles.underlineStyleHighLighted}
                            onCodeFilled={(code) => {
                                // confirmCode()
                                console.log(code);
                            }}
                            keyboardType="number-pad"
                        /> */}
                        <OTPTextView
                            containerStyle={styles.textInputContainer}
                            handleTextChange={(text) => setOtp(text)}
                            inputCount={6}
                            keyboardType="numeric"
                        />
                    </View>

            }
            <TouchableOpacity style={{ backgroundColor: "#000", padding: 30 }} onPress={() => confirmCode()}>
                <Text style={{ color: "#fff", fontFamily: "ManropeMedium", textAlign: 'center' }}>Confirm OTP</Text>
            </TouchableOpacity>
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: 'center'
    },
    button: {

        paddingVertical: 20,
        marginHorizontal: 10,
        backgroundColor: "#000",
        borderRadius: 5

    },
    btntext: {
        color: "#fff",
        fontSize: 15,
        textAlign: 'center',
        fontFamily: "ManropeBold",

    },
    links: {
        fontFamily: "ManropeBold",
        color: "orange"
    },
    linksbtn: {
        marginVertical: 0,
        paddingVertical: 0
    },
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#fff",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: "#000",
        color: "#000",
        fontFamily: "ManropeMedium"
    },

    underlineStyleHighLighted: {
        borderColor: "#ffe400",
        fontFamily: "ManropeMedium"
    },
    otp: {
        backgroundColor: '#FFF', flex: 1, justifyContent: 'center',
        alignItems: 'center'
    }
});