import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import tmdb from '../services/tmdb'; // Controleer dit pad

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const searchMovies = async () => {
    try {
      console.log('Zoekopdracht gestart:', query); // Debug info
      const response = await tmdb.get('/search/movie', {
        params: { query },
      });
      console.log('Resultaten:', response.data.results); // Debug info
      setMovies(response.data.results);
      setError(null); // Verwijder foutmelding bij succes
    } catch (err) {
      console.error('Fout bij het ophalen van films:', err);
      setError('Er is iets misgegaan bij het ophalen van de films.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Zoek een film..."
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      <Button title="Zoeken" onPress={searchMovies} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default SearchScreen;
