import React from "react";

// UI
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme, MD3Theme } from 'react-native-paper';

// Utils
import { capitalize } from 'lodash';

type VirtueCellProps = {
  virtue: string;
  highlighted: boolean;
  selected: boolean;
};

export const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      height: 48,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderWidth: 0.25,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.background
    },
    text: {
      textAlign: 'center'
    },
    selected: {
      borderWidth: 3
    },
    highlighted: {
      backgroundColor: theme.colors.secondary
    }
  });

const VirtueCell: React.FC<VirtueCellProps> = ({
  virtue,
  highlighted,
  selected
}) => {
  
  // Theme
  const theme = useTheme();
  const styles = createStyles(theme);
  
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
