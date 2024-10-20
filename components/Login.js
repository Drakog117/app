// components/Login.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Axios con baseURL
const axiosInstance = axios.create({
    baseURL: 'http://192.168.100.40:8080', // Reemplaza con la IP de tu máquina
    timeout: 10000, // Tiempo de espera en milisegundos
});

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation(); // Hook para la navegación

    useEffect(() => {
        const checkLoginStatus = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) {
                // Si hay un usuario almacenado, navega a la pantalla Home
                navigation.navigate('Home');
            }
        };

        checkLoginStatus();
    }, [navigation]); // Asegúrate de incluir `navigation` en las dependencias

    const handleLogin = async () => {
        try {
            const response = await axiosInstance.post('/auth/login', {
                username: username,
                password: password,
            });

            if (response.status === 200) {
                Alert.alert('Éxito', 'Inicio de sesión exitoso');

                // Guarda el usuario en AsyncStorage
                await AsyncStorage.setItem('username', username); // Almacena el nombre de usuario

                // Navegar a la pantalla Home después del inicio de sesión exitoso
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', 'Usuario o contraseña incorrectos');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo conectar con el servidor');
            console.error(error);
        }
    };

    const handleOfflineLogin = async () => {
        try {
            Alert.alert('Escanea y guarda sin conexión');
            // Navegar a la pantalla Home después del inicio de sesión exitoso
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Error', 'No se pudo conectar con el servidor');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Image style={styles.tinyLogo} source={require('./logo.png')} />

            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                style={[styles.input, { borderColor: '#F18226' }]} // Borde naranja
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={[styles.input, { borderColor: '#F18226' }]} // También aquí
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity
                style={[styles.button, styles.loginButton]}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.offlineButton]}
                onPress={() => navigation.navigate('CodeBar')}
            >
                <Text style={styles.buttonText}>Escanear sin conexión</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.offlineButton]}
                onPress={() => navigation.navigate('StoreCodBarOffline')}
            >
                <Text style={styles.buttonText}>Revisa tus códigos sin subir</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'white', // Fondo blanco
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        // Puedes ajustar la tipografía aquí
    },
    input: {
        height: 40,
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        // Puedes ajustar el color del texto aquí
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15, // Espacio entre botones
    },
    loginButton: {
        backgroundColor: '#F18226', // Color naranja para el botón de login
    },
    offlineButton: {
        backgroundColor: '#0000ff', // Color azul para el botón de escanear
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    }
});
