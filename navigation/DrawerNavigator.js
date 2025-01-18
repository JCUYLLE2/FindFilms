import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen'; // <-- ProfileScreen importeren
import { auth } from '../firebaseConfig'; // Importeer Firebase-auth

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// HomeStack voor Home en Details
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Header van Stack.Navigator uitschakelen
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
        {/* Gebruik HomeStack voor Home */}
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
            {/* Profile alleen tonen als iemand is ingelogd */}
            <Drawer.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Profile' }}
            />

            <Drawer.Screen
              name="Logout"
              component={() => {
                auth.signOut();
                return null;
              }}
              options={{
                drawerLabel: `Logout (${currentUser.email})`,
              }}
            />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigator;
