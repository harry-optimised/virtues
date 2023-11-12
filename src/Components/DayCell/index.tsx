import React from 'react';

// UI
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import THEME from '../../theme';

// Utils
import { capitalize } from 'lodash';


interface DayCellProps {
  day: string;
  highlighted: boolean;
}

export const styles = StyleSheet.create({
    container: {
      height: 48,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderWidth: 0.25,
      borderColor: '#6F5E53',
      backgroundColor: THEME.colors.background
    },
    text: {
      textAlign: 'center'
    },
    highlighted: {
      backgroundColor: THEME.colors.secondary
    }
  });



const DayCell: React.FC<DayCellProps> = ({ day, highlighted }) => {

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
