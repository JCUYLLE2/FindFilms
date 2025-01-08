import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/movie/popular?api_key=daaaf1fbc930fa09a01032c6e26611e5&language=en-US&page=1'
        );
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const calculateColumns = () => {
    const minWidth = 200; // Verhoogde minimale breedte voor grotere afbeeldingen
    return Math.floor(width / minWidth); // Bepaal het aantal kolommen op basis van de schermbreedte
  };

  const calculateImageDimensions = () => {
    const columns = calculateColumns();
    const spacing = 10; // Ruimte tussen afbeeldingen
    const imageWidth = (width - spacing * (columns + 1)) / columns; // Breedte van een afbeelding
    const imageHeight = imageWidth * 1.5; // Hoogte met aspect ratio 2:3
    return { imageWidth, imageHeight };
  };

  const { imageWidth, imageHeight } = calculateImageDimensions();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.gallery}>
        {movies.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('Details', { movie: item })}
            style={[styles.movieItem, { width: imageWidth, height: imageHeight + 40 }]} // +40 voor titelruimte
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={[styles.poster, { width: imageWidth, height: imageHeight }]}
              resizeMode="cover"
            />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  movieItem: {
    marginBottom: 20,
    alignItems: 'center', // Zorg ervoor dat de titel gecentreerd is
  },
  poster: {
    borderRadius: 10,
  },
  title: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HomeScreen;
