import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type VirtueCellProps = {
  virtue: string;
  highlighted: boolean;
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center'
  }
});

const VirtueCell: React.FC<VirtueCellProps> = ({ virtue, highlighted }) => {
  // Function to capitalize the first letter of the string
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: highlighted ? '#F1E9E4' : 'white' }
      ]}
    >
      <Text style={styles.text}>{capitalize(virtue)}</Text>
    </View>
  );
};

export default VirtueCell;
