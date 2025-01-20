import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Succes', 'Je bent ingelogd!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inloggen</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Wachtwoord"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Inloggen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.registerLink}
      >
        <Text style={styles.registerText}>
          Nog geen account? Registreer hier!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#382E31',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD9DA',
    marginBottom: 20,
  },
  input: {
    width: Platform.OS === 'web' ? 400 : '100%', // 400px breed op desktop
    maxWidth: 400, // Maximale breedte
    height: 50,
    borderColor: '#AC274F',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#FFD9DA',
    backgroundColor: '#191516',
  },
  loginButton: {
    backgroundColor: '#AC274F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    width: Platform.OS === 'web' ? 400 : '100%',
    maxWidth: 400, // Maximale breedte
  },
  loginText: {
    color: '#FFD9DA',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 10,
  },
  registerText: {
    color: '#EB638B',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
