import React, { useState, useEffect } from 'react';

// Redux
import { Provider, useDispatch } from 'react-redux';
import { fetchFrames } from './src/state/frames';
import store, { AppDispatch } from './src/state/store';

// Screens
import VirtuesScreen from './src/Pages/VirtuesScreen';
import SettingsScreen from './src/Pages/SettingsScreen';
import ProfileScreen from './src/Pages/ProfileScreen';

import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1b365d'
  },
  tabBar: {
    backgroundColor: '#1b365d',
    paddingBottom: 4,
    paddingTop: 8,
    height: 60
  }
});

export type RootStackParamList = {
  Main: undefined;
  Profile: undefined;
  Messages: undefined;
  MessagesDetail: undefined;
  Book: undefined;
  Options: undefined;
  Search: undefined;
};

const Tab = createBottomTabNavigator();

function ReduxApp(): JSX.Element | null {
  const [appIsReady, setAppIsReady] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function loadApp() {
      dispatch(fetchFrames());
      setAppIsReady(true);
    }
    loadApp();
  }, []);

  const loadingScreenRender = (
    <View>
      <Text>Loading...</Text>
    </View>
  );

  const appRender = (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: styles.header,
          headerTintColor: 'white',
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#A1BCE3',
          tabBarStyle: styles.tabBar
        }}
      >
        <Tab.Screen
          name="Virtues"
          component={VirtuesScreen}
          options={() => ({
            headerStyle: styles.header,
            headerTintColor: 'white',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="flower-tulip"
                color={color}
                size={size}
              />
            )
          })}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={() => ({
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" color={color} size={size} />
            )
          })}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={() => ({
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            )
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );

  return appIsReady ? appRender : loadingScreenRender;
}

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ReduxApp />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
