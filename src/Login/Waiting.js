import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper'

export default function Waiting() {
    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <Image source={require('../../assets/images/stamp.png')} style={{ width: 200, height: 200 }} />
                <Text style={{ fontFamily: "ManropeBold", fontSize: 18 }}>We are evaluating your profile</Text>
                <Text style={{ fontFamily: "ManropeMedium", fontSize: 14, paddingHorizontal: 20, textAlign: 'center', marginTop: 25 }}>In order to avoid fake profiles we are validating all your Information that you have uploaded. If we believe you are genuine your profile will be accepted.</Text>
                <TouchableOpacity style={styles.btn}>
                    <Avatar.Image source={require('../../assets/images/support.png')} size={30} />
                    <Text style={{ paddingHorizontal: 10 }}>Call HelpLine</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",

    },
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f1f1f1",
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10
    }
})