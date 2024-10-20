// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './components/Login'; // Asegúrate de que la ruta sea correcta
import Home from './components/Home'; // Asegúrate de que la ruta sea correcta
import CodeBar from './components/CodeBar';
import StoreCodBarOffline from './components/StoreCodBarOffline';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="CodeBar" component={CodeBar} />
                <Stack.Screen name="StoreCodBarOffline" component={StoreCodBarOffline} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
