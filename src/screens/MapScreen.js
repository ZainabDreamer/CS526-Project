import React, { useMemo, useState, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  Image,
  Linking,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SCREEN_NAMES } from '../constants/labels';
import { useTheme } from '../context/ThemeContext';
import { db } from '../services/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const BellIcon = ({ color = '#1F1655' }) => (
  <View style={styles.bellShapeWrap}>
    <View style={[styles.bellTop, { backgroundColor: color }]} />
    <View style={[styles.bellBody, { backgroundColor: color }]} />
    <View style={[styles.bellClapper, { backgroundColor: color }]} />
  </View>
);

const ProfileIcon = ({ color = '#1F1655' }) => (
  <View style={styles.profileMiniWrap}>
    <View style={[styles.profileHead, { backgroundColor: color }]} />
    <View style={[styles.profileBody, { backgroundColor: color }]} />
  </View>
);

const SearchIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.searchIconWrap}>
    <View style={[styles.searchCircle, { borderColor: color }]} />
    <View style={[styles.searchHandle, { backgroundColor: color }]} />
  </View>
);

const LocationPinIcon = () => (
  <View style={styles.pinWrap}>
    <View style={styles.pinCircle} />
    <View style={styles.pinTail} />
  </View>
);

const SmallLocationIcon = () => (
  <View style={styles.smallLocationWrap}>
    <View style={styles.smallLocationPin} />
    <View style={styles.smallLocationDot} />
  </View>
);

const ImagePlaceholderIcon = ({ color = '#8F8B9E', border = '#8F8B9E' }) => (
  <View style={styles.imageIconWrap}>
    <View style={[styles.imageBox, { borderColor: border }]} />
    <View style={[styles.imageSun, { backgroundColor: color }]} />
    <View style={[styles.imageHill, { backgroundColor: color }]} />
  </View>
);

const RouteIcon = ({ color = '#3B2B93' }) => (
  <View style={styles.routeIconWrap}>
    <View style={[styles.routeDotTop, { backgroundColor: color }]} />
    <View style={[styles.routeLine, { backgroundColor: color }]} />
    <View style={[styles.routeDotBottom, { backgroundColor: color }]} />
  </View>
);

const DetailsIcon = ({ color = '#FFFFFF' }) => (
  <View style={styles.detailsIconWrap}>
    <View style={[styles.detailsLineLong, { backgroundColor: color }]} />
    <View style={[styles.detailsLineShort, { backgroundColor: color }]} />
    <View style={[styles.detailsLineMid, { backgroundColor: color }]} />
  </View>
);

