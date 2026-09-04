import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';

const API_BASE_URL = 'http://localhost:5050/api';

export default function App() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSalon, setSelectedSalon] = useState(null);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/salons`);
      const data = await response.json();
      if (data.success) {
        setSalons(data.salons);
      }
    } catch (err) {
      console.warn('Mobile API connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AZHAGU MOBILE</Text>
        <Text style={styles.headerSubtitle}>South India Salon Booking App</Text>
      </View>

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loaderText}>Connecting to Azhagu Backend REST API...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Featured South Indian Salons</Text>
          {salons.map((salon) => (
            <TouchableOpacity
              key={salon.id}
              style={styles.card}
              onPress={() => Alert.alert('Salon Selected', `Book instant appointments at ${salon.name}`)}
            >
              <Text style={styles.salonName}>{salon.name}</Text>
              <Text style={styles.salonCity}>{salon.city}, {salon.state}</Text>
              <Text style={styles.salonRating}>⭐ {salon.rating} ({salon.review_count} Reviews)</Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Appointment</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#09090b', alignItems: 'center' },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  headerSubtitle: { color: '#a1a1aa', fontSize: 11, marginTop: 2 },
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#09090b' },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 6, marginBottom: 12, borderWidth: 1, borderColor: '#e4e4e7' },
  salonName: { fontSize: 15, fontWeight: 'bold', color: '#09090b' },
  salonCity: { fontSize: 12, color: '#71717a', marginVertical: 4 },
  salonRating: { fontSize: 12, color: '#059669', fontWeight: '600' },
  bookButton: { backgroundColor: '#09090b', padding: 10, borderRadius: 4, marginTop: 12, alignItems: 'center' },
  bookButtonText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  loaderCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loaderText: { marginTop: 12, fontSize: 12, color: '#71717a' }
});
