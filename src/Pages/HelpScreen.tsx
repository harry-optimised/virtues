import React, { useCallback } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchFrames, selectAllFrames } from '../state/frames';

// UI
import { ScrollView, Touchable, TouchableOpacity, View } from 'react-native';
import {
  Divider,
  List,
  Switch,
  Paragraph,
  Headline,
  Subheading
} from 'react-native-paper';

// Utils
import { capitalize } from 'lodash';

const HelpScreen: React.FC = () => {
  return (
    <ScrollView style={{ height: '100%', padding: 16 }}>
      <Headline>The Virtues</Headline>
      <Paragraph>
        Benjamin Franklin, one of the Founding Fathers of the United States,
        devised a list of thirteen virtues which encapsulate qualities for
        personal improvement and moral excellence. These virtues serve as
        guiding principles to cultivate character and virtuous habits. From
        temperance to humility, each virtue aims to instill a balanced and
        ethical way of living.
      </Paragraph>
      <Headline>The Process</Headline>
      <Paragraph>
        Franklin's method for personal development involved a meticulous and
        systematic approach. He would concentrate on one specific virtue each
        week, allowing him to cycle through the entire list four times a year.
        Throughout the week, Franklin would reflect on his adherence to the
        chosen virtue and mark any lapses with a small dot. Over time, this
        practice was intended to reduce the number of marks as his moral
        discipline improved.
      </Paragraph>
      <Headline>How To</Headline>
      <Paragraph>
        Using this app, you can engage with Franklin's virtues in a modern and
        digital way. Simply select the virtue you wish to focus on for the week.
        As you navigate through your week, whenever you find yourself straying
        from your chosen virtue, tap the corresponding square for the day to add
        a mark. This digital "dot" serves as a gentle reminder of your
        commitment and a nudge back towards your goal. The app allows for
        flexibility and personalization—visit the settings to customize your own
        set of virtues that resonate with your personal growth objectives. At
        the end of each week, review your progress, reflect on the experiences,
        and prepare to advance to the next virtue. With consistent use, you'll
        cultivate a habit of self-awareness and continuous self-improvement.
      </Paragraph>
      <Paragraph></Paragraph>
    </ScrollView>
  );
};

export default HelpScreen;
