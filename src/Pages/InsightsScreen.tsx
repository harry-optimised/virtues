import React, { useCallback } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchFrames, selectAllFrames } from '../state/frames';

// UI
import { ScrollView, Touchable, TouchableOpacity, View } from 'react-native';
import { Divider, List, Switch, Paragraph, Headline, Subheading } from 'react-native-paper';

// Utils
import { capitalize } from 'lodash'

const InsightsScreen: React.FC = () => {
  return (
  <ScrollView style={{ height: '100%', padding: 8 }}>
   
  </ScrollView>
  );
};

export default InsightsScreen;
