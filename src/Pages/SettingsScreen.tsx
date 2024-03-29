import React, { useCallback, useEffect } from 'react';

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
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import {
  Divider,
  List,
  Portal,
  Switch,
  Text,
  Modal,
  Button,
  TextInput,
  Headline,
  SegmentedButtons,
  Tooltip,
  RadioButton
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [newCourseSeed, setNewCourseSeed] = React.useState(true);

  const [value, setValue] = React.useState('');

  const reset = useCallback(() => {
    setNewCourseName('');
    setNewCourseSeed(true);
    setnewName('');
    setIsSwitchOn(false);
    setDeleteVisible(false);
    setDuplicateVisible(false);
    setNewCourseVisible(false);
    setNewNameVisible(false);
    setNewStartDateVisible(false);
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('active');
        if (value !== null) {
          setValue(value);
        }
      } catch (e) {
        // error reading value
      }
    };

    getData();
  }, []);

  const onRadioChange = useCallback((newValue) => {
    setValue(newValue);
    AsyncStorage.setItem('active', newValue);
  }, []);

  const handlePress = useCallback((id: string) => {
    setExpanded((prev) => (prev === id ? '' : id));
  }, []);

  const handleDelete = useCallback(() => {
    const current = frames.findIndex((frame) => frame.id === expanded);
    dispatch(deleteFrame(frames[current]));
    reset();
  }, [frames, expanded]);

  const handleChangeName = useCallback(() => {
    if (newName === '') return;
    const current = frames.findIndex((frame) => frame.id === expanded);

    // Check if course name already exists
    const allCourseNames = frames.map((frame) => frame.name);
    if (allCourseNames.includes(newCourseName)) return;

    dispatch(
      updateFrame({
        ...frames[current],
        name: newName
      })
    );
    reset();
  }, [newName, frames]);

  const setStartDate = useCallback(
    (event, selectedDate) => {
      const current = frames.findIndex((frame) => frame.id === expanded);
      setNewStartDate(selectedDate);
      dispatch(
        updateFrame({
          ...frames[current],
          date: selectedDate.toISOString()
        })
      );
      reset();
    },
    [frames, expanded]
  );

  const onToggleSwitch = useCallback(() => {
    setIsSwitchOn((prev) => !prev);
  }, []);

  const onAddCourse = useCallback(() => {
    if (!newCourseName) return;

    // Check if course name already exists
    const allCourseNames = frames.map((frame) => frame.name);
    if (allCourseNames.includes(newCourseName)) return;

    dispatch(createFrame({ name: newCourseName, seed: newCourseSeed }));
    reset();
  }, [newCourseName, newCourseSeed, frames]);

  const onCopyCourse = useCallback(() => {
    const current = frames.findIndex((frame) => frame.id === expanded);
    dispatch(duplicateFrame(frames[current].id));
    reset();
  }, [frames, expanded]);

  const iOSDatePicker = (
    <Modal
      visible={newStartDateVisible}
      onDismiss={() => setNewStartDateVisible(false)}
      contentContainerStyle={{
        backgroundColor: 'white',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}
    >
      <Headline>Change Start Date</Headline>
      <DateTimePicker
        display="inline"
        style={{ marginTop: 16, marginHorizontal: 0, paddingHorizontal: 0 }}
        testID="dateTimePicker"
        value={newStartDate}
        mode="date"
        onChange={setStartDate}
      />
    </Modal>
  );

  const androidDatePicker = (
    <DateTimePicker
      testID="dateTimePicker"
      value={newStartDate}
      mode="date"
      onChange={setStartDate}
    />
  );

  return (
    <>
      <Portal>
        <Modal
          visible={newNameVisible}
          onDismiss={() => setNewNameVisible(false)}
          style={{ bottom: '50%' }}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 16
          }}
        >
          <Headline>Change Name</Headline>
          <Text>Maximum 20 characters</Text>
          <TextInput
            label="Name"
            mode="outlined"
            defaultValue={newName}
            onChangeText={(text) =>
              setnewName(text.length <= 20 ? text : text.slice(0, 20))
            }
            style={{ marginVertical: 16 }}
          />
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              onPress={() => {
                setNewNameVisible(false);
                handleChangeName();
              }}
            >
              Rename
            </Button>
          </View>
        </Modal>
        {newStartDateVisible &&
          (Platform.OS === 'ios' ? iOSDatePicker : androidDatePicker)}
        <Modal
          visible={duplicateVisible}
          onDismiss={() => setDuplicateVisible(false)}
          style={{ bottom: '50%' }}
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
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              onPress={() => {
                setDuplicateVisible(false);
                onCopyCourse();
              }}
            >
              Duplicate
            </Button>
          </View>
        </Modal>
        <Modal
          visible={deleteVisible}
          onDismiss={() => setDeleteVisible(false)}
          style={{ bottom: '50%' }}
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
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              onPress={() => {
                setDeleteVisible(false);
                handleDelete();
              }}
            >
              Delete
            </Button>
          </View>
        </Modal>
        <Modal
          visible={newCourseVisible}
          onDismiss={() => setNewCourseVisible(false)}
          style={{ bottom: '50%' }}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 16
          }}
        >
          <Headline>Add a New Course</Headline>
          <Text>Maximum 20 characters</Text>
          <TextInput
            label="Name"
            mode="outlined"
            defaultValue={newCourseName}
            onChangeText={(text) =>
              setNewCourseName(text.length <= 20 ? text : text.slice(0, 20))
            }
            style={{ marginVertical: 16 }}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Switch
              value={newCourseSeed}
              style={{ marginRight: 8 }}
              onValueChange={() => setNewCourseSeed((prev) => !prev)}
              color="#6F5E53"
            />
            <Text>Fill with Franklin's original virtues</Text>
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              onPress={() => {
                setNewCourseVisible(false);
                onAddCourse();
              }}
            >
              Add
            </Button>
          </View>
        </Modal>
      </Portal>
      <ScrollView style={{ height: '100%' }}>
        {/* <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            marginTop: 16
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
          <Text variant="labelLarge" style={{ marginLeft: 8, opacity: 0.5 }}>
            Enable syncing of data to remote server
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 8,
            paddingRight: 16,
            marginBottom: 16
          }}
        >
          <Text variant="labelSmall" style={{ marginLeft: 8, opacity: 0.5 }}>
            Syncing to remote server is a feature soon to be released. For now,
            all data is stored locally on your device.
          </Text>
        </View> */}

        {/* <View style={{ padding: 8 }}>
          <Text>
            How many virtues do you want active at the same time? Whilst you can
            always log entries on any virtue at any time, this option will that
            clearer visually.
          </Text>
          <RadioButton.Group
            onValueChange={(newValue) => onRadioChange(newValue)}
            value={value}
          >
            <View
              style={{
                paddingTop: 8,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <RadioButton value="one" />
              <Text>One virtue at a time</Text>
            </View>
            <View
              style={{
                paddingTop: 8,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <RadioButton value="cumulative" />
              <Text>Virtues accumulate as you progress</Text>
            </View>
            <View
              style={{
                paddingTop: 8,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <RadioButton value="all" />
              <Text>All virtues active at the same time</Text>
            </View>
          </RadioButton.Group>
        </View> */}

        <List.Section>
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
                <TouchableOpacity
                  onPress={() => {
                    setnewName(frame.name);
                    setNewNameVisible(true);
                  }}
                >
                  <List.Item
                    title="Change name"
                    description={frame.name}
                    left={(props) => <List.Icon {...props} icon="pencil" />}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setNewStartDate(new Date(frame.date));
                    setNewStartDateVisible(true);
                  }}
                >
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
                    title={`Virtues (${Object.keys(frame.data).length})`}
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
    </>
  );
};

export default SettingsScreen;
