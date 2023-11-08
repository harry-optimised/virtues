import React, { useCallback } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchFrames, selectAllFrames } from '../state/frames';

// UI
import { ScrollView, Touchable, TouchableOpacity, View } from 'react-native';
import { Divider, List, Switch, Text } from 'react-native-paper';

// Utils
import { capitalize } from 'lodash'

const SettingsScreen: React.FC = () => {
  const frames = useSelector(selectAllFrames);
  const [expanded, setExpanded] = React.useState(true);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const handlePress = () => setExpanded(!expanded);

  const handleDelete = useCallback(() => {
    console.log('delete')
  }, []);

  const handleChangeName = useCallback(() => {
    console.log('change name')
  }, []);

  const resetStartDate = useCallback(() => {
    console.log('reset start date')
  }, []);

  const onToggleSwitch = useCallback(() => {
    setIsSwitchOn((prev) => !prev);
  }, []);

  const onAddCourse = useCallback(() => {
    console.log('add course')
  }, []);

  return (
  <ScrollView style={{ height: '100%' }}>

    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 8, marginVertical: 16}}>
      <Text>
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color='#5D3754' disabled={true}/>
      </Text>
      <Text variant='labelLarge' style={{marginLeft: 8}}>Enable syncing of data to remote server</Text>
    </View>
    <Divider />

    <List.Section title="Manage Courses">
      {frames.map((frame) => (
        <List.Accordion
          key={frame.id}
          style={{backgroundColor: '#f2f2f2'}}
          title={frame.name}
          left={props => <List.Icon {...props} icon="folder" />}
          expanded={expanded}
          onPress={handlePress}>
          <View style={{paddingLeft: 0, marginLeft: 16}}>
            <TouchableOpacity onPress={handleChangeName}>
              <List.Item title='Change name' description={frame.name} left={props => <List.Icon {...props} icon="pencil" />}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetStartDate}>
              <List.Item title='Reset start date' description={new Date(frame.date).toDateString()} left={props => <List.Icon {...props} icon="calendar" />}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>  
              <List.Item title='Delete' description='Delete this course' left={props => <List.Icon {...props} icon="delete" />}  />
            </TouchableOpacity>
            <List.Accordion title='Virtues' description='Click a virtue to edit'  style={{backgroundColor: '#f2f2f2'}}>
              {Object.keys(frame.data).map((virtue) => (
              <List.Item title={capitalize(virtue)} description={frame.data[virtue].tagLine} left={props => <List.Icon {...props} icon="pencil" />} />
            ))}
            </List.Accordion>
            
          </View>
          


            
              
            
        </List.Accordion>
      ))}
      <TouchableOpacity onPress={onAddCourse}>
        <List.Item title="Add course" left={props => <List.Icon {...props} icon="plus" />} />
      </TouchableOpacity>
    </List.Section>
  </ScrollView>);
};

export default SettingsScreen;
