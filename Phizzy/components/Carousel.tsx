import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { completionMap } from '@/app/weekPlanScreen/[week]';

const { width } = Dimensions.get('window');

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const weekNumber = 1;
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDays = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

  const completedDays = daysOfWeek.map((day, index) => {
    const exercises = completionMap[weekNumber]?.[day] || [];
    const allDone = exercises.length > 0 && exercises.every((done) => done);
    return allDone ? index : null;
  }).filter((i): i is number => i !== null);

  // Calculate current streak including today and yesterday if connected
  let streakCount = 0;
  const todayIndex = new Date().getDay();
  for (let i = todayIndex; i >= 0; i--) {
    if (completedDays.includes(i)) {
      streakCount++;
    } else {
      break;
    }
  }

  // Include yesterday if today is incomplete but yesterday is complete
  if (!completedDays.includes(todayIndex) && completedDays.includes(todayIndex - 1)) {
    streakCount = 1;
  }

  const pages = [
    <View key="page1" style={styles.page}>
      <Icon name="star" size={iconSize} color="#FFD700" />
      <Text style={styles.title}>Keep up the good work Andrew!</Text>
      <Text style={styles.subtitle}>3 more days until I reach [next milestone]</Text>
    </View>,
    <View key="page2" style={styles.page}>
      <View style={styles.streakHeader}>
        <Icon name="fire" size={30} color="#FF6A00" />
        <Text style={styles.streakTitle}>{streakCount} Day Streak</Text>
      </View>
      <View style={styles.daysContainer}>
        {shortDays.map((day, index) => (
          <View
            key={index}
            style={[styles.dayCircle, completedDays.includes(index) ? styles.activeDay : styles.inactiveDay]}
          >
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </View>
    </View>,
    <View key="page3" style={styles.page}>
      <Text style={styles.badgeTitle}>Newest Badge</Text>
      <Icon name="medal" size={iconSize} color="#FFD700" />
      <Text style={styles.badgeName}>Beast Mode</Text>
      <Text style={styles.subtitle}>50 Exercises Complete</Text>
      <Text style={styles.nextBadge}>Next Badge: Complete 50 More Exercises to Unlock</Text>
    </View>
  ];

  const handleScrollEnd = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
      >
        {pages.map((page, index) => (
          <View key={index} style={[styles.pageContainer, { width }]}> 
            {page} 
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {pages.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => scrollToIndex(index)}>
            <View
              style={[styles.dot, activeIndex === index ? styles.activeDot : styles.inactiveDot]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  streakTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6A00',
  },
  dayCircle: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.01,
  },
  activeDay: {
    backgroundColor: '#FF6A00',
  },
  inactiveDay: {
    backgroundColor: '#D3D3D3',
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  daysContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  badgeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
    textAlign: 'center',
  },
  nextBadge: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#D3D3D3',
  },
  activeDot: {
    backgroundColor: '#FF6A00',
  },
  inactiveDot: {
    backgroundColor: '#D3D3D3',
  },
});

const iconSize = 100;

export default Carousel;
