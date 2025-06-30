import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: {
      dailyTips: true,
      tripReminders: true,
      weeklyReports: true,
      safetyAlerts: true,
    },
    driving: {
      autoStart: false,
      voiceAlerts: true,
      speedWarnings: true,
      harshEventAlerts: true,
    },
    privacy: {
      shareAnonymousData: true,
      locationHistory: true,
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSetting = (category, setting, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    };
    setSettings(newSettings);
    saveSettings(newSettings);

    // Handle notification permissions
    if (category === 'notifications' && value === true) {
      requestNotificationPermissions();
    }
  };

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please enable notifications in your device settings');
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will reset all your progress, scores, and settings. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Success', 'All data has been cleared');
            // Reset to default settings
            loadSettings();
          }
        }
      ]
    );
  };

  const renderToggle = (category, setting, label, description) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={settings[category][setting]}
        onValueChange={(value) => updateSetting(category, setting, value)}
        trackColor={{ false: '#ccc', true: '#4CAF50' }}
        thumbColor={settings[category][setting] ? '#2E7D32' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {renderToggle(
          'notifications',
          'dailyTips',
          'Daily Safety Tips',
          'Receive a safety tip every morning'
        )}
        {renderToggle(
          'notifications',
          'tripReminders',
          'Trip Reminders',
          'Remind you to start recording your trips'
        )}
        {renderToggle(
          'notifications',
          'weeklyReports',
          'Weekly Reports',
          'Get your driving summary every week'
        )}
        {renderToggle(
          'notifications',
          'safetyAlerts',
          'Safety Alerts',
          'Real-time alerts for dangerous conditions'
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Driving Preferences</Text>
        {renderToggle(
          'driving',
          'autoStart',
          'Auto-Start Recording',
          'Automatically start recording when driving detected'
        )}
        {renderToggle(
          'driving',
          'voiceAlerts',
          'Voice Alerts',
          'Hear safety alerts while driving'
        )}
        {renderToggle(
          'driving',
          'speedWarnings',
          'Speed Warnings',
          'Alert when exceeding speed limits'
        )}
        {renderToggle(
          'driving',
          'harshEventAlerts',
          'Harsh Event Alerts',
          'Notify about harsh braking or acceleration'
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        {renderToggle(
          'privacy',
          'shareAnonymousData',
          'Share Anonymous Data',
          'Help improve road safety with anonymous statistics'
        )}
        {renderToggle(
          'privacy',
          'locationHistory',
          'Save Location History',
          'Store your trip routes for personal review'
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Data Source</Text>
          <Text style={styles.aboutValue}>Romanian Police Statistics</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Mission</Text>
          <Text style={styles.aboutValue}>Reduce traffic fatalities to EU average</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity 
          style={styles.supportButton}
          onPress={() => Alert.alert('Feedback', 'Email: safedrive.romania@example.com')}
        >
          <Text style={styles.supportButtonText}>Send Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.supportButton}
          onPress={() => Alert.alert('Help', 'Visit our website for tutorials and FAQs')}
        >
          <Text style={styles.supportButtonText}>Help & Tutorials</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={() => Alert.alert('Emergency', 'Call 112 for all emergencies in Romania')}
        >
          <Text style={styles.emergencyNumber}>112</Text>
          <Text style={styles.emergencyLabel}>All Emergencies</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.clearButton}
        onPress={clearAllData}
      >
        <Text style={styles.clearButtonText}>Clear All Data</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          SafeDrive Romania - Making roads safer, one driver at a time
        </Text>
        <Text style={styles.footerText}>
          Together we can reduce fatalities from 77 to 46 per million
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 5,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  aboutLabel: {
    fontSize: 16,
    color: '#666',
  },
  aboutValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  supportButton: {
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    alignItems: 'center',
  },
  supportButtonText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
  },
  emergencyButton: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    alignItems: 'center',
  },
  emergencyNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  emergencyLabel: {
    fontSize: 14,
    color: '#B71C1C',
    marginTop: 5,
  },
  clearButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
});