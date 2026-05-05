import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const PickLocationScreen = ({ navigation, route }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelect = async (e) => {
  const coords = e.nativeEvent.coordinate;

  try {
    const result = await Location.reverseGeocodeAsync(coords);

    const place = result[0];

    setSelectedLocation({
      latitude: coords.latitude,
      longitude: coords.longitude,
      city: place?.city || place?.region || 'غير محدد',
      address: `${place?.name || ''} ${place?.street || ''}`,
    });
  } catch (error) {
    setSelectedLocation({
      latitude: coords.latitude,
      longitude: coords.longitude,
      city: 'غير محدد',
      address: 'موقع محدد على الخريطة',
    });
  }
  
};
  const handleConfirm = () => {
    if (!selectedLocation) return;

    // يرجع الموقع للشاشة السابقة
    route.params?.onSelect?.(selectedLocation);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
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
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>

      <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
        <Text style={styles.btnText}>تأكيد الموقع</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PickLocationScreen;

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
