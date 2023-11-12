import React from 'react';

// UI
import { MD3Theme, useTheme } from 'react-native-paper';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Utils
import { capitalize } from 'lodash';

interface DayCellProps {
  day: string;
  highlighted: boolean;
}

export const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      height: 48,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderWidth: 0.25,
      borderColor: '#6F5E53',
      backgroundColor: theme.colors.background
    },
    text: {
      textAlign: 'center'
    },
    highlighted: {
      backgroundColor: theme.colors.secondary
    }
  });



const DayCell: React.FC<DayCellProps> = ({ day, highlighted }) => {

  // Theme
  const theme = useTheme();
  const styles = createStyles(theme);

  const width = Dimensions.get('window').width;
  const widthStyle = { width: width / 9 };

  return (
    <View
      testID="day-cell"
      style={[
        styles.container,
        highlighted ? styles.highlighted : null,
        widthStyle
      ]}
    >
      <Text style={styles.text}>{capitalize(day)}</Text>
    </View>
  );
};

export default DayCell;
