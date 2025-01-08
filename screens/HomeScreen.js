import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch populaire films
        const popularResponse = await fetch(
          'https://api.themoviedb.org/3/movie/popular?api_key=daaaf1fbc930fa09a01032c6e26611e5&language=en-US&page=1'
        );
        const popularData = await popularResponse.json();
        setPopularMovies(popularData.results);

        // Fetch nieuwste films (Now Playing)
        const newResponse = await fetch(
          'https://api.themoviedb.org/3/movie/now_playing?api_key=daaaf1fbc930fa09a01032c6e26611e5&language=en-US&page=1'
        );
        const newData = await newResponse.json();
        setNewMovies(newData.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const calculateImageDimensions = () => {
    const columns = 5; // Aantal afbeeldingen per rij
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

  const renderMovies = (movies, title) => (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.gallery}>
        {movies.map((item) => (
          <TouchableWithoutFeedback
            key={item.id}
            onPress={() => navigation.navigate('Details', { movie: item })}
          >
            <View style={styles.movieItem}>
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
    </>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Welkom bij FindFilms</Text>
      <Text style={styles.description}>
        Ontdek de populairste films, nieuwste releases en sla je favorieten op!
      </Text>

      {/* Zoekfunctie knop */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.searchButtonText}>Zoek naar jouw favoriete film</Text>
      </TouchableOpacity>

      {/* Secties voor films */}
      {renderMovies(popularMovies, 'Populaire Films')}
      {renderMovies(newMovies, 'Nieuwste Films')}

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
    fontSize: 28,
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
  searchButton: {
    backgroundColor: '#AC274F', // Dieproze kleur
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30, // Maak de hoeken rond voor een knopachtig uiterlijk
    alignSelf: 'center', // Centreer de knop
    shadowColor: '#000', // Schaduw voor meer dimensie
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Voor Android schaduw
  },
  searchButtonText: {
    fontSize: 16,
    color: '#FFD9DA',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD9DA',
    marginVertical: 15,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  movieItem: {
    marginBottom: 20,
    alignItems: 'center',
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
