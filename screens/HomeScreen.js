import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

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
      console.log('API Response:', data); // Controleer de response in de console
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
  horizontal={true}  // Zorgt ervoor dat de films horizontaal worden weergegeven
  showsHorizontalScrollIndicator={false}  // Verbergt de horizontale scrollbar
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
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  movieItem: {
    marginRight: 15, // Ruimte tussen de films
    width: 150, // Breedte van elke film
  },
  poster: {
    width: '100%',
    height: 225, // Pas de hoogte aan om de verhoudingen goed te houden
    borderRadius: 10, // Ronde hoeken voor de poster
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});


export default HomeScreen;
