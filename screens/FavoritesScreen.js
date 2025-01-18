import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const colRef = collection(db, 'users', user.uid, 'favorites');
        const querySnapshot = await getDocs(colRef);
        const favMovies = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favMovies);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user]);

  const removeFavorite = async (movieId) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'favorites', movieId));
      setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Error', 'Failed to remove favorite');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Log in om je favoriete films te bekijken.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoriete Films</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.movieCard}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => removeFavorite(item.id)}>
                <Text style={styles.removeButton}>Verwijderen</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#382E31',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD9DA',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#FFD9DA',
    textAlign: 'center',
    marginTop: 20,
  },
  movieCard: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#191516',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 5,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD9DA',
    marginBottom: 5,
  },
  removeButton: {
    fontSize: 14,
    color: '#EB638B',
  },
});

export default FavoritesScreen;
