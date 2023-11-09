import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';

type VirtueCellProps = {
  virtue: string;
  highlighted: boolean;
  selected: boolean;
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderWidth: 0.25,
    borderColor: '#6F5E53'
  },
  text: {
    textAlign: 'center'
  }
});

const VirtueCell: React.FC<VirtueCellProps> = ({
  virtue,
  highlighted,
  selected
}) => {
  // Function to capitalize the first letter of the string
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const width = Dimensions.get('window').width;

  return (
    <View
      style={[
        styles.container,
        {
          width: 2 * (width / 9),
          backgroundColor: highlighted ? '#F1E9E4' : 'white',
          borderWidth: selected ? 3 : 0.25
        }
      ]}
    >
      <Text variant="labelMedium" style={styles.text}>
        {capitalize(virtue)}
      </Text>
    </View>
  );
};

export default VirtueCell;
