import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteMovieIds, setFavoriteMovieIds] = useState([]);

  // Luister naar authenticatie veranderingen
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await loadFavorites(user);
      } else {
        setCurrentUser(null);
        setFavoriteMovieIds([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Haal de favorieten van de huidige gebruiker op
  const loadFavorites = async (user) => {
    try {
      const colRef = collection(db, 'users', user.uid, 'favorites');
      const querySnapshot = await getDocs(colRef);
      const favIds = querySnapshot.docs.map((doc) => doc.id);
      setFavoriteMovieIds(favIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Gebruik useFocusEffect om favorieten bij te werken bij terugkeer naar dit scherm
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser) {
        loadFavorites(currentUser);
      }
    }, [currentUser])
  );

  // Haal films op bij het laden van het scherm
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const popularResponse = await fetch(
          'https://api.themoviedb.org/3/movie/popular?api_key=daaaf1fbc930fa09a01032c6e26611e5&language=en-US&page=1'
        );
        const popularData = await popularResponse.json();
        setPopularMovies(popularData.results);

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

  const handleFavorite = async (movie) => {
    if (!currentUser) {
      Alert.alert('Niet ingelogd', 'Log in om films als favoriet toe te voegen.');
      return;
    }

    const movieIdString = String(movie.id);
    const isFavorite = favoriteMovieIds.includes(movieIdString);

    try {
      if (isFavorite) {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'favorites', movieIdString));
        setFavoriteMovieIds((prev) => prev.filter((id) => id !== movieIdString));
      } else {
        await setDoc(doc(db, 'users', currentUser.uid, 'favorites', movieIdString), {
          title: movie.title,
          poster_path: movie.poster_path,
        });
        setFavoriteMovieIds((prev) => [...prev, movieIdString]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const calculateImageDimensions = () => {
    const isMobile = width < 600;
    const minWidth = isMobile ? 120 : 150;
    const spacing = 10;
    const columns = Math.floor(width / (minWidth + spacing));
    const imageWidth = (width - spacing * (columns + 1)) / columns;
    const imageHeight = imageWidth * 1.5;
    return { imageWidth, imageHeight, columns };
  };

  const renderMovies = (movies, title) => {
    const { imageWidth, imageHeight } = calculateImageDimensions();

    return (
      <>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.galleryWrapper}>
          <View style={styles.gallery}>
            {movies.map((item) => {
              const movieIdString = String(item.id);
              const isFavorite = favoriteMovieIds.includes(movieIdString);

              return (
                <Pressable
                  key={item.id}
                  onPress={() => navigation.navigate('Details', { movie: item })}
                >
                  <View style={styles.movieCard}>
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                      style={[styles.poster, { width: imageWidth, height: imageHeight }]}
                      resizeMode="cover"
                    />
                    <View style={[styles.titleRow, { width: imageWidth }]}>
                      <Text style={styles.title}>{item.title}</Text>
                      <TouchableOpacity onPress={() => handleFavorite(item)}>
                        <Text style={styles.heartText}>{isFavorite ? '❤️' : '🤍'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#AC274F" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Welkom bij FindFilms</Text>
      <Text style={styles.description}>
        Ontdek de populairste films, nieuwste releases en sla je favorieten op!
      </Text>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('SearchStack')}
      >
        <Text style={styles.searchButtonText}>Zoek naar jouw favoriete film</Text>
      </TouchableOpacity>

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
    marginTop: 10,
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
    backgroundColor: '#AC274F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 20,
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
  galleryWrapper: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#191516',
    borderRadius: 10,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  movieCard: {
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#191516',
    padding: 10,
  },
  poster: {
    borderRadius: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFD9DA',
    flex: 1,
  },
  heartText: {
    fontSize: 18,
    marginLeft: 10,
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
