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
import LogoutScreen from '../screens/LogoutScreen'; // Importeer LogoutScreen
import { auth } from '../firebaseConfig';

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe; // Cleanup
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
        }}
      >
        {/* Home navigatie via HomeStack */}
        <Drawer.Screen
          name="HomeStack"
          component={HomeStack}
          options={{ title: 'Home' }}
        />
        <Drawer.Screen name="Search" component={SearchScreen} />

        {!currentUser && (
          <>
            <Drawer.Screen name="Login" component={LoginScreen} />
            <Drawer.Screen name="Register" component={RegisterScreen} />
          </>
        )}

        {currentUser && (
          <>
            <Drawer.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Profile' }}
            />
            <Drawer.Screen
              name="Favorites"
              component={FavoritesScreen}
              options={{ title: 'Favorieten' }}
            />
            <Drawer.Screen
              name="Logout"
              component={LogoutScreen}
              options={{ title: 'Logout' }}
            />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigator;
