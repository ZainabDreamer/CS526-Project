import React, { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';

import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';

// Single star display
const Star = ({ filled }) => (
  <Text style={{ color: filled ? '#F39A57' : '#CCC', fontSize: 16 }}>★</Text>
);

// Evaluation card component
const EvaluationCard = ({ item, colors }) => {
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* Header */}
      <View style={styles.rowBetween}>
        <Text style={[styles.company, { color: colors.text }]}>
          {item.company?.name}
        </Text>

        <Text style={[styles.date, { color: colors.subText }]}>
          {item.createdAt?.toDate
            ? item.createdAt.toDate().toLocaleDateString()
            : ''}
        </Text>
      </View>

      {/* Rating */}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= item.rating} />
        ))}
      </View>

      {/* Notes */}
      <Text style={[styles.text, { color: colors.text }]}>
        {item.notes}
      </Text>

      {/* Extra information */}
      <View style={styles.extraBox}>
        <Text style={[styles.extraText, { color: colors.subText }]}>
          التهيئة: {item.isReady}
        </Text>

        <Text style={[styles.extraText, { color: colors.subText }]}>
          التعامل: {item.treatment}
        </Text>
      </View>
    </View>
  );
};

const EvaluationListScreen = ({ navigation }) => {
  const { colors, darkMode } = useTheme();
  const { user } = useContext(AuthContext);

  // Screen states
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load user evaluations from Firebase
  const loadData = async () => {
    try {
      const userId = user?.uid || user?.id;

      if (!userId) {
        setEvaluations([]);
        return;
      }

      const q = query(
        collection(db, 'evaluations'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setEvaluations(data);
    } catch (e) {
      console.log('LOAD FIREBASE EVALUATIONS ERROR', e);
      setEvaluations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Reload data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user])
  );

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <AppHeader navigation={navigation} title="التقييمات" />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={evaluations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <EvaluationCard item={item} colors={colors} />
          )}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.subText }]}>
              لا يوجد تقييمات حتى الآن
            </Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loader: {
    marginTop: 40,
  },

  listContent: {
    padding: 20,
  },

  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  rowBetween: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  company: {
    fontSize: 15,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  date: {
    fontSize: 12,
  },

  starsRow: {
    flexDirection: 'row-reverse',
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  extraBox: {
    marginTop: 6,
  },

  extraText: {
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});

export default EvaluationListScreen;
