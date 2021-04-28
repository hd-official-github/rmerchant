import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import AnimatedLoader from "react-native-animated-loader";



export default function Loader() {

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", height: 300 }}>

            <AnimatedLoader
                visible={true}
                overlayColor="rgba(255,255,255,1)"
                source={require("../assets/26537-fffffgg.json")}
                animationStyle={styles.lottie}
                speed={1}
            >
            </AnimatedLoader>
        </View>

    )
}
const styles = StyleSheet.create({
    lottie: {
        width: 50,
        height: 50
    }
});
