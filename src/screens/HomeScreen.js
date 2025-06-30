import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [dailyTip, setDailyTip] = useState('');
  const [safetyScore, setSafetyScore] = useState(0);
  const [lastDriveScore, setLastDriveScore] = useState(null);

  const safetyTips = [
    "Keep a 2-second following distance in good weather, 4 seconds in rain",
    "39% of Romanian traffic fatalities are pedestrians - always check crosswalks",
    "Rural roads account for 52% of fatalities - reduce speed on country roads",
    "Check your mirrors every 5-8 seconds to maintain situational awareness",
    "Avoid using your phone - you're 4x more likely to crash when distracted",
    "Most accidents happen during evening hours - use extra caution after dark",
    "Speeding causes 733 accidents yearly in Romania - respect speed limits",
    "Always yield to pedestrians - it prevents 364 accidents annually",
    "Weather affects visibility - reduce speed by 1/3 in rain, 1/2 in snow",
    "Intersection accidents are common - look twice before proceeding"
  ];

  useEffect(() => {
    loadUserData();
    setDailyTip(safetyTips[new Date().getDate() % safetyTips.length]);
  }, []);

  const loadUserData = async () => {
    try {
      const score = await AsyncStorage.getItem('safetyScore');
      const lastScore = await AsyncStorage.getItem('lastDriveScore');
      if (score) setSafetyScore(parseInt(score));
      if (lastScore) setLastDriveScore(parseInt(lastScore));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const startDriving = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Location permission is needed for driving mode');
      return;
    }
    navigation.navigate('Driving');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, Safe Driver!</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Your Safety Score</Text>
          <Text style={styles.scoreValue}>{safetyScore}/100</Text>
        </View>
      </View>

      <View style={styles.tipContainer}>
        <Text style={styles.tipTitle}>Today's Safety Tip</Text>
        <Text style={styles.tipText}>{dailyTip}</Text>
      </View>

      {lastDriveScore && (
        <View style={styles.lastDriveContainer}>
          <Text style={styles.lastDriveText}>
            Last Drive Score: {lastDriveScore}/100
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.mainButton} onPress={startDriving}>
          <Text style={styles.mainButtonText}>Start Driving</Text>
        </TouchableOpacity>

        <View style={styles.menuGrid}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate('Lessons')}
          >
            <Text style={styles.menuButtonText}>📚</Text>
            <Text style={styles.menuLabel}>Lessons</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate('Reports')}
          >
            <Text style={styles.menuButtonText}>📊</Text>
            <Text style={styles.menuLabel}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => Alert.alert('Emergency', 'Call 112 for emergencies')}
          >
            <Text style={styles.menuButtonText}>🆘</Text>
            <Text style={styles.menuLabel}>Emergency</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.menuButtonText}>⚙️</Text>
            <Text style={styles.menuLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Romanian Road Safety Facts</Text>
        <Text style={styles.statsText}>• 77 fatalities per million inhabitants (2024)</Text>
        <Text style={styles.statsText}>• EU average: 46 per million</Text>
        <Text style={styles.statsText}>• Together, we can improve these numbers!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 30,
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  scoreValue: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  tipContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  lastDriveContainer: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  lastDriveText: {
    fontSize: 16,
    color: '#2E7D32',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 15,
  },
  mainButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 30,
    elevation: 5,
    marginBottom: 20,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuButton: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 32,
    marginBottom: 5,
  },
  menuLabel: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    backgroundColor: '#FFF3E0',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#BF360C',
    marginBottom: 5,
  },
});