import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

const { width } = Dimensions.get('window');

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Define pages with icons and text
  const pages = [
    <View style={styles.page}>
      <Icon name="star" size={iconSize} color="#FFD700" />
      <Text style={styles.title}>Keep up the good work Andrew!</Text>
      <Text style={styles.subtitle}>3 more days until I reach [next milestone]</Text>
    </View>,
    <View style={styles.page}>
      <Text style={styles.streakTitle}>8 Day Streak</Text>
      <Icon name="fire" size={iconSize} color="#FF6A00" />
      <View style={styles.daysContainer}>
        {['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'].map((day, index) => (
          <View
            key={index}
            style={[
              styles.dayCircle,
              index === 1 ? styles.activeDay : styles.inactiveDay, // Highlight Monday as active
            ]}
          >
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </View>
    </View>,
    <View style={styles.page}>
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
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
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
  streakTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: -10,
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
    marginTop: 20,
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
  },
  nextBadge: {
    fontSize: 16,
    color: '#333',
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

const iconSize = 100; // Define iconSize as a number

export default Carousel;
