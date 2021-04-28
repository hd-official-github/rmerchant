import React from 'react'

import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import Verifyemail from './Verifyemail';
import LoginScreen from './LoginScreen';
import GarageInfo from './GarageInfo';
import GarageDocs from './GarageDocs';
import Waiting from './Waiting';


export default function LoginStack() {

    const navopts = () => ({
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    });

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={navopts} />
            <Stack.Screen name="VerifyEmail" component={Verifyemail} options={navopts} />
            <Stack.Screen name="GarageInfo" component={GarageInfo} options={navopts} />
            <Stack.Screen name="GarageDocs" component={GarageDocs} options={navopts} />
            <Stack.Screen name="Waiting" component={Waiting} options={navopts} />
        </Stack.Navigator>
    );
}
