import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper'
import { TextInput } from 'react-native-paper';

import Toast from 'react-native-toast-message';
import { CONSTANTS } from '../Constants';
import Loader from '../Loader';


export default function GarageInfo({ navigation, route }) {
    const { emailuuid } = route.params;
    const [owner, setOwner] = useState('')
    const [loading, isLoading] = useState(true)
    const [shopName, setShopName] = useState('')
    const [locality, setLocality] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [pincode, setPincode] = useState('')
    const [gst, setGst] = useState('')

    useEffect(() => {
        console.log("EMUID", emailuuid);
        checkmainfo()
    }, [])
    async function checkmainfo() {
        AsyncStorage.getItem('emailuuid', (err, res) => {
            axios.post(CONSTANTS.BASE_URL + "/checkmainfo", { 'uuid': res }).then((res) => {
                console.log(res.data);
                if (res.data.ok == 'true') {
                    navigation.reset({
                        routes: [{ name: 'GarageDocs', params: { emailuuid: emailuuid } }],
                    })
                } else {
                    isLoading(false)
                }
            });
        });

    }
    function validateAndSubmit() {
        if (owner != '' && shopName != '' && locality != '' && address != '' && city != '' && pincode != '') {
            isLoading(true)
            const payload = {
                'emailuuid': emailuuid,
                'shop_owner_name': owner,
                'shop_name': shopName,
                'shop_address': address,
                'locality': locality,
                'city': city,
                'pincode': pincode,
                'gst': gst ? gst : 'null',
            };
            axios.post(CONSTANTS.BASE_URL + "/submitgarageinfo", JSON.stringify(payload)).then((res) => {
                if (res.data.ok == 'true') {
                    navigation.reset({
                        routes: [{ name: 'GarageDocs', params: { emailuuid: emailuuid } }],
                    })
                } else {
                    Toaster('error', 'INTERNAL SERVER ERROR', "There's Some Problem in our server.");
                    return;
                }
            });

        } else {
            Toaster('error', 'Empty Details', "Please fill in all required Details");
            return;
        }
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
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
            {
                loading ? <Loader /> : <ScrollView scrollEventThrottle={16}>
                    <View style={{ padding: 20 }}>
                        <Avatar.Image source={require('../../assets/images/info.png')} style={{}} />
                        <Text style={{ fontFamily: "ManropeBold", fontSize: 20 }}>Fill in these Information</Text>
                    </View>
                    <View style={styles.view}>
                        <TextInput
                            autoFocus
                            mode='outlined'
                            label="Owner's Name (required)"
                            value={owner}
                            onChangeText={text => setOwner(text)}

                        />
                    </View>
                    <View style={styles.view}>
                        <TextInput
                            mode='outlined'
                            label="Shop Name (required)"
                            value={shopName}
                            onChangeText={text => setShopName(text)}
                            style={{ fontFamily: "ManropeMedium" }}
                        />
                    </View>
                    <View style={styles.view}>
                        <TextInput
                            mode='outlined'
                            label="Shop Address (required)"
                            value={address}
                            onChangeText={text => setAddress(text)}
                            style={{ fontFamily: "ManropeMedium" }}
                        />
                    </View>
                    <View style={styles.view}>
                        <TextInput
                            mode='outlined'
                            label="Locality (required)"
                            value={locality}
                            onChangeText={text => setLocality(text)}
                            style={{ fontFamily: "ManropeMedium" }}
                        />
                    </View>
                    <View style={styles.view}>
                        <TextInput
                            mode='outlined'
                            label="City (required)"
                            value={city}
                            onChangeText={text => setCity(text)}
                            style={{ fontFamily: "ManropeMedium" }}

                        />
                    </View>
                    <View style={styles.view}>
                        <TextInput
                            mode='outlined'
                            label="Pincode (required)"
                            value={pincode}
                            onChangeText={text => setPincode(text)}
                            keyboardType="numeric"
                            style={{ fontFamily: "ManropeMedium" }}

                        />
                    </View>
                    <View style={styles.view}>
                        <TextInput
                            mode='outlined'
                            label="Gst Number (optional)"
                            value={gst}
                            onChangeText={text => setGst(text)}
                            keyboardType="numeric"
                            style={{ fontFamily: "ManropeMedium" }}
                        />
                    </View>
                    <View style={styles.view}>
                        <TouchableOpacity style={{ padding: 20, backgroundColor: "#000" }} onPress={() => validateAndSubmit()}>
                            <Text style={{ color: "#fff", textAlign: 'center', fontFamily: "ManropeBold" }}>SUBMIT AND CONTINUE</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            }

            <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
    )
}
const styles = StyleSheet.create({
    label: {
        fontFamily: "ManropeMedium"
    },
    view: {
        paddingHorizontal: 20,
        paddingVertical: 10
    }
})