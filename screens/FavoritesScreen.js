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
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const { width } = Dimensions.get('window');

const FavoritesScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const favColRef = collection(db, 'users', user.uid, 'favorites');
        const unsubscribeFavorites = onSnapshot(
          favColRef,
          (querySnapshot) => {
            const favList = [];
            querySnapshot.forEach((doc) => {
              favList.push({ id: doc.id, ...doc.data() });
            });
            setFavorites(favList);
            setLoading(false);
          },
          (error) => {
            console.error('Error bij het luisteren naar favorieten:', error);
            setLoading(false);
          }
        );
        return () => unsubscribeFavorites();
      } else {
        setCurrentUser(null);
        setFavorites([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleRemoveFavorite = async (movieId) => {
    if (!currentUser) {
      Alert.alert('Niet ingelogd', 'Log in om favorieten te verwijderen.');
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'favorites', movieId));
    } catch (error) {
      console.error('Error bij het verwijderen van favoriet:', error);
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

  const renderFavorites = () => {
    if (favorites.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Je hebt nog geen favorieten toegevoegd.</Text>
        </View>
      );
    }

    const { imageWidth, imageHeight } = calculateImageDimensions();

    return (
      <View style={styles.galleryWrapper}>
        <View style={styles.gallery}>
          {favorites.map((item) => (
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
                  <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)}>
                    <Text style={styles.trashText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#AC274F" />
        <Text style={styles.loadingText}>Favorieten laden...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Mijn Favorieten</Text>
      {renderFavorites()}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Je favoriete films zijn hier weergegeven!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: '#382E31',
    flexGrow: 1,
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
    marginBottom: 20,
    color: '#FFD9DA',
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
  footer: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#EB638B',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#FFD9DA',
  },
  trashText: {
    fontSize: 24,
    marginLeft: 10,
  },
});

export default FavoritesScreen;
