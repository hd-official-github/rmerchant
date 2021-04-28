import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, PermissionsAndroid } from 'react-native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';

import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { CONSTANTS } from '../Constants';
import Loader from '../Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function GarageDocs({ navigation, route }) {
    const { emailuuid } = route.params;
    const [loading, isLoading] = useState(true);
    const [shopEntrance, setshopEntrance] = useState('');
    const [registration, setRegistration] = useState('');
    const [mechanicPhoto, setMechanicPhoto] = useState('');
    const [mechanicDL, setMechanicDL] = useState('');
    var shopEntranceurl = ""
    var registrationurl = ""
    var mechanicPhotourl = ""
    var mechanicDLurl = ""

    useEffect(() => {
        checkisdocs()
        console.log("DOCS ", emailuuid);
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "App Camera Permission",
                message: "App needs access to your camera ",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );
        if (PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Camera permission given");
        } else {
            console.log("Camera permission denied");
        }
    }, [])
    function checkisdocs() {
        AsyncStorage.getItem('emailuuid', (err, res) => {
            axios.post(CONSTANTS.BASE_URL + "/checkisdocs", { 'uuid': res }).then((res) => {
                console.log(res.data);
                if (res.data.ok == 'true') {
                    navigation.reset({
                        routes: [{ name: 'Waiting' }],
                    })
                } else {
                    isLoading(false)
                }
            });
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
    function selectImage(potato) {
        let options = {
            mediaType: 'photo',
            maxWidth: 256,
            maxHeight: 256,
            quality: 1,

        };
        launchCamera(options, (res) => {
            if (res.didCancel) {
                console.log('User cancelled photo picker');
                Alert.alert('You did not select any image');
            } else if (res.errorCode) {
                console.log('ImagePicker Error: ', res.errorMessage);
            } else {
                let uri = res.uri;
                // console.log(uri);
                // console.log(res.fileName);
                // console.log(res.type);
                // console.log(res.fileSize);

                switch (potato) {
                    case '1': setshopEntrance(uri);
                        break;
                    case '2': setRegistration(uri);
                        break;
                    case '3': setMechanicPhoto(uri);
                        break;
                    case '4': setMechanicDL(uri);
                        break;
                    default:
                        break;
                }
            }
        });
    }
    async function submitForVerification() {

        if (shopEntrance && registration && mechanicPhoto && mechanicDL) {
            isLoading(true)
            for (var i = 1; i <= 4; i++) {
                const fileName = uuidv4();
                const reference = storage().ref(fileName);
                if (i == 1) {
                    const task = await reference.putFile(shopEntrance);
                    const downloadurl = await getdownloadurl(fileName);

                    shopEntranceurl = downloadurl
                } else if (i == 2) {
                    const task = await reference.putFile(registration);
                    const downloadurl = await getdownloadurl(fileName);

                    registrationurl = downloadurl
                } else if (i == 3) {
                    const task = await reference.putFile(mechanicPhoto);
                    const downloadurl = await getdownloadurl(fileName);

                    mechanicPhotourl = downloadurl
                } else {
                    const task = await reference.putFile(mechanicDL);
                    const downloadurl = await getdownloadurl(fileName);

                    mechanicDLurl = downloadurl
                }
            }

            uploadData();
            // const reference = storage().ref('black-t-shirt-sm.png');
            // const task = reference.putFile(shopEntrance);

            // task.on('state_changed', taskSnapshot => {
            //     console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
            // });

        } else {
            Toaster('error', 'IMAGES UNAVAILABLE', "Please upload all images first");
        }
    }
    function uploadData() {
        const payload = {

            'emailuuid': emailuuid,
            'shopfront': shopEntranceurl,
            'registration': registrationurl,
            'mechanicphoto': mechanicPhotourl,
            'mechanicdl': mechanicDLurl

        }
        console.log("PAYLOAD ", payload);
        axios.post(CONSTANTS.BASE_URL + '/submitphotodocs', JSON.stringify(payload)).then(res => {
            console.log(res.data);
            if (res.data.ok == 'true') {
                navigation.reset({
                    routes: [{ name: 'Waiting' }],
                })
            } else {
                Toaster('error', 'UNABLE TO UPLOAD IMAGES TO SERVER', "Please retry again");
            }
        })
    }
    async function getdownloadurl(fileName) {
        const reference = await storage().ref(fileName).getDownloadURL();
        return reference
    }
    return (

        <View style={{ flex: 1 }}>
            {
                loading ? <Loader /> :
                    <View style={styles.container}>
                        <Text style={{ fontFamily: "ManropeBold", fontSize: 18, padding: 25 }}>Upload Proof Documents</Text>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.button} onPress={() => selectImage('1')}>
                                {
                                    shopEntrance ? <Image source={{ uri: shopEntrance }} style={{ width: 150, height: 150 }} /> : <>
                                        <Image source={require('../../assets/images/upload.png')} style={{ width: 100, height: 100 }} />
                                        <Text style={styles.btntxt}>Upload your shop Entrance photo</Text>
                                    </>
                                }

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => selectImage('2')}>
                                {

                                    registration ? <Image source={{ uri: registration }} style={{ width: 150, height: 150 }} /> : <>
                                        <Image source={require('../../assets/images/upload.png')} style={{ width: 100, height: 100 }} />
                                        <Text style={styles.btntxt}>Upload your shop Registration Document</Text>
                                    </>

                                }

                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.button} onPress={() => selectImage('3')}>
                                {

                                    mechanicPhoto ? <Image source={{ uri: mechanicPhoto }} style={{ width: 150, height: 150 }} /> : <>
                                        <Image source={require('../../assets/images/upload.png')} style={{ width: 100, height: 100 }} />
                                        <Text style={styles.btntxt}>Upload Mechanic's Photo</Text>
                                    </>

                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => selectImage('4')}>
                                {

                                    mechanicDL ? <Image source={{ uri: mechanicDL }} style={{ width: 150, height: 150 }} /> : <>
                                        <Image source={require('../../assets/images/upload.png')} style={{ width: 100, height: 100 }} />
                                        <Text style={styles.btntxt}>Upload Mechanic's Driver License</Text>
                                    </>

                                }
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ marginTop: 'auto', padding: 20, backgroundColor: "#000", margin: 5 }} onPress={() => submitForVerification()}>
                            <Text style={{ fontFamily: "ManropeBold", color: "#fff", textAlign: 'center' }}>CONTINUE </Text>
                        </TouchableOpacity>
                        <Toast ref={(ref) => Toast.setRef(ref)} />
                    </View>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center'
    },
    button: {
        width: '45%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderWidth: 2,
        marginHorizontal: 5,
        padding: 10
    },
    btntxt: {
        fontFamily: "ManropeMedium",
        fontSize: 12,
        textAlign: 'center'
    }
})