

import React from 'react';
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import LoginStack from './src/Login/LoginStack';
import AppNav from './src/AppNavigator/AppNav';
import Splash from './Splash';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const Stack = createStackNavigator();
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#000',
    accent: '#000',
  },
  fontFamily: { ...DefaultTheme.fonts.regular.fontFamily = 'ManropeMedium' }
};
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <View style={{
          flex: 1
        }}>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Login" component={LoginStack} />
            <Stack.Screen name="Home" component={AppNav} />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </PaperProvider>

  );
}
