import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import tmdb from '../services/tmdb'; // Controleer dit pad

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const searchMovies = async () => {
    try {
      const response = await tmdb.get('/search/movie', {
        params: { query },
      });
      setMovies(response.data.results);
      setError(null);
    } catch (err) {
      setError('Er is iets misgegaan bij het ophalen van de films.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zoek naar een Film</Text>
      <TextInput
        style={styles.input}
        placeholder="Typ een filmnaam of details..."
        placeholderTextColor="#FFD9DA"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      <TouchableOpacity style={styles.searchButton} onPress={searchMovies}>
        <Text style={styles.searchButtonText}>Zoeken</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieItem}
            onPress={() => navigation.navigate('Details', { movie: item })}
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.poster}
            />
            <View style={styles.movieDetails}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text style={styles.movieOverview}>
                {item.overview ? item.overview.slice(0, 100) + '...' : 'Geen beschrijving beschikbaar'}
              </Text>
              <Text style={styles.movieRelease}>Release: {item.release_date || 'Onbekend'}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noResults}>Geen resultaten gevonden.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#382E31',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD9DA',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#AC274F',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#FFD9DA',
    marginBottom: 15,
    backgroundColor: '#191516',
  },
  searchButton: {
    backgroundColor: '#AC274F',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    fontSize: 18,
    color: '#FFD9DA',
    fontWeight: 'bold',
  },
  error: {
    color: '#EB638B',
    textAlign: 'center',
    marginBottom: 15,
  },
  movieItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#191516',
    borderRadius: 10,
    padding: 10,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 15,
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD9DA',
    marginBottom: 5,
  },
  movieOverview: {
    fontSize: 14,
    color: '#EB638B',
    marginBottom: 10,
  },
  movieRelease: {
    fontSize: 12,
    color: '#FFD9DA',
  },
  noResults: {
    color: '#EB638B',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SearchScreen;
