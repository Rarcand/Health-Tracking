import React, { useContext } from 'react';
import { ImageBackground, View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../_layout';
import backgroundImage from '../../assets/map_images/1175f64208ff7f61fe360b28a9c155428c5e91c3.png';
import headerImage from '../../assets/map_images/7d3220846108c7971d252cc6f5addfb03152cdbc.png';

export default function MapScreen() {
  const router = useRouter();
  const { themeColor } = useContext(ThemeContext);

  const navigateToWeek = (weekNumber: number) => {
    router.push(`/week/${weekNumber}` as any);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={headerImage} style={styles.headerImage} resizeMode="contain" />
        </View>

        <View style={styles.mapContent}>
          {[4, 3, 2, 1].map((week) => (
            <React.Fragment key={week}>
              <View style={styles.milestone}>
                <View style={[styles.bubbleContainer, { alignItems: week % 2 === 0 ? 'flex-end' : 'flex-start' }]}> 
                  <TouchableOpacity onPress={() => navigateToWeek(week)}>
                    <View style={[styles.bubble, styles.weekBubble]}>
                      <Text style={styles.bubbleText}>
                        Week {week}:{'\n'}
                        {week === 4 ? 'Save the City' : week === 3 ? 'Power Up' : week === 2 ? 'Meet Your Battle' : 'Learn Powers'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {week > 1 && (
                <View style={[styles.pathLine, week % 2 === 0 ? styles.pathLineLeft : styles.pathLineRight]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerImage: {
    width: '80%',
    height: 300,
  },
  mapContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  milestone: {
    marginVertical: 25,
    width: '100%',
  },
  bubbleContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  bubble: {
    borderRadius: 25,
    padding: 20,
    maxWidth: '85%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  weekBubble: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  bubbleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
  },
  pathLine: {
    width: 4,
    height: 100,
    backgroundColor: '#FFA500',
    marginVertical: -30,
  },
  pathLineLeft: {
    alignSelf: 'flex-start',
    marginLeft: '45%',
    transform: [{ rotate: '45deg' }],
  },
  pathLineRight: {
    alignSelf: 'flex-end',
    marginRight: '45%',
    transform: [{ rotate: '-45deg' }],
  },
});