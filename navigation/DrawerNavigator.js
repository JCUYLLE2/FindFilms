import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SearchScreen from '../screens/SearchScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Text, View } from 'react-native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// HomeStack voor HomeScreen en DetailsScreen
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Voorkomt dubbele headers
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(data.Name || 'Gebruiker');
          } else {
            console.warn('Document bestaat niet in Firestore.');
            setUserName('Gebruiker');
          }
        } catch (error) {
          console.error('Fout bij ophalen van gebruikersnaam:', error);
          setUserName('Gebruiker');
        }
      } else {
        setUserName('');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2E282A',
          },
          headerTintColor: '#FFD9DA',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerStyle: {
            backgroundColor: '#191516',
          },
          drawerActiveTintColor: '#FFD9DA',
          drawerInactiveTintColor: '#EB638B',
          drawerLabelStyle: {
            fontSize: 16,
          },
          // De tekst wordt volledig statisch weergegeven
          headerTitle: () => (
            <View>
              <Text
                selectable={false} // Tekst niet selecteerbaar of klikbaar
                style={{
                  color: '#FFD9DA',
                  fontWeight: 'bold',
                  fontSize: 18,
                  textAlign: 'center',
                }}
              >
                {currentUser ? `Welkom, ${userName}` : 'Welkom'}
              </Text>
            </View>
          ),
        }}
      >
        {/* Home navigatie via HomeStack */}
        <Drawer.Screen
          name="HomeStack"
          component={HomeStack}
          options={{ title: 'Home' }}
        />
        <Drawer.Screen name="Search" component={SearchScreen} />

        {/* Toon login- en registerpagina's als gebruiker niet is ingelogd */}
        {!currentUser && (
          <>
            <Drawer.Screen name="Login" component={LoginScreen} />
            <Drawer.Screen name="Register" component={RegisterScreen} />
          </>
        )}

        {/* Toon profiel- en favorietenpagina's als gebruiker is ingelogd */}
        {currentUser && (
          <>
            <Drawer.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Profiel' }}
            />
            <Drawer.Screen
              name="Favorites"
              component={FavoritesScreen}
              options={{ title: 'Favorieten' }}
            />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigator;
