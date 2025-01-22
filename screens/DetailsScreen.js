import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Alert, 
  Platform 
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const DetailsScreen = ({ route, navigation }) => {
  const { movie } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkFavorite = async () => {
      const user = auth.currentUser;
      setCurrentUser(user);
      if (user) {
        const favoriteRef = doc(db, 'users', user.uid, 'favorites', String(movie.id));
        const docSnap = await getDoc(favoriteRef);
        setIsFavorite(docSnap.exists());
      }
    };
    checkFavorite();
  }, [movie]);

  const handleFavorite = async () => {
    if (!currentUser) {
      Alert.alert('Niet ingelogd', 'Log in om films als favoriet toe te voegen.');
      return;
    }

    try {
      const favoriteRef = doc(db, 'users', currentUser.uid, 'favorites', String(movie.id));
      if (isFavorite) {
        await deleteDoc(favoriteRef);
        setIsFavorite(false);
      } else {
        await setDoc(favoriteRef, {
          title: movie.title,
          poster_path: movie.poster_path,
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const imageWidth = Math.min(width - 40, 300); // Max 300px breedte
  const imageHeight = (imageWidth / 2) * 3; // Verhouding 2:3
  const roundedVoteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <ScrollView style={styles.container}>
      {/* Terugknop */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>← Terug</Text>
      </TouchableOpacity>

      {/* Film Detail */}
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={[styles.poster, { width: imageWidth, height: imageHeight }]}
        resizeMode="contain"
      />

      {/* Kader voor titel, beschrijving en details */}
      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{movie.title}</Text>
          <TouchableOpacity onPress={handleFavorite}>
            <Text style={styles.heartIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.overview}>{movie.overview}</Text>

        {/* Details */}
        <View style={styles.extraDetails}>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Originele Titel:</Text> {movie.original_title}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Release Datum:</Text> {movie.release_date}
          </Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Gemiddelde Score:</Text>
            <Text style={styles.scoreValue}>{roundedVoteAverage}/10</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#382E31',
    padding: 20,
  },
  backButton: {
    backgroundColor: '#AC274F',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#FFD9DA',
    fontSize: 16,
    fontWeight: 'bold',
  },
  poster: {
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  detailsContainer: {
    backgroundColor: '#191516',
    padding: 15,
    borderRadius: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD9DA',
  },
  heartIcon: {
    fontSize: 24,
    color: '#FFD9DA',
  },
  overview: {
    fontSize: 16,
    color: '#EB638B',
    marginBottom: 20,
  },
  extraDetails: {
    marginTop: 10,
  },
  detail: {
    fontSize: 14,
    color: '#FFD9DA',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#EB638B',
  },
  scoreContainer: {
    marginTop: 10,
    backgroundColor: '#AC274F',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD9DA',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD9DA',
  },
});

export default DetailsScreen;
