import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DrivingScreen({ navigation }) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [safetyAlerts, setSafetyAlerts] = useState([]);
  const [tripDistance, setTripDistance] = useState(0);
  const [tripDuration, setTripDuration] = useState(0);
  const [harshEvents, setHarshEvents] = useState({ braking: 0, acceleration: 0 });
  
  const locationSubscription = useRef(null);
  const startTime = useRef(null);
  const previousLocation = useRef(null);
  const speedHistory = useRef([]);
  const timerInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Background location is required for trip recording');
        return;
      }

      setIsRecording(true);
      startTime.current = Date.now();
      speedHistory.current = [];
      
      // Start timer
      timerInterval.current = setInterval(() => {
        setTripDuration(Math.floor((Date.now() - startTime.current) / 1000));
      }, 1000);

      // Start location tracking
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (location) => {
          const speed = location.coords.speed * 3.6; // Convert m/s to km/h
          setCurrentSpeed(Math.round(speed));
          
          // Calculate distance
          if (previousLocation.current) {
            const distance = calculateDistance(
              previousLocation.current.coords,
              location.coords
            );
            setTripDistance(prev => prev + distance);
          }
          
          // Check for harsh events
          checkHarshEvents(speed);
          
          // Check for safety alerts
          checkSafetyAlerts(location, speed);
          
          previousLocation.current = location;
          speedHistory.current.push(speed);
        }
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
      console.error(error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
    
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    // Calculate trip score
    const score = calculateTripScore();
    
    // Save trip data
    await saveTripData(score);
    
    Alert.alert(
      'Trip Completed',
      `Your safety score: ${score}/100\nDistance: ${tripDistance.toFixed(1)} km\nDuration: ${formatDuration(tripDuration)}`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const checkHarshEvents = (currentSpeed) => {
    if (speedHistory.current.length < 2) return;
    
    const previousSpeed = speedHistory.current[speedHistory.current.length - 2];
    const acceleration = (currentSpeed - previousSpeed) / 3.6; // m/s²
    
    if (acceleration < -4) {
      setHarshEvents(prev => ({ ...prev, braking: prev.braking + 1 }));
      addAlert('Harsh braking detected! Keep safe distance');
    } else if (acceleration > 3) {
      setHarshEvents(prev => ({ ...prev, acceleration: prev.acceleration + 1 }));
      addAlert('Rapid acceleration detected! Drive smoothly');
    }
  };

  const checkSafetyAlerts = (location, speed) => {
    // Speed limit check (simplified - in real app would use map data)
    if (speed > 50 && location.coords.altitude < 100) {
      addAlert('Speed limit reminder: Urban areas typically 50 km/h');
    } else if (speed > 90) {
      addAlert('High speed detected! Romanian rural roads: max 90 km/h');
    }
  };

  const addAlert = (message) => {
    setSafetyAlerts(prev => [...prev.slice(-4), { message, time: new Date() }]);
  };

  const calculateDistance = (coords1, coords2) => {
    const R = 6371; // Earth radius in km
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toRad = (value) => value * Math.PI / 180;

  const calculateTripScore = () => {
    let score = 100;
    score -= harshEvents.braking * 5;
    score -= harshEvents.acceleration * 5;
    
    // Penalty for speeding
    const avgSpeed = speedHistory.current.reduce((a, b) => a + b, 0) / speedHistory.current.length;
    if (avgSpeed > 90) score -= 20;
    else if (avgSpeed > 70) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const saveTripData = async (score) => {
    try {
      await AsyncStorage.setItem('lastDriveScore', score.toString());
      const currentScore = await AsyncStorage.getItem('safetyScore');
      const newScore = currentScore ? Math.round((parseInt(currentScore) + score) / 2) : score;
      await AsyncStorage.setItem('safetyScore', newScore.toString());
    } catch (error) {
      console.error('Error saving trip data:', error);
    }
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.speedContainer}>
        <Text style={styles.speedValue}>{currentSpeed}</Text>
        <Text style={styles.speedUnit}>km/h</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{tripDistance.toFixed(1)} km</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{formatDuration(tripDuration)}</Text>
        </View>
      </View>

      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>Harsh Events</Text>
        <View style={styles.eventsRow}>
          <View style={styles.eventItem}>
            <Text style={styles.eventIcon}>🛑</Text>
            <Text style={styles.eventCount}>{harshEvents.braking}</Text>
            <Text style={styles.eventLabel}>Braking</Text>
          </View>
          <View style={styles.eventItem}>
            <Text style={styles.eventIcon}>🚀</Text>
            <Text style={styles.eventCount}>{harshEvents.acceleration}</Text>
            <Text style={styles.eventLabel}>Acceleration</Text>
          </View>
        </View>
      </View>

      <View style={styles.alertsContainer}>
        <Text style={styles.alertsTitle}>Safety Alerts</Text>
        {safetyAlerts.map((alert, index) => (
          <Text key={index} style={styles.alertText}>• {alert.message}</Text>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.recordButton, isRecording && styles.recordButtonActive]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.recordButtonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  speedContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  speedValue: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  speedUnit: {
    fontSize: 24,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  eventsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  eventsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  eventItem: {
    alignItems: 'center',
  },
  eventIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  eventCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  eventLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  alertsContainer: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    minHeight: 100,
  },
  alertsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 10,
  },
  alertText: {
    fontSize: 14,
    color: '#BF360C',
    marginBottom: 5,
  },
  recordButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
  },
  recordButtonActive: {
    backgroundColor: '#D32F2F',
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});