import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [hoverStates, setHoverStates] = useState([]); // State array voor hover status
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
        setHoverStates(new Array(data.results.length).fill(false)); // Initialiseer hoverStates
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const calculateColumns = () => {
    const minWidth = 200;
    return Math.floor(width / minWidth);
  };

  const calculateImageDimensions = () => {
    const columns = calculateColumns();
    const spacing = 10;
    const imageWidth = (width - spacing * (columns + 1)) / columns;
    const imageHeight = imageWidth * 1.5;
    return { imageWidth, imageHeight };
  };

  const { imageWidth, imageHeight } = calculateImageDimensions();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleMouseEnter = (index) => {
    const updatedHoverStates = [...hoverStates];
    updatedHoverStates[index] = true;
    setHoverStates(updatedHoverStates);
  };

  const handleMouseLeave = (index) => {
    const updatedHoverStates = [...hoverStates];
    updatedHoverStates[index] = false;
    setHoverStates(updatedHoverStates);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Welkom bij FindFilms</Text>
      <Text style={styles.description}>
        Ontdek de populairste films, bekijk details en sla je favorieten op!
      </Text>

      <View style={styles.gallery}>
        {movies.map((item, index) => (
          <TouchableWithoutFeedback
            key={item.id}
            onPress={() => navigation.navigate('Details', { movie: item })}
            onMouseEnter={() => handleMouseEnter(index)} // Hover start
            onMouseLeave={() => handleMouseLeave(index)} // Hover stop
          >
            <View
              style={[
                styles.movieItem,
                hoverStates[index] && styles.hoveredMovieItem, // Pas stijl aan bij hover
              ]}
            >
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={[styles.poster, { width: imageWidth, height: imageHeight }]}
                resizeMode="cover"
              />
              <Text style={[styles.title, { width: imageWidth }]}>{item.title}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Vind jouw favoriete films en blijf op de hoogte!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: '#382E31',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191516',
  },
  loadingText: {
    color: '#FFD9DA',
    fontSize: 18,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFD9DA',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#EB638B',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  movieItem: {
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent', // Geen rand standaard
    borderRadius: 10, // Zachte hoeken
  },
  hoveredMovieItem: {
    borderColor: '#AC274F', // Roze rand bij hover
  },
  poster: {
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFD9DA',
    backgroundColor: '#191516',
    padding: 10,
    borderRadius: 5,
  },
  footer: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#EB638B',
  },
});

export default HomeScreen;
