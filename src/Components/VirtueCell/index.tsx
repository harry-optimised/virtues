import React from "react";

// UI
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import THEME from '../../theme';

// Utils
import { capitalize } from 'lodash';


type VirtueCellProps = {
  virtue: string;
  highlighted: boolean;
  selected: boolean;
};

export const styles =  StyleSheet.create({
    container: {
      height: 48,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderWidth: 0.25,
      borderColor: THEME.colors.primary,
      backgroundColor: THEME.colors.background
    },
    text: {
      textAlign: 'center'
    },
    selected: {
      borderWidth: 3
    },
    highlighted: {
      backgroundColor: THEME.colors.secondary
    }
});

const VirtueCell: React.FC<VirtueCellProps> = ({
  virtue,
  highlighted,
  selected
}) => {
  
  const width = Dimensions.get('window').width;  
  const widthStyle = { width: 2 * (width / 9) };

  return (
    <View
      testID="virtue-cell"
      style={[
        styles.container,
        selected ? styles.selected : null,
        highlighted ? styles.highlighted : null,
        widthStyle
      ]}
    >
      <Text variant="labelMedium" style={styles.text}>
        {capitalize(virtue)}
      </Text>
    </View>
  );
};

export default VirtueCell;
