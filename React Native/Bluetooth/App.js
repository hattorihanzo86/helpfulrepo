import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import BleManager from 'react-native-ble-plx';

const App = () => {
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    BleManager.start({ showAlert: false }).then(() => {
      setIsBluetoothOn(true);
    });

    return () => {
      BleManager.destroy();
    };
  }, []);

  const scanDevices = () => {
    BleManager.scan([], 5, true)
      .then((results) => {
        setDevices(results);
      })
      .catch((error) => {
        console.error('Error scanning devices:', error);
      });
  };

  const connectToDevice = (device) => {
    BleManager.connect(device.id)
      .then(() => {
        console.log('Connected to device:', device.name);
        readDeviceCharacteristics(device);
      })
      .catch((error) => {
        console.error('Error connecting to device:', error);
      });
  };

  const readDeviceCharacteristics = (device) => {
    BleManager.retrieveServices(device.id)
      .then((peripheralInfo) => {
        console.log('Peripheral Info:', peripheralInfo);
        const characteristics = peripheralInfo.characteristics;
        // Now you can read the characteristics of the device and perform actions based on it
      })
      .catch((error) => {
        console.error('Error retrieving characteristics:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Example</Text>
      <Text>{isBluetoothOn ? 'Bluetooth is ON' : 'Bluetooth is OFF'}</Text>
      <Button title="Scan Devices" onPress={scanDevices} />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.name || 'Unnamed Device'}
            onPress={() => connectToDevice(item)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;
