import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function CodeBar() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        if (!scanned) {
            setScanned(true);
            setScannedData({ type, data });
            Alert.alert(
                'Código escaneado!',
                `Tipo: ${type}\nDatos: ${data}`,
                [
                    {
                        text: 'Guardar',
                        onPress: async () => {
                            try {
                                const existingBarcodes = JSON.parse(await AsyncStorage.getItem('nameBarCode')) || [];
                                existingBarcodes.push(data);
                                await AsyncStorage.setItem('nameBarCode', JSON.stringify(existingBarcodes));
                                setScanned(false);
                                setScannedData(null);
                            } catch (error) {
                                console.error(error);
                            }
                        }
                    },
                    {
                        text: 'Cancelar',
                        onPress: () => {
                            setScanned(false);
                            setScannedData(null);
                        },
                        style: 'cancel'
                    }
                ]
            );
        }
    };

    if (hasPermission === null) {
        return <Text>Solicitando permiso de cámara...</Text>;
    }
    if (hasPermission === false) {
        return <Text>Acceso a la cámara denegado</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
                <Button title={'Escanear otro código'} onPress={() => setScanned(false)} />
            )}
            <TouchableOpacity
                style={styles.viewCodesButton}
                onPress={() => navigation.navigate('StoreCodBarOffline')}
            >
                <Text style={styles.viewCodesText}>Ver códigos escaneados</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    viewCodesButton: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 15,
        backgroundColor: '#0000ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewCodesText: {
        color: '#ffffff',
        fontSize: 16,
    },
});
