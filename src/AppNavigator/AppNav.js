import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../Loader';
import DashboardStack from './Dashboard/DashboardStack';
import ProfileStack from './Profile/ProfileStack';

const Tab = createBottomTabNavigator();
export default function AppNav() {
    const [isRendered, setRendered] = useState(true);

    return (
        <View style={{ flex: 1 }}>
            {
                isRendered ? <Tab.Navigator

                    backBehavior='none'
                    initialRouteName='Dashboard'
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            if (route.name === 'Dashboard') {
                                iconName = focused
                                    ? 'home'
                                    : 'home-outline';
                            }
                            return <Icon name={iconName} size={size} color={color} />;
                        },
                    })}
                    tabBarOptions={{
                        fontFamily: 'ManropeMedium',
                        activeBackgroundColor: '#FFDC3D',
                        activeTintColor: '#3e2465',
                        inactiveTintColor: 'gray',
                        labelStyle: {
                            fontSize: 12,
                            fontWeight: 'bold',
                            fontFamily: 'ManropeMedium',
                            color: '#3e2465'
                        }
                    }}
                >
                    <Tab.Screen name="Dashboard" component={DashboardStack} />
                    <Tab.Screen name="Account" component={ProfileStack} options={{

                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="account-circle" size={25} color={color} options={() => ({
                                tabBarIcon: ({ color, focused, size }) => (
                                    <Icon name={focused ? 'account-circle' : 'account-circle-outline'} color={color} size={size} />
                                ),
                            })} />
                        ),
                    }} />

                </Tab.Navigator> : <Loader />
            }

        </View>
    )

}
