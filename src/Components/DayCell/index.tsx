import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Utils
import { capitalize } from 'lodash';

type DayCellProps = {
  day: string;
  highlighted: boolean;
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center'
  }
});

const DayCell: React.FC<DayCellProps> = ({ day, highlighted }) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: highlighted ? '#F1E9E4' : 'white' }
      ]}
    >
      <Text style={styles.text}>{capitalize(day)}</Text>
    </View>
  );
};

export default DayCell;
