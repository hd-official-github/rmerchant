import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import DashboardScreen from './DashboardScreen';



const Stack = createStackNavigator();
export default function DashboardStack() {
    return (
        <Stack.Navigator initialRouteName="DashboardScreen" screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, }}>
            <Stack.Screen name="DashboardScreen" component={DashboardScreen} />

        </Stack.Navigator>
    )
}
