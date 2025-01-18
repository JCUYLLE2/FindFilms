import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform // <-- importeer Platform
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProfileScreen = ({ navigation }) => {
  // Huidige ingelogde gebruiker
  const user = auth.currentUser;

  // State voor elk veld in Firestore
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState('');

  // Bij inladen van het scherm: haal de bestaande profielgegevens op
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          // Document in Firestore: /users/<uid>
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            // Vul de state met wat we uit Firestore lezen
            setName(data.Name || '');
            setCity(data.City || '');
            setCountry(data.Country || '');
            // age is waarschijnlijk een getal; we zetten het even naar string voor de TextInput
            setAge(data.age?.toString() || '');
          }
        } catch (error) {
          console.error('Fout bij ophalen profielgegevens:', error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  // Opslaan in Firestore
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        // Let op: je schrijft exact de velden zoals in je Firestore-structuur
        Name: name,
        City: city,
        Country: country,
        // Convert age naar een getal als je wilt opslaan als Number
        age: Number(age),
      });
      Alert.alert('Succes', 'Profielgegevens opgeslagen!');
    } catch (error) {
      console.error('Fout bij opslaan profielgegevens:', error);
    }
  };

  // Uitloggen
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Home');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profiel</Text>

      {user ? (
        <>
          <Text style={styles.info}>Ingelogd als: {user.email}</Text>

          {/* Name */}
          <TextInput
            style={styles.input}
            placeholder="Naam"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          {/* City */}
          <TextInput
            style={styles.input}
            placeholder="Stad"
            placeholderTextColor="#999"
            value={city}
            onChangeText={setCity}
          />

          {/* Country */}
          <TextInput
            style={styles.input}
            placeholder="Land"
            placeholderTextColor="#999"
            value={country}
            onChangeText={setCountry}
          />

          {/* age */}
          <TextInput
            style={styles.input}
            placeholder="Leeftijd"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />

          {/* Opslaan-knop */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveText}>Opslaan</Text>
          </TouchableOpacity>

          {/* Uitloggen-knop */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Uitloggen</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.info}>Je bent niet ingelogd.</Text>
      )}
    </View>
  );
};

export default ProfileScreen;

// ----------------- STYLES ----------------- //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#382E31',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD9DA',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: '#FFD9DA',
    marginBottom: 20,
  },
  input: {
    // Als we op web zitten: 400px breed, anders 100% (mobiel vult hele breedte)
    width: Platform.OS === 'web' ? 400 : '100%',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    // Eventueel kun je nog maxWidth gebruiken voor kleine schermen:
    // maxWidth: '80%',
  },
  saveButton: {
    backgroundColor: '#4CBB17',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#AC274F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  logoutText: {
    color: '#FFD9DA',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
