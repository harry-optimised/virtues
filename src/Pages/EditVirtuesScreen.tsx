import React, { useCallback, useEffect, useState } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
  OrderUpdate,
  fetchFrames,
  selectById,
  updateOrder,
  updateFrame
} from '../state/frames';

// UI
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
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
  Card,
  IconButton
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DraggableFlatList, {
  ScaleDecorator
} from 'react-native-draggable-flatlist';

// Utils
import { capitalize, debounce, set } from 'lodash';
import { AppDispatch, RootState } from '../state/store';
import { Virtue } from '../api/types';

const styles = StyleSheet.create({
  rowItem: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  text: {
    color: '#6F5E53'
  }
});

type Item = {
  key: string;
  name: string;
  virtue: Virtue;
};

const EditVirtuesScreen: React.FC = ({ route }) => {
  const { frameIndex } = route.params;
  const [data, setData] = useState<Item[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const frame = useSelector((state: RootState) =>
    selectById(state, frameIndex)
  );

  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [modalVirtue, setModalVirtue] = React.useState<string>('');
  const containerStyle = { backgroundColor: 'white', padding: 20 };
  const [newVirtueName, setNewVirtueName] = React.useState('');
  const [newVirtueTagline, setNewVirtueTagline] = React.useState('');
  const [confirmSure, setConfirmSure] = React.useState(false);

  const [newVirtueVisible, setNewVirtueVisible] = React.useState(false);
  const [newVirtueName2, setNewVirtueName2] = React.useState('');
  const [newVirtueTagline2, setNewVirtueTagline2] = React.useState('');

  useEffect(() => {
    if (!frame) return;
    const unorderedData = Object.keys(frame.data).map((key) => ({
      key: key,
      name: key,
      virtue: frame.data[key]
    }));

    const orderedData = unorderedData.sort(
      (a, b) => a.virtue.order - b.virtue.order
    );

    setData(orderedData);
  }, [frame]);

  const onDragEnd = useCallback(({ data }: { data: Item[] }) => {
    const newOrder: Record<string, number> = {};
    data.forEach((item, index) => {
      newOrder[item.key] = index;
    });

    const orderUpdate: OrderUpdate = {
      id: frameIndex,
      order: newOrder
    };
    dispatch(updateOrder({ orderUpdate })).then(() => {
      dispatch(fetchFrames());
    });
    setData(data);
  }, []);

  const onChangeVirtue = useCallback(
    (oldVirtueName: string) => {
      if (!frame) return;
      if (newVirtueName === '') return;
      const virtue = frame.data[oldVirtueName];
      const updatedData = {
        ...frame.data,
        [newVirtueName]: {
          ...virtue,
          name: newVirtueName,
          tagLine: newVirtueTagline
        }
      };
      // Delete old virtue.
      if (oldVirtueName !== newVirtueName) {
        delete updatedData[oldVirtueName as keyof typeof updatedData];
      }
      dispatch(updateFrame({ ...frame, data: updatedData })).then(() =>
        dispatch(fetchFrames())
      );
    },
    [frame, newVirtueName, newVirtueTagline]
  );

  const onNewVirtue = useCallback(() => {
    if (!frame) return;
    if (newVirtueName2 === '') return;

    // Check name not already used.
    if (frame.data[newVirtueName2]) return;

    const updatedData = {
      ...frame.data,
      [newVirtueName2]: {
        tagLine: newVirtueTagline2,
        order: Object.keys(frame.data).length + 1,
        log: [0, 0, 0, 0, 0, 0, 0]
      }
    };

    dispatch(updateFrame({ ...frame, data: updatedData })).then(() =>
      dispatch(fetchFrames())
    );
    setNewVirtueName2('');
    setNewVirtueTagline2('');
  }, [frame, newVirtueName2, newVirtueTagline2]);

  const onDeleteVirtue = useCallback(
    (virtueName: string) => {
      if (!frame) return;
      const updatedData = { ...frame.data };
      delete updatedData[virtueName as keyof typeof updatedData];
      dispatch(updateFrame({ ...frame, data: updatedData })).then(() =>
        dispatch(fetchFrames())
      );
    },
    [frame]
  );

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          onPress={() => {
            setModalVirtue(item.name);
            setNewVirtueName(item.name);
            setNewVirtueTagline(item.virtue.tagLine);
            showModal();
          }}
          disabled={isActive}
          style={[
            styles.rowItem,
            { backgroundColor: isActive ? '#E2D5CB' : item.backgroundColor }
          ]}
        >
          <View style={{ borderBottomWidth: 0.25, width: '100%', padding: 16 }}>
            <Text variant="titleLarge" style={styles.text}>
              {capitalize(item.name)}
            </Text>
            <Text
              variant="titleSmall"
              style={{ color: '#6F5E53', marginTop: 8 }}
            >
              {item.virtue.tagLine}
            </Text>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <>
      <Portal>
        <Modal
          visible={newVirtueVisible}
          onDismiss={() => setNewVirtueVisible(false)}
          style={{ bottom: '50%' }}
          contentContainerStyle={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 20,
            margin: 16
          }}
        >
          <Headline>New Virtue</Headline>
          <TextInput
            label="Name"
            mode="outlined"
            defaultValue={newVirtueName2}
            onChangeText={(text) =>
              setNewVirtueName2(text.length < 12 ? text : text.slice(0, 12))
            }
            style={{ marginVertical: 16 }}
          />
          <TextInput
            label="Tagline"
            mode="outlined"
            multiline={true}
            defaultValue={newVirtueTagline2}
            onChangeText={(text) => setNewVirtueTagline2(text)}
            style={{ marginVertical: 16 }}
          />

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              onPress={() => {
                onNewVirtue();
                setNewVirtueVisible(false);
              }}
            >
              Add
            </Button>
          </View>
        </Modal>
        <Modal
          visible={visible}
          onDismiss={() => {
            hideModal();
            setConfirmSure(false);
          }}
          style={{ bottom: '40%' }}
          contentContainerStyle={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 16,
            paddingHorizontal: 20,
            margin: 16
          }}
        >
          {confirmSure && (
            <>
              <Headline>Delete {capitalize(modalVirtue)}?</Headline>
              <Text>Are you sure you want to delete this virtue?</Text>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end'
                }}
              >
                <Button
                  onPress={() => {
                    hideModal();
                    setConfirmSure(false);
                    onDeleteVirtue(modalVirtue || '');
                  }}
                >
                  Delete
                </Button>
              </View>
            </>
          )}
          {!confirmSure && (
            <>
              <Headline>Update Virtue</Headline>
              <TextInput
                label="Name - maximum 12 characters"
                mode="outlined"
                defaultValue={newVirtueName}
                onChangeText={(text) =>
                  setNewVirtueName(text.length < 12 ? text : text.slice(0, 12))
                }
                style={{ marginVertical: 16 }}
              />
              <TextInput
                label="Tagline - maximum 5 lines"
                mode="outlined"
                multiline={true}
                numberOfLines={5}
                defaultValue={newVirtueTagline}
                onChangeText={(text) => {
                  return setNewVirtueTagline(
                    text.split('\n').slice(0, 5).join('\n')
                  );
                }}
                style={{ marginVertical: 16, maxHeight: 150 }}
              />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Button
                  onPress={() => {
                    setConfirmSure(true);
                  }}
                >
                  Delete
                </Button>
                <Button
                  onPress={() => {
                    hideModal();
                    setConfirmSure(false);
                    onChangeVirtue(modalVirtue || '');
                  }}
                >
                  Update
                </Button>
              </View>
            </>
          )}
        </Modal>
      </Portal>
      {data.length > 0 && (
        <DraggableFlatList
          data={data}
          style={{ width: '100%' }}
          onDragEnd={onDragEnd}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
        />
      )}
      {data.length === 0 && (
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text variant="titleLarge" style={{ color: '#6F5E53' }}>
            No Virtues
          </Text>
          <Text
            variant="bodyMedium"
            style={{ marginTop: 16, color: '#6F5E53' }}
          >
            Add a virtue to get started.
          </Text>
        </View>
      )}
      <View
        style={{
          bottom: 16,
          right: 16,
          position: 'absolute'
        }}
      >
        <IconButton
          icon="plus"
          mode="contained"
          style={{ backgroundColor: '#6F5E53', borderRadius: 8 }}
          iconColor="white"
          size={32}
          onPress={() => setNewVirtueVisible(true)}
        />
      </View>
    </>
  );
};

export default EditVirtuesScreen;
