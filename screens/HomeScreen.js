import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/movie/popular?api_key=JOUW_API_SLEUTEL&language=en-US&page=1'
        );
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

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Details', { movie: item })}
            >
              <View style={styles.movieItem}>
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                  style={styles.poster}
                />
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  movieItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
