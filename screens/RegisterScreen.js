import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Succes', 'Account aangemaakt!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registreren</Text>
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
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Registreren</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.loginLink}
      >
        <Text style={styles.loginText}>
          Al een account? Log hier in!
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
  registerButton: {
    backgroundColor: '#4CBB17',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    width: Platform.OS === 'web' ? 400 : '100%',
    maxWidth: 400, // Maximale breedte
  },
  registerText: {
    color: '#FFD9DA',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 10,
  },
  loginText: {
    color: '#EB638B',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
