import React, { useState, useEffect } from 'react';

// Redux
import { Provider, useDispatch } from 'react-redux';
import { fetchFrames } from './src/state/frames';
import store, { AppDispatch } from './src/state/store';

// Screens
import VirtuesScreen from './src/Pages/VirtuesScreen';
import SettingsScreen from './src/Pages/SettingsScreen';
import HelpScreen from './src/Pages/HelpScreen';
import EditVirtuesScreen from './src/Pages/EditVirtuesScreen';

// UI
import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators
} from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//TODO:
// - Fix date popup in iPhone.

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6F5E53'
  },
  tabBar: {
    backgroundColor: '#6F5E53',
    paddingBottom: 4,
    paddingTop: 8,
    height: 60
  }
});

export type RootStackParamList = {
  Main: undefined;
  EditVirtues: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function BottomTabs(): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: 'white',
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#E2D5CB',
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
        name="Guide"
        component={HelpScreen}
        options={() => ({
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="book-open-outline"
              color={color}
              size={size}
            />
          )
        })}
      />
      <Tab.Screen
        name="Manage"
        component={SettingsScreen}
        options={() => ({
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="folder-edit"
              color={color}
              size={size}
            />
          ),
          headerTitle: 'Manage Virtues'
        })}
      />
    </Tab.Navigator>
  );
}

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
      <Stack.Navigator
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerStyle: styles.header,
          headerTintColor: 'white'
        }}
      >
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditVirtues"
          component={EditVirtuesScreen}
          options={{ headerTitle: 'Manage Virtues', headerBackTitle: '' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

  return appIsReady ? appRender : loadingScreenRender;
}

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6F5E53',
    secondary: '#F1E9E4',
    background: '#FFFFFF'
  }
};

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <ReduxApp />
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
}

export default App;
