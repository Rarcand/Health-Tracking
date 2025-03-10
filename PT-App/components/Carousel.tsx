import React, { useState, useRef } from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const pages = ["First Page", "Second Page", "Third Page"];

  const handleScrollEnd = (event: { nativeEvent: { contentOffset: { x: number; }; }; }) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Pages */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd} // Ensures snapping
        scrollEventThrottle={16}
      >
        {pages.map((page, index) => (
          <View key={index} style={[styles.page, { width }]}>
            <Text style={styles.text}>{page}</Text>
          </View>
        ))}
      </ScrollView>
      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    width: "100%", 
  },
  page: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498db",
    borderRadius: 10,
  },
  text: { 
    color: "#fff", 
    fontSize: 24, 
    fontWeight: "bold" 
  },
  dotsContainer: {
    flexDirection: "row",
    position: "absolute",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: { 
    backgroundColor: "#000" 
  },
  inactiveDot: { 
    backgroundColor: "#ccc" 
  },
});

export default Carousel;