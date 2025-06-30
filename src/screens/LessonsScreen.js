import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LessonsScreen() {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [expandedLesson, setExpandedLesson] = useState(null);

  const lessons = [
    {
      id: 1,
      title: "Speeding - Romania's #1 Killer",
      icon: "🚗",
      category: "speed",
      stats: "733 accidents, 312 deaths yearly",
      content: [
        "Speeding reduces reaction time and increases crash severity",
        "2-second rule: Pick a fixed point, count seconds between you and car ahead",
        "In rain/snow: Double following distance to 4 seconds",
        "Rural roads (52% of fatalities): Max 90 km/h, reduce by 20% at night",
        "Remember: Arriving 5 minutes late is better than not arriving at all"
      ],
      quiz: {
        question: "What's the minimum safe following distance in good weather?",
        options: ["1 second", "2 seconds", "3 seconds", "4 seconds"],
        correct: 1
      }
    },
    {
      id: 2,
      title: "Alcohol & Driving Don't Mix",
      icon: "🍺",
      category: "alcohol",
      stats: "Leading cause of accidents historically",
      content: [
        "Legal limit in Romania: 0.0‰ - ZERO tolerance",
        "Even one drink impairs judgment and reaction time",
        "Plan ahead: Designate driver, use taxi/Uber, public transport",
        "Coffee, cold shower DON'T reduce blood alcohol",
        "Morning after: You may still be over limit"
      ],
      quiz: {
        question: "What's the legal blood alcohol limit for drivers in Romania?",
        options: ["0.5‰", "0.2‰", "0.0‰", "0.8‰"],
        correct: 2
      }
    },
    {
      id: 3,
      title: "Protecting Pedestrians",
      icon: "🚶",
      category: "pedestrian",
      stats: "39% of all traffic fatalities",
      content: [
        "Always stop before crosswalks, not on them",
        "Look twice at intersections - pedestrians may appear suddenly",
        "School zones: Maximum 30 km/h, be extra vigilant",
        "Night time: Pedestrians are harder to see, reduce speed",
        "Never pass a stopped bus - children may cross"
      ],
      quiz: {
        question: "What percentage of Romanian traffic fatalities are pedestrians?",
        options: ["15%", "25%", "39%", "50%"],
        correct: 2
      }
    },
    {
      id: 4,
      title: "Right of Way Rules",
      icon: "⚠️",
      category: "yield",
      stats: "429 accidents from failure to yield",
      content: [
        "At unmarked intersections: Yield to vehicles on your right",
        "Roundabouts: Yield to vehicles already in the circle",
        "When turning left: Yield to oncoming traffic",
        "Emergency vehicles: Pull over and stop immediately",
        "Doubt? Better to yield than cause an accident"
      ],
      quiz: {
        question: "At an unmarked intersection, who has right of way?",
        options: ["Larger vehicle", "Vehicle on the right", "Faster vehicle", "First to arrive"],
        correct: 1
      }
    },
    {
      id: 5,
      title: "Phone = Danger Zone",
      icon: "📱",
      category: "distraction",
      stats: "4x higher crash risk",
      content: [
        "Texting takes eyes off road for 5 seconds = 100m at 70km/h",
        "Hands-free calling is still distracting",
        "Pull over safely to use phone",
        "Enable 'Do Not Disturb While Driving' mode",
        "Your life is worth more than any message"
      ],
      quiz: {
        question: "Using a phone while driving increases crash risk by how much?",
        options: ["2x", "3x", "4x", "5x"],
        correct: 2
      }
    },
    {
      id: 6,
      title: "Rural Road Risks",
      icon: "🌾",
      category: "rural",
      stats: "52% of fatalities occur here",
      content: [
        "No street lights: Use high beams, watch for animals",
        "Narrow roads: Reduce speed before curves",
        "Agricultural vehicles: Pass only when completely safe",
        "Weather affects rural roads more: Ice, fog common",
        "Emergency services farther away: Drive extra carefully"
      ],
      quiz: {
        question: "What percentage of traffic fatalities occur on rural roads?",
        options: ["25%", "38%", "52%", "65%"],
        correct: 2
      }
    },
    {
      id: 7,
      title: "Intersection Intelligence",
      icon: "🚦",
      category: "intersection",
      stats: "High-risk accident zones",
      content: [
        "Look left-right-left before proceeding",
        "Yellow light means STOP if safe, not speed up",
        "Right turn: Check blind spot for cyclists/pedestrians",
        "Never block intersection - wait until you can clear it",
        "Watch for red-light runners: Count 2 seconds after green"
      ],
      quiz: {
        question: "What should you do when light turns yellow?",
        options: ["Speed up", "Stop if safe", "Honk horn", "Flash lights"],
        correct: 1
      }
    },
    {
      id: 8,
      title: "Night Driving Safety",
      icon: "🌙",
      category: "night",
      stats: "Reduced visibility = higher risk",
      content: [
        "Clean windshield and headlights regularly",
        "Dim dashboard lights to reduce glare",
        "Don't stare at oncoming headlights",
        "Increase following distance to 3-4 seconds",
        "If tired: Pull over, rest, or switch drivers"
      ],
      quiz: {
        question: "What's the recommended following distance at night?",
        options: ["1-2 seconds", "2-3 seconds", "3-4 seconds", "5-6 seconds"],
        correct: 2
      }
    },
    {
      id: 9,
      title: "Weather Wise Driving",
      icon: "🌧️",
      category: "weather",
      stats: "Conditions multiply dangers",
      content: [
        "Rain: Reduce speed by 1/3, double following distance",
        "First rain most dangerous: Oil + water = slippery",
        "Fog: Use low beams, not high beams",
        "Snow/Ice: Reduce speed by 1/2, gentle inputs only",
        "If skidding: Don't brake hard, steer where you want to go"
      ],
      quiz: {
        question: "By how much should you reduce speed in rain?",
        options: ["10%", "20%", "33%", "50%"],
        correct: 2
      }
    },
    {
      id: 10,
      title: "Emergency Situations",
      icon: "🆘",
      category: "emergency",
      stats: "Preparation saves lives",
      content: [
        "Brake failure: Pump brakes, use handbrake gradually, find safe stop",
        "Tire blowout: Don't brake hard, grip wheel, slow gradually",
        "If involved in accident: Check injuries, call 112, don't admit fault",
        "Keep emergency kit: Triangle, vest, first aid, flashlight",
        "Know your location: Highway markers, GPS coordinates"
      ],
      quiz: {
        question: "What's the Romanian emergency number?",
        options: ["911", "999", "112", "100"],
        correct: 2
      }
    }
  ];

  useEffect(() => {
    loadCompletedLessons();
  }, []);

  const loadCompletedLessons = async () => {
    try {
      const completed = await AsyncStorage.getItem('completedLessons');
      if (completed) {
        setCompletedLessons(JSON.parse(completed));
      }
    } catch (error) {
      console.error('Error loading completed lessons:', error);
    }
  };

  const handleQuizAnswer = async (lessonId, selectedIndex, correctIndex) => {
    if (selectedIndex === correctIndex) {
      Alert.alert('Correct!', 'Well done! You\'ve completed this lesson.', [
        {
          text: 'OK',
          onPress: async () => {
            const newCompleted = [...completedLessons, lessonId];
            setCompletedLessons(newCompleted);
            await AsyncStorage.setItem('completedLessons', JSON.stringify(newCompleted));
            setExpandedLesson(null);
          }
        }
      ]);
    } else {
      Alert.alert('Not quite!', 'Review the lesson and try again.');
    }
  };

  const isLessonCompleted = (lessonId) => completedLessons.includes(lessonId);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safety Lessons</Text>
        <Text style={styles.headerSubtitle}>
          Based on Romanian accident data - Complete all 10 to become a safer driver
        </Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Progress: {completedLessons.length}/10 lessons completed
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(completedLessons.length / 10) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {lessons.map((lesson) => (
        <TouchableOpacity
          key={lesson.id}
          style={[
            styles.lessonCard,
            isLessonCompleted(lesson.id) && styles.lessonCompleted
          ]}
          onPress={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
        >
          <View style={styles.lessonHeader}>
            <Text style={styles.lessonIcon}>{lesson.icon}</Text>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonStats}>{lesson.stats}</Text>
            </View>
            {isLessonCompleted(lesson.id) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>

          {expandedLesson === lesson.id && (
            <View style={styles.lessonContent}>
              {lesson.content.map((point, index) => (
                <Text key={index} style={styles.contentPoint}>• {point}</Text>
              ))}
              
              {!isLessonCompleted(lesson.id) && (
                <View style={styles.quizContainer}>
                  <Text style={styles.quizQuestion}>{lesson.quiz.question}</Text>
                  {lesson.quiz.options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quizOption}
                      onPress={() => handleQuizAnswer(lesson.id, index, lesson.quiz.correct)}
                    >
                      <Text style={styles.quizOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      ))}
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
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 15,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  lessonCard: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  lessonCompleted: {
    backgroundColor: '#E8F5E9',
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  lessonIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  lessonStats: {
    fontSize: 12,
    color: '#666',
  },
  checkmark: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  lessonContent: {
    padding: 15,
    paddingTop: 0,
  },
  contentPoint: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  quizContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  quizQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  quizOption: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quizOptionText: {
    fontSize: 14,
    color: '#333',
  },
});