import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Naam vereist', 'Voer alstublieft een naam in.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert('Fout', 'E-mail en wachtwoord zijn verplicht.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Fout', 'Het wachtwoord moet minimaal 6 tekens bevatten.');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Voeg de naam en locatie toe aan Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { Name: name, Location: location });

      Alert.alert('Succesvol geregistreerd', `Welkom, ${name}!`);
      navigation.navigate('Feed');
    } catch (error) {
      console.error('Registratiefout:', error);
      Alert.alert('Registratiefout', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Registreer</Text>

      <TextInput
        style={styles.input}
        placeholder="Naam"
        placeholderTextColor="#FFD9DA"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Locatie"
        placeholderTextColor="#FFD9DA"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#FFD9DA"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Wachtwoord"
        placeholderTextColor="#FFD9DA"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Registreren...' : 'Registreer'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#382E31',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD9DA',
    marginBottom: 20,
  },
  input: {
    width: Math.min(width * 0.8, 400),
    height: 50,
    backgroundColor: '#191516',
    borderColor: '#AC274F',
    borderWidth: 1,
    borderRadius: 10,
    color: '#FFD9DA',
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#AC274F',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFD9DA',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#574350',
  },
});

export default RegisterScreen;
