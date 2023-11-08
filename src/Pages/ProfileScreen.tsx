import React from 'react';

import { View, StyleSheet } from 'react-native';
import { sharedStyles } from '../SharedStyles';

const styles = StyleSheet.create({
  ...sharedStyles,
  container: {
    padding: 16
  },
  textContainer: {
    margin: 0
  },
  header: {
    fontSize: 18,
    marginBottom: 16,
    color: '#1b365d'
  },
  avatar: {
    backgroundColor: '#CCCCCC'
  },
  label: {
    fontSize: 18,
    marginBottom: 16,
    color: '#1b365d'
  },
  value: {
    fontSize: 18,
    marginBottom: 16,
    color: '#1b365d'
  }
});

const ProfileScreen: React.FC = () => {
  return <View style={styles.container}></View>;
};

export default ProfileScreen;
