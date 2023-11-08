import React, { useCallback } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllFrames,
  updateFrame,
  duplicateFrame,
  deleteFrame
} from '../state/frames';

// UI
import { ScrollView, TouchableOpacity, View } from 'react-native';
import {
  Divider,
  List,
  PaperProvider,
  Portal,
  Switch,
  Text,
  Modal,
  Button,
  TextInput
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

// Utils
import { capitalize } from 'lodash';
import { AppDispatch } from '../state/store';

const SettingsScreen: React.FC = () => {
  const frames = useSelector(selectAllFrames);
  const dispatch = useDispatch<AppDispatch>();
  const [expanded, setExpanded] = React.useState('');
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const [newNameVisible, setNewNameVisible] = React.useState(false);
  const [newName, setnewName] = React.useState('');

  const [newStartDateVisible, setNewStartDateVisible] = React.useState(false);
  const [newStartDate, setNewStartDate] = React.useState(new Date());

  const [duplicateVisible, setDuplicateVisible] = React.useState(false);
  const [deleteVisible, setDeleteVisible] = React.useState(false);

  const handlePress = useCallback((id: string) => {
    setExpanded((prev) => (prev === id ? '' : id));
  }, []);

  const handleDelete = useCallback(() => {
    const current = frames.findIndex((frame) => frame.id === expanded);
    dispatch(deleteFrame(frames[current]));
  }, [frames, expanded]);

  const handleChangeName = useCallback(() => {
    const current = frames.findIndex((frame) => frame.id === expanded);

    dispatch(
      updateFrame({
        ...frames[current],
        name: newName
      })
    );
  }, [newName]);

  const setStartDate = useCallback((event, selectedDate) => {
    const current = frames.findIndex((frame) => frame.id === expanded);

    dispatch(
      updateFrame({
        ...frames[current],
        date: selectedDate.toISOString()
      })
    );
    setNewStartDateVisible(false);
  }, []);

  const onToggleSwitch = useCallback(() => {
    setIsSwitchOn((prev) => !prev);
  }, []);

  const onAddCourse = useCallback(() => {
    console.log('add course');
  }, []);

  const onCopyCourse = useCallback(() => {
    const current = frames.findIndex((frame) => frame.id === expanded);
    dispatch(duplicateFrame({ id: frames[current].id }));
  }, [frames, expanded]);

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={newNameVisible}
          onDismiss={() => setNewNameVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 16
          }}
        >
          <TextInput
            label="Name"
            mode="outlined"
            value={newName}
            onChangeText={(text) => setnewName(text)}
          />
          <Button
            onPress={() => {
              setNewNameVisible(false);
              handleChangeName();
            }}
          >
            Rename
          </Button>
        </Modal>
        {newStartDateVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={newStartDate}
            mode="date"
            onChange={setStartDate}
          />
        )}
        <Modal
          visible={duplicateVisible}
          onDismiss={() => setDuplicateVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 16
          }}
        >
          <Text>Are you sure you want to duplicate this course?</Text>
          <Button
            onPress={() => {
              setDuplicateVisible(false);
              onCopyCourse();
            }}
          >
            Duplicate
          </Button>
        </Modal>
        <Modal
          visible={deleteVisible}
          onDismiss={() => setDeleteVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 16
          }}
        >
          <Text>Are you sure you want to delete this course?</Text>
          <Button
            onPress={() => {
              setDeleteVisible(false);
              handleDelete();
            }}
          >
            Delete
          </Button>
        </Modal>
      </Portal>
      <ScrollView style={{ height: '100%' }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            marginVertical: 16
          }}
        >
          <Text>
            <Switch
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
              color="#5D3754"
              disabled={true}
            />
          </Text>
          <Text variant="labelLarge" style={{ marginLeft: 8 }}>
            Enable syncing of data to remote server
          </Text>
        </View>
        <Divider />

        <List.Section title="Manage Courses">
          {frames.map((frame) => (
            <List.Accordion
              key={frame.id}
              style={{ backgroundColor: '#f2f2f2' }}
              title={frame.name}
              left={(props) => <List.Icon {...props} icon="folder" />}
              expanded={expanded === frame.id}
              onPress={() => handlePress(frame.id)}
            >
              <View style={{ paddingLeft: 0, marginLeft: 16 }}>
                <TouchableOpacity onPress={() => setNewNameVisible(true)}>
                  <List.Item
                    title="Change name"
                    description={frame.name}
                    left={(props) => <List.Icon {...props} icon="pencil" />}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setNewStartDateVisible(true)}>
                  <List.Item
                    title="Set start date"
                    description={new Date(frame.date).toDateString()}
                    left={(props) => <List.Icon {...props} icon="calendar" />}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDuplicateVisible(true)}>
                  <List.Item
                    title="Duplicate"
                    description="Duplicate this course"
                    left={(props) => (
                      <List.Icon {...props} icon="content-copy" />
                    )}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDeleteVisible(true)}>
                  <List.Item
                    title="Delete"
                    description="Delete this course"
                    left={(props) => <List.Icon {...props} icon="delete" />}
                  />
                </TouchableOpacity>
                <List.Accordion
                  title="Virtues"
                  description="Click a virtue to edit"
                  style={{ backgroundColor: '#f2f2f2' }}
                >
                  {Object.keys(frame.data).map((virtue) => (
                    <List.Item
                      key={virtue}
                      title={capitalize(virtue)}
                      description={frame.data[virtue].tagLine}
                      left={(props) => <List.Icon {...props} icon="pencil" />}
                    />
                  ))}
                </List.Accordion>
              </View>
            </List.Accordion>
          ))}
          <TouchableOpacity onPress={onAddCourse}>
            <List.Item
              title="Add course"
              left={(props) => <List.Icon {...props} icon="plus" />}
            />
          </TouchableOpacity>
        </List.Section>
      </ScrollView>
    </PaperProvider>
  );
};

export default SettingsScreen;
