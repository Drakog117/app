import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
    const navigation = useNavigation();

    const handleLogout = async () => {
        await AsyncStorage.removeItem('username');
        navigation.navigate('Login'); // Navegar a la pantalla de Login
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
            <Button
                title="Escanear Código"
                onPress={() => navigation.navigate('CodeBar')}
            />
            <TouchableOpacity
                style={[styles.button, styles.logoutButton]}
                onPress={handleLogout}
            >
                <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: '#FF0000',
        marginBottom: 0,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
