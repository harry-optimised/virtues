import React, { useCallback } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllFrames,
  updateFrame,
  duplicateFrame,
  deleteFrame,
  createFrame
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
  TextInput,
  Headline
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

// Utils
import { capitalize } from 'lodash';
import { AppDispatch } from '../state/store';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen: React.FC = () => {
  const frames = useSelector(selectAllFrames);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [expanded, setExpanded] = React.useState('');
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const [newNameVisible, setNewNameVisible] = React.useState(false);
  const [newName, setnewName] = React.useState('');

  const [newStartDateVisible, setNewStartDateVisible] = React.useState(false);
  const [newStartDate, setNewStartDate] = React.useState(new Date());

  const [duplicateVisible, setDuplicateVisible] = React.useState(false);
  const [deleteVisible, setDeleteVisible] = React.useState(false);

  const [newCourseVisible, setNewCourseVisible] = React.useState(false);
  const [newCourseName, setNewCourseName] = React.useState('');

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
    dispatch(createFrame({ name: newCourseName }));
  }, [newCourseName]);

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
          <Headline>Change Name</Headline>
          <TextInput
            label="Name"
            mode="outlined"
            value={newName}
            onChangeText={(text) => setnewName(text)}
            style={{ marginVertical: 16 }}
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
          <Headline>Duplicate Course</Headline>
          <Text style={{ marginVertical: 16 }}>
            Are you sure you want to duplicate this course?
          </Text>
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
          <Headline>Delete Course</Headline>
          <Text style={{ marginVertical: 16 }}>
            Are you sure you want to delete this course? This action cannot be
            undone.
          </Text>
          <Button
            onPress={() => {
              setDeleteVisible(false);
              handleDelete();
            }}
          >
            Delete
          </Button>
        </Modal>
        <Modal
          visible={newCourseVisible}
          onDismiss={() => setNewCourseVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 16
          }}
        >
          <Headline>Add a New Course</Headline>
          <TextInput
            label="Name"
            mode="outlined"
            value={newCourseName}
            onChangeText={(text) => setNewCourseName(text)}
            style={{ marginVertical: 16 }}
          />
          <Button
            onPress={() => {
              setNewCourseVisible(false);
              onAddCourse();
            }}
          >
            Add
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
              color="#6F5E53"
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
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EditVirtues', { frameIndex: frame.id })
                  }
                >
                  <List.Item
                    title="Virtues"
                    description="Manage virtues in this course"
                    left={(props) => (
                      <List.Icon {...props} icon="flower-tulip" />
                    )}
                  />
                </TouchableOpacity>
              </View>
            </List.Accordion>
          ))}
          <TouchableOpacity onPress={() => setNewCourseVisible(true)}>
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