const SAUDI_REGION = {
  latitude: 23.8859,
  longitude: 45.0792,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

const buildGoogleMapsDirectionsUrl = ({ latitude, longitude }) => {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
};

const buildGoogleMapsSearchUrl = ({ latitude, longitude, label }) => {
  const query = encodeURIComponent(label || `${latitude},${longitude}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

const MapScreen = ({ navigation }) => {
  const { colors, darkMode } = useTheme();
  const [jobs, setJobs] = useState([]);
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(SAUDI_REGION);

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    iconBg: colors.card,
    border: darkMode ? '#312D45' : '#ECE7F7',
    muted: darkMode ? '#B7B2C9' : '#B0AEBB',
    secondaryBtnBg: darkMode ? '#2A273A' : '#F3F1FA',
    secondaryBtnBorder: darkMode ? '#3A3650' : '#E1DCF0',
    previewBg: darkMode ? '#2A273A' : '#F5F3FB',
    handleBg: darkMode ? '#4B4760' : '#DDD8EE',
    modalBg: colors.card,
    mapCardBg: colors.card,
    iconColor: darkMode ? '#F5F3FB' : '#1F1655',
    iconMuted: darkMode ? '#B7B2C9' : '#8F8B9E',
    previewBorder: darkMode ? '#3A3650' : '#ECE7F7',
    nearbyBg: '#36B487',
    nearbyText: '#FFFFFF',
    routeText: colors.primary,
    searchBtnBg: colors.card,
    backBtnBg: colors.card,
    trackText: darkMode ? '#D5D1E4' : '#6B667C',
  };

  const [showPermission, setShowPermission] = useState(true);
 useFocusEffect(
  useCallback(() => {
    const loadJobsAndLocation = async () => {
      try {
        const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
const snapshot = await getDocs(q);

const storedJobs = snapshot.docs.map((docSnap) => ({
  id: docSnap.id,
  ...docSnap.data(),
}));

console.log('FIREBASE MAP JOBS:', storedJobs);
setJobs(storedJobs);


        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === 'granted') {
          const current = await Location.getCurrentPositionAsync({});
          const coords = {
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
          };

          setUserLocation(coords);

          setMapRegion({
            ...coords,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          });
        }
      } catch (error) {
        setJobs([]);
      }
    };

    loadJobsAndLocation();
  }, [])
);

const locations = useMemo(() => {
  return jobs
    .filter(
  (job) =>
    job.location &&
    job.location.latitude != null &&
    job.location.longitude != null
)
    .map((job) => ({
      id: job.id,
      title: job.title || job.jobTitle || 'فرصة وظيفية',
      city: job.location?.city || job.city || 'موقع محدد',
      company: job.orgName || 'جهة توظيف',
      address: job.location?.address || 'موقع الوظيفة على الخريطة',
      latitude: Number(job.location.latitude),
      longitude: Number(job.location.longitude),
      isNearby: false,
      jobId: job.id,
      description: job.description || 'لا يوجد وصف متاح حالياً لهذه الوظيفة.',
      rawJob: job,
    }));
}, [jobs]);
      

  const handleAllow = useCallback(() => {
    setShowPermission(false);
  }, []);

  const handleAppOnly = useCallback(() => {
    setShowPermission(false);
  }, []);

  const handleMarkerPress = useCallback((loc) => {
    setSelectedLocation(loc);
    setMapRegion({
      latitude: loc.latitude,
      longitude: loc.longitude,
      latitudeDelta: 0.8,
      longitudeDelta: 0.8,
    });
  }, []);

  const handleOpenDirections = useCallback(async () => {
    if (!selectedLocation) return;

    const url = buildGoogleMapsDirectionsUrl({
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    });

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return;
      }

      const fallbackUrl = buildGoogleMapsSearchUrl({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        label: selectedLocation.title,
      });

      await Linking.openURL(fallbackUrl);
    } catch (error) {
      Alert.alert('تعذر فتح الخرائط', 'حدثت مشكلة أثناء محاولة فتح الاتجاهات.');
    }
  }, [selectedLocation]);

  const handleOpenDetails = useCallback(() => {
  if (!selectedLocation) {
    Alert.alert('تنبيه', 'اختاري فرصة من الخريطة أولاً.');
    return;
  }

  navigation.navigate(SCREEN_NAMES.JOB_DETAILS, {
    job: selectedLocation.rawJob,
  });
}, [navigation, selectedLocation]);

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      
      <View style={styles.headerRow}>
        <TouchableOpacity
  
  onPress={() => navigation.navigate(SCREEN_NAMES.NOTIFICATIONS)}
  activeOpacity={0.85}
>
  <BellIcon color={palette.iconColor} />
</TouchableOpacity>

        <Image
          source={require('../../assets/logo2.png')}
          style={styles.topLogo}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.iconBg }]}
          onPress={() => navigation.navigate(SCREEN_NAMES.PROFILE)}
          activeOpacity={0.85}
        >
          <ProfileIcon color={palette.iconColor} />
        </TouchableOpacity>
      </View>

      
      <View style={[styles.mapWrapper, { backgroundColor: palette.mapCardBg }]}>
        <MapView
  style={styles.map}
  region={mapRegion}
  initialRegion={SAUDI_REGION}
  showsCompass
  showsScale
  showsUserLocation={!showPermission}
  showsMyLocationButton={false}
  toolbarEnabled={false}
>
  {userLocation && (
    <Marker
      coordinate={userLocation}
      title="موقعي الحالي"
      description="أنت هنا"
      pinColor="#36B487"
    />
  )}

  {locations.map((loc) => (
    <Marker
      key={loc.id}
      coordinate={{
        latitude: loc.latitude,
        longitude: loc.longitude,
      }}
      title={loc.title}
      description={loc.city}
      onPress={() => handleMarkerPress(loc)}
    >
      <LocationPinIcon />
    </Marker>
  ))}
</MapView>
        
        <TouchableOpacity
          style={[styles.searchMapBtn, { backgroundColor: palette.searchBtnBg }]}
          activeOpacity={0.85}
        >
          <SearchIcon color={palette.iconMuted} />
        </TouchableOpacity>

       
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: palette.backBtnBg }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={[styles.backArrow, { color: palette.iconColor }]}>←</Text>
        </TouchableOpacity>

        
        <View style={[styles.bottomCard, { backgroundColor: palette.cardBg }]}>
          <View style={[styles.bottomHandle, { backgroundColor: palette.handleBg }]} />

          <View style={styles.bottomCardContent}>
  
  <View style={styles.locationInfo}>
    <Text style={[styles.locationTitle, { color: palette.text }]}>
      {selectedLocation?.title || 'اختر فرصة من الخريطة'}
    </Text>

    <View style={styles.locationRow}>
      <SmallLocationIcon />
      <Text style={[styles.locationCity, { color: palette.trackText }]}>
        {selectedLocation?.city || 'اضغط/ي على الدبوس لعرض التفاصيل'}
      </Text>
    </View>

    <Text style={[styles.moreDetails, { color: palette.muted }]}>
      {selectedLocation?.address || 'موقع الوظيفة على الخريطة'}
    </Text>

    {selectedLocation?.isNearby && (
      <View
        style={[
          styles.nearbyBadge,
          { backgroundColor: palette.nearbyBg },
        ]}
      >
        <Text
          style={[
            styles.nearbyText,
            { color: palette.nearbyText },
          ]}
        >
          قريب منك
        </Text>
      </View>
    )}
  </View>

  
  <View
    style={[
      styles.previewBox,
      {
        backgroundColor: palette.previewBg,
        borderColor: palette.previewBorder,
      },
    ]}
  >
    <ImagePlaceholderIcon
      color={palette.iconMuted}
      border={palette.iconMuted}
    />
  </View>
</View>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[
                styles.secondaryBtn,
                {
                  backgroundColor: palette.secondaryBtnBg,
                  borderColor: palette.secondaryBtnBorder,
                },
              ]}
              activeOpacity={0.88}
              onPress={handleOpenDirections}
            >
              <RouteIcon color={palette.routeText} />
              <Text style={[styles.secondaryBtnText, { color: palette.routeText }]}>
                ابدأ المسار
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: palette.primary }]}
              activeOpacity={0.88}
              onPress={handleOpenDetails}
            >
              <DetailsIcon color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>عرض التفاصيل</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      
      <Modal visible={showPermission} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: palette.modalBg }]}>
            <View style={styles.modalMapPreview}>
              <MapView
                style={styles.modalMap}
                initialRegion={SAUDI_REGION}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                toolbarEnabled={false}
              >
                {locations.slice(0, 3).map((loc) => (
                  <Marker
                    key={`modal-${loc.id}`}
                    coordinate={{
                      latitude: loc.latitude,
                      longitude: loc.longitude,
                    }}
                  >
                    <LocationPinIcon />
                  </Marker>
                ))}
              </MapView>
            </View>

            <Text style={[styles.modalText, { color: palette.text }]}>
              للحصول على فرص مناسبة في تطبيق{'\n'}
              <Text style={styles.modalAppName}>شمولية</Text>
              {'\n'}
              اسمح بالوصول إلى موقعك
            </Text>

            <TouchableOpacity
              style={[styles.allowBtn, { backgroundColor: palette.primary }]}
              onPress={handleAllow}
              activeOpacity={0.88}
            >
              <Text style={styles.allowText}>السماح</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.appOnlyBtn,
                { borderColor: palette.primary, backgroundColor: palette.cardBg },
              ]}
              onPress={handleAppOnly}
              activeOpacity={0.88}
            >
              <Text style={[styles.appOnlyText, { color: palette.primary }]}>
                السماح داخل التطبيق فقط
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    minHeight: 44,
    paddingHorizontal: 25,
    paddingTop: 52,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  topLogo: {
    width: 120,
    height: 60,
  },

  bellShapeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },

  bellTop: {
    width: 8,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    marginBottom: 1,
  },

  bellBody: {
    width: 14,
    height: 11,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  bellClapper: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 1,
  },

  profileMiniWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 2,
  },

  profileBody: {
    width: 12,
    height: 6,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },

  mapWrapper: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  map: {
    flex: 1,
  },

  searchMapBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  backArrow: {
    fontSize: 22,
    fontWeight: '700',
  },

  bottomCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
  },

  bottomHandle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 10,
    marginBottom: 14,
  },

  bottomCardContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 14,
  },

  locationInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 14,
  },

  locationTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingHorizontal: 10,

  },

  locationRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 6,
  },

  smallLocationWrap: {
    width: 14,
    height: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 6,
    position: 'relative',
  },

  smallLocationPin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D94A4A',
  },

  smallLocationDot: {
    width: 2,
    height: 6,
    backgroundColor: '#7B6E8D',
    marginTop: 1,
    borderRadius: 2,
  },

  locationCity: {
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '700',
  },

  moreDetails: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
    writingDirection: 'rtl',
    paddingHorizontal: 10,

  },

  nearbyBadge: {
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-end',
  },

  nearbyText: {
    fontSize: 11,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  previewBox: {
    width: 92,
    height: 78,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  imageIconWrap: {
    width: 38,
    height: 30,
    position: 'relative',
  },

  imageBox: {
    position: 'absolute',
    width: 38,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    bottom: 0,
  },

  imageSun: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    top: 7,
    right: 7,
  },

  imageHill: {
    position: 'absolute',
    width: 18,
    height: 10,
    bottom: 4,
    left: 7,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  actionButtonsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 10,
  },

  primaryBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
  },

  secondaryBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
    borderWidth: 1,
  },

  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    writingDirection: 'rtl',
    marginLeft: 8,
  },

  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    writingDirection: 'rtl',
    marginLeft: 8,
  },

  routeIconWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  routeDotTop: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  routeLine: {
    width: 2,
    height: 6,
    marginVertical: 1,
  },

  routeDotBottom: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  detailsIconWrap: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  detailsLineLong: {
    width: 12,
    height: 2,
    borderRadius: 2,
    marginBottom: 2,
  },

  detailsLineShort: {
    width: 8,
    height: 2,
    borderRadius: 2,
    marginBottom: 2,
  },

  detailsLineMid: {
    width: 10,
    height: 2,
    borderRadius: 2,
  },

  pinWrap: {
    width: 26,
    height: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  pinCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D94A4A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  pinTail: {
    width: 4,
    height: 10,
    backgroundColor: '#D94A4A',
    marginTop: -1,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },

  searchIconWrap: {
    width: 16,
    height: 16,
    position: 'relative',
  },

  searchCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.8,
    position: 'absolute',
    top: 0,
    left: 0,
  },

  searchHandle: {
    width: 7,
    height: 1.8,
    position: 'absolute',
    right: 0,
    bottom: 2,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 18,
  },

  modalMapPreview: {
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    backgroundColor: '#F1EEF8',
  },

  modalMap: {
    flex: 1,
  },

  modalText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 18,
    writingDirection: 'rtl',
  },

  modalAppName: {
    color: '#36B487',
    fontWeight: '800',
  },

  allowBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },

  allowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  appOnlyBtn: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },

  appOnlyText: {
    fontSize: 15,
    fontWeight: '800',
    writingDirection: 'rtl',
  },
});

export default MapScreen;