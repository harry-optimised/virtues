import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

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
    justifyContent: 'center',
    borderWidth: 0.25,
    borderColor: '#6F5E53'
  },
  text: {
    textAlign: 'center'
  }
});

const DayCell: React.FC<DayCellProps> = ({ day, highlighted }) => {
  const width = Dimensions.get('window').width;
  return (
    <View
      style={[
        styles.container,
        { width: width / 9, backgroundColor: highlighted ? '#F1E9E4' : 'white' }
      ]}
    >
      <Text style={styles.text}>{capitalize(day)}</Text>
    </View>
  );
};

export default DayCell;
