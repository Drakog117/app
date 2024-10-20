// StoreCodBarOffline.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://192.168.100.40:8080', // Reemplaza con la IP de tu máquina
    timeout: 10000, // Tiempo de espera en milisegundos
});

export default function StoreCodBarOffline({ navigation }) {
    const [nameBarCode, setBarcodes] = useState([]);

    useEffect(() => {
        const fetchBarcodes = async () => {
            try {
                const storedBarcodes = JSON.parse(await AsyncStorage.getItem('nameBarCode')) || [];
                setBarcodes(storedBarcodes);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBarcodes();
    }, []);
    
    const handleSendBarcodes = async () => {
        try {
            // Recuperar los códigos almacenados en AsyncStorage
            const storedBarcodes = JSON.parse(await AsyncStorage.getItem('nameBarCode')) || [];
    
            if (storedBarcodes.length === 0) {
                Alert.alert('Error', 'No hay códigos almacenados para enviar');
                return;
            }
    
            // Recuperar el usuario almacenado en AsyncStorage
            const storedUsername = await AsyncStorage.getItem('username');
            
            // Enviar los códigos y el usuario al backend
            console.log(nameBarCode);
            console.log(storedUsername);
            const response = await axiosInstance.post('/auth/storeCodeBar', {
                nameBarCode: storedBarcodes, // Asegúrate de que el nombre coincida
                username: storedUsername, // Incluye el nombre de usuario
                
                
            });
    
            if (response.status === 201) {
                Alert.alert('Éxito', 'Códigos enviados correctamente');
                // Limpiar los códigos almacenados en AsyncStorage
                await AsyncStorage.removeItem('nameBarCode');
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', 'No se pudieron enviar los códigos');
                console.log(response.status);
                
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un problema al enviar los códigos');
            console.error(error);
        }
    };
      
    
    const handleDelete = async (code) => {
        Alert.alert(
            'Eliminar código',
            `¿Estás seguro de que quieres eliminar el código ${code}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        try {
                            const updatednameBarCode = nameBarCode.filter((item) => item !== code);
                            await AsyncStorage.setItem('nameBarCode', JSON.stringify(updatedBarcodes));
                            setBarcodes(updatedBarcodes);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    const handleRefresh = () => {
        fetchData(); // Vuelve a cargar los datos al hacer click
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={nameBarCode}
                keyExtractor={(item, index) => `${item}-${index}`}  // Usa una combinación del código y el índice para asegurar claves únicas
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.text}>{item}</Text>
                        <TouchableOpacity onPress={() => handleDelete(item)}>
                            <Text style={styles.delete}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
    
            <TouchableOpacity style={styles.sendButton} onPress={handleSendBarcodes}>
                <Text style={styles.buttonText}>Enviar códigos al servidor</Text>
            </TouchableOpacity>
    
            <TouchableOpacity style={styles.scanButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Volver a escanear</Text>
            </TouchableOpacity>
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    text: {
        fontSize: 16,
    },
    delete: {
        color: 'red',
        fontSize: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    sendButton: {
        backgroundColor: '#28a745', // Color verde para el botón de enviar
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    scanButton: {
        backgroundColor: '#007bff', // Color azul para el botón de escanear
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
});
