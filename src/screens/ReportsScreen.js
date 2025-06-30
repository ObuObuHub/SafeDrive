import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const [weeklyData, setWeeklyData] = useState({
    trips: 0,
    distance: 0,
    safetyScore: 0,
    harshEvents: 0,
    improvements: []
  });

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      // In a real app, this would load from a database
      // For now, we'll use mock data and AsyncStorage values
      const safetyScore = await AsyncStorage.getItem('safetyScore');
      const completedLessons = await AsyncStorage.getItem('completedLessons');
      
      setWeeklyData({
        trips: 12,
        distance: 245.3,
        safetyScore: safetyScore ? parseInt(safetyScore) : 75,
        harshEvents: 8,
        improvements: [
          { metric: 'Harsh Braking', change: -30, positive: true },
          { metric: 'Speeding Events', change: -15, positive: true },
          { metric: 'Phone Usage', change: -50, positive: true },
          { metric: 'Night Driving Score', change: +10, positive: true }
        ]
      });
    } catch (error) {
      console.error('Error loading report data:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC107';
    return '#F44336';
  };

  const renderProgressBar = (value, maxValue, label) => {
    const percentage = (value / maxValue) * 100;
    return (
      <View style={styles.progressItem}>
        <Text style={styles.progressLabel}>{label}</Text>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBarFill,
              { width: `${percentage}%`, backgroundColor: getScoreColor(percentage) }
            ]} 
          />
        </View>
        <Text style={styles.progressValue}>{value}/{maxValue}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Driving Report</Text>
        <Text style={styles.headerSubtitle}>Last 7 days</Text>
      </View>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreTitle}>Overall Safety Score</Text>
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreValue, { color: getScoreColor(weeklyData.safetyScore) }]}>
            {weeklyData.safetyScore}
          </Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <Text style={styles.scoreMessage}>
          {weeklyData.safetyScore >= 80 ? 'Excellent driving!' : 
           weeklyData.safetyScore >= 60 ? 'Good, but room to improve' : 
           'Focus on safety lessons'}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🚗</Text>
          <Text style={styles.statValue}>{weeklyData.trips}</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📍</Text>
          <Text style={styles.statValue}>{weeklyData.distance.toFixed(1)}</Text>
          <Text style={styles.statLabel}>km Driven</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⚠️</Text>
          <Text style={styles.statValue}>{weeklyData.harshEvents}</Text>
          <Text style={styles.statLabel}>Harsh Events</Text>
        </View>
      </View>

      <View style={styles.improvementsCard}>
        <Text style={styles.sectionTitle}>Weekly Improvements</Text>
        {weeklyData.improvements.map((item, index) => (
          <View key={index} style={styles.improvementItem}>
            <Text style={styles.improvementMetric}>{item.metric}</Text>
            <Text style={[
              styles.improvementChange,
              { color: item.positive ? '#4CAF50' : '#F44336' }
            ]}>
              {item.change > 0 ? '+' : ''}{item.change}%
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.comparisonCard}>
        <Text style={styles.sectionTitle}>How You Compare</Text>
        <Text style={styles.comparisonText}>
          Your safety score is better than 65% of drivers in your area
        </Text>
        {renderProgressBar(65, 100, 'Your Ranking')}
      </View>

      <View style={styles.tipsCard}>
        <Text style={styles.sectionTitle}>Personalized Tips</Text>
        <Text style={styles.tipItem}>
          • Your harsh braking has improved! Keep maintaining safe following distance
        </Text>
        <Text style={styles.tipItem}>
          • Night driving score could improve - review the night driving lesson
        </Text>
        <Text style={styles.tipItem}>
          • Great job avoiding phone use while driving!
        </Text>
      </View>

      <View style={styles.goalsCard}>
        <Text style={styles.sectionTitle}>Weekly Goals</Text>
        {renderProgressBar(8, 10, 'Complete 10 trips safely')}
        {renderProgressBar(3, 5, 'Finish 5 safety lessons')}
        {renderProgressBar(weeklyData.safetyScore, 85, 'Reach 85 safety score')}
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
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  scoreCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreMax: {
    fontSize: 20,
    color: '#666',
  },
  scoreMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    width: (width - 50) / 3,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  improvementsCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  improvementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  improvementMetric: {
    fontSize: 16,
    color: '#555',
  },
  improvementChange: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  comparisonCard: {
    backgroundColor: '#E8F5E9',
    margin: 15,
    padding: 20,
    borderRadius: 10,
  },
  comparisonText: {
    fontSize: 16,
    color: '#2E7D32',
    marginBottom: 15,
    lineHeight: 22,
  },
  progressItem: {
    marginBottom: 15,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'right',
  },
  tipsCard: {
    backgroundColor: '#FFF3E0',
    margin: 15,
    padding: 20,
    borderRadius: 10,
  },
  tipItem: {
    fontSize: 14,
    color: '#E65100',
    marginBottom: 10,
    lineHeight: 20,
  },
  goalsCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 30,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
});