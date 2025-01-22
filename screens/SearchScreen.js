import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Nieuwe import voor Picker
import tmdb from '../services/tmdb'; // Controleer dit pad

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]); 
  const [selectedGenre, setSelectedGenre] = useState('');
  const [year, setYear] = useState('');
  const [minRating, setMinRating] = useState('');
  const [advancedSearch, setAdvancedSearch] = useState(false);  // Toggle voor geavanceerde zoekopties
  const [error, setError] = useState(null);

  // Haal de genres op van TMDb
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await tmdb.get('/genre/movie/list');
        setGenres(response.data.genres); 
      } catch (err) {
        setError('Fout bij het ophalen van genres.');
      }
    };
    fetchGenres();
  }, []);

  // Zoek films functie
  const searchMovies = async () => {
    try {
      let params = {};

      if (query) params.query = query;
      if (selectedGenre) params.with_genres = selectedGenre;
      if (minRating) params.vote_average = `gte:${minRating}`;
      if (year) params.primary_release_year = year;

      // Debugging log om de parameters te zien
      console.log('Search parameters:', params);

      let response;
      if (query) {
        response = await tmdb.get('/search/movie', { params });
      } else {
        response = await tmdb.get('/discover/movie', { params });
      }

      console.log('API response:', response.data);

      if (response.data.results.length > 0) {
        setMovies(response.data.results);
        setError(null);
      } else {
        setMovies([]);
        setError('Geen resultaten gevonden.');
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Er is iets misgegaan bij het ophalen van de films.');
    }
  };

  // Error log bij het aanklikken van een film
  const handleMoviePress = (item) => {
    try {
      if (!item) {
        throw new Error('Filmgegevens zijn niet beschikbaar.');
      }
      navigation.navigate('HomeStack', { screen: 'Details', params: { movie: item } });

    } catch (err) {
      console.error('Error navigating to details screen:', err);
      setError('Er is een fout opgetreden bij het openen van de filmdetails.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zoek naar een Film</Text>
      
      {/* Zoekbalk voor titel, altijd zichtbaar */}
      <TextInput
        style={styles.input}
        placeholder="Zoek op titel..."
        placeholderTextColor="#FFD9DA"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      
      {/* Geavanceerde zoekoptie toggle */}
      <TouchableOpacity onPress={() => setAdvancedSearch(!advancedSearch)}>
        <Text style={styles.toggleText}>{advancedSearch ? 'Minder opties' : 'Meer zoekopties'}</Text>
      </TouchableOpacity>
      
      {/* Geavanceerde zoekopties sectie */}
      {advancedSearch && (
        <View style={styles.advancedSearch}>
          <Text style={styles.label}>Genre</Text>
          <Picker
            selectedValue={selectedGenre}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedGenre(itemValue)}
          >
            <Picker.Item label="Kies een Genre" value="" />
            {genres.map((genre) => (
              <Picker.Item key={genre.id} label={genre.name} value={genre.id.toString()} />
            ))}
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Jaar van uitgave"
            placeholderTextColor="#FFD9DA"
            value={year}
            onChangeText={(text) => setYear(text)}
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Minimaal score (bijv. 6)"
            placeholderTextColor="#FFD9DA"
            value={minRating}
            onChangeText={(text) => setMinRating(text)}
            keyboardType="numeric"
          />
        </View>
      )}

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
            onPress={() => handleMoviePress(item)} // Gebruik de nieuwe functie
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
  picker: {
    height: 50,
    color: '#FFD9DA',
    backgroundColor: '#191516',
    borderColor: '#AC274F',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  advancedSearch: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: '#FFD9DA',
    marginBottom: 5,
  },
  toggleText: {
    fontSize: 16,
    color: '#EB638B',
    textAlign: 'center',
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
});

export default SearchScreen;