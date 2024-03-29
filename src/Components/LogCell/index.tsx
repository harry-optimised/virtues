import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  dotsContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center'
  },
  centerText: {
    textAlign: 'center',
    color: '#6F5E53'
  },
  elementContainer: {
    height: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderColor: '#6F5E53'
  }
});

type DotsProps = {
  value: number;
  border: boolean;
};

const Dots: React.FC<DotsProps> = ({ value, border }) => (
  <View style={[styles.dotsContainer, { padding: border ? 2 : 6 }]}>
    {Array.from(Array(value).keys()).map((_, i) => (
      <MaterialCommunityIcons
        key={i}
        name="square-rounded"
        size={8}
        color="#6F5E53"
      />
    ))}
  </View>
);

type VirtueElementProps = {
  highlighted: boolean;
  selected: boolean;
  value: number;
};

const LogCell: React.FC<VirtueElementProps> = ({
  highlighted,
  selected,
  value
}) => {
  const width = Dimensions.get('window').width;
  let renderedValue = null;

  if (value > 0 && value <= 9) {
    renderedValue = <Dots value={value} border={selected} />;
  } else if (value > 9) {
    renderedValue = <Text style={styles.centerText}>{value}</Text>;
  }

  return (
    <View
      style={[
        styles.elementContainer,
        {
          backgroundColor: highlighted ? '#F1E9E4' : 'white',
          borderWidth: selected ? 3 : 0.25,
          width: width / 9
        }
      ]}
    >
      {renderedValue}
    </View>
  );
};

export default LogCell;
