// ================== IMPORTS ==================
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// ================== MAIN SCREEN ==================
const PickLocationScreen = ({ navigation, route }) => {

  // ================== STATE ==================
  const [selectedLocation, setSelectedLocation] = useState(null);

  // ================== HANDLE MAP PRESS ==================
  const handleSelect = async (e) => {
    const coords = e.nativeEvent.coordinate;

    try {
      // Reverse geocode to get address details
      const result = await Location.reverseGeocodeAsync(coords);

      const place = result[0];

      // Save selected location with address info
      setSelectedLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        city: place?.city || place?.region || 'غير محدد',
        address: `${place?.name || ''} ${place?.street || ''}`,
      });
    } catch (error) {
      // Fallback if reverse geocoding fails
      setSelectedLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        city: 'غير محدد',
        address: 'موقع محدد على الخريطة',
      });
    }
  };

  // ================== CONFIRM LOCATION ==================
  const handleConfirm = () => {
    if (!selectedLocation) return;

    // Return selected location to previous screen
    route.params?.onSelect?.(selectedLocation);
    navigation.goBack();
  };

  // ================== UI ==================
  return (
    <View style={styles.container}>
      {/* Map component */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 26.4207,
          longitude: 50.0888,
          latitudeDelta: 2.8,
          longitudeDelta: 2.8,
        }}
        onPress={handleSelect}
      >
        {/* Marker appears when user selects location */}
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>

      {/* Confirm button */}
      <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
        <Text style={styles.btnText}>تأكيد الموقع</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PickLocationScreen;

// ================== STYLES ==================
const styles = StyleSheet.create({
  container: { flex: 1 },

  map: { flex: 1 },

  btn: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#4B3F72',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 20,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
