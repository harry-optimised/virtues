import React, { useCallback, useMemo, useState } from 'react';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectAllFrames, updateFrame } from '../state/frames';

// UI
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Text,
  PaperProvider,
  Portal,
  Modal,
  Button,
  Divider,
  IconButton
} from 'react-native-paper';
import { Table, TableWrapper, Row, Cell } from 'react-native-reanimated-table';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Styles
import { sharedStyles } from '../SharedStyles';

// Utils
import { capitalize } from 'lodash';

// Custom Components
import { AppDispatch } from '../state/store';

const styles = StyleSheet.create({
  ...sharedStyles,
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  row: {
    flexDirection: 'row',
    height: 48
  },
  head: { height: 40 },
  text: { margin: 6, textAlign: 'center' }
});

interface AdjusterProps {
  visible: boolean;
  onSave: (action: string, day: number, virtue: string) => void;
  virtues: string[];
  virtue?: string;
  index?: number;
}

const Adjuster = ({
  visible,
  onSave,
  virtues,
  virtue,
  index
}: AdjusterProps) => {
  const [day, setDay] = React.useState(index ?? 0);
  const containerStyle = {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20
  };
  const [selectedVirtue, setSelectedVirtue] = useState(virtue ?? virtues[0]);

  const onLocalSave = useCallback(
    (action: string) => {
      onSave(action, day, selectedVirtue);
    },
    [day, selectedVirtue]
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => onLocalSave('dismiss')}
        contentContainerStyle={containerStyle}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 16,
            marginBottom: 16
          }}
        >
          <Button
            mode={day === 0 ? 'contained' : 'outlined'}
            style={{ margin: 4, minWidth: 32 }}
            buttonColor={day === 0 ? '#5D3754' : 'white'}
            textColor={day === 0 ? 'white' : '#5D3754'}
            compact={true}
            onPress={() => setDay(0)}
          >
            M
          </Button>
          <Button
            mode={day === 1 ? 'contained' : 'outlined'}
            style={{ margin: 4, minWidth: 32 }}
            buttonColor={day === 1 ? '#5D3754' : 'white'}
            textColor={day === 1 ? 'white' : '#5D3754'}
            compact={true}
            onPress={() => setDay(1)}
          >
            T
          </Button>
          <Button
            mode={day === 2 ? 'contained' : 'outlined'}
            style={{ margin: 4, minWidth: 32 }}
            buttonColor={day === 2 ? '#5D3754' : 'white'}
            textColor={day === 2 ? 'white' : '#5D3754'}
            compact={true}
            onPress={() => setDay(2)}
          >
            W
          </Button>
          <Button
            mode={day === 3 ? 'contained' : 'outlined'}
            style={{ margin: 4, minWidth: 32 }}
            buttonColor={day === 3 ? '#5D3754' : 'white'}
            textColor={day === 3 ? 'white' : '#5D3754'}
            compact={true}
            onPress={() => setDay(3)}
          >
            T
          </Button>
          <Button
            mode={day === 4 ? 'contained' : 'outlined'}
            style={{ margin: 4, minWidth: 32 }}
            buttonColor={day === 4 ? '#5D3754' : 'white'}
            textColor={day === 4 ? 'white' : '#5D3754'}
            compact={true}
            onPress={() => setDay(4)}
          >
            F
          </Button>
          <Button
            mode={day === 5 ? 'contained' : 'outlined'}
            style={{ margin: 4, minWidth: 32 }}
            buttonColor={day === 5 ? '#5D3754' : 'white'}
            textColor={day === 5 ? 'white' : '#5D3754'}
            compact={true}
            onPress={() => setDay(5)}
          >
            S
          </Button>
          <Button
            mode={day === 6 ? 'contained' : 'outlined'}
            style={{ margin: 4, minWidth: 32 }}
            buttonColor={day === 6 ? '#5D3754' : 'white'}
            textColor={day === 6 ? 'white' : '#5D3754'}
            compact={true}
            onPress={() => setDay(6)}
          >
            S
          </Button>
        </View>
        <Divider />
        <View style={{ marginBottom: 0, marginTop: 0 }}>
          <Picker
            selectedValue={selectedVirtue}
            onValueChange={(itemValue) => setSelectedVirtue(itemValue)}
          >
            {virtues.map((v) => (
              <Picker.Item key={v} label={v} value={v} />
            ))}
          </Picker>
        </View>
        <Divider />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16,
            marginBottom: 16
          }}
        >
          <IconButton
            icon="minus"
            mode="contained"
            style={{ backgroundColor: '#5D3754', marginRight: 16 }}
            iconColor="white"
            size={32}
            onPress={() => onLocalSave('minus')}
          />
          <IconButton
            icon="plus"
            mode="contained"
            style={{ backgroundColor: '#5D3754', marginLeft: 16 }}
            iconColor="white"
            size={32}
            onPress={() => onLocalSave('plus')}
          />
        </View>
      </Modal>
    </Portal>
  );
};

const VirtuesScreen: React.FC = () => {
  const frames = useSelector(selectAllFrames);
  const dispatch = useDispatch<AppDispatch>();
  const [current] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  const element = useCallback(
    (virtue: string, index: number) => {
      const Dots = ({ value }: { value: number }) => (
        <View
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center',
            alignContent: 'center',
            padding: 8
          }}
        >
          {Array.from(Array(value).keys()).map((i) => (
            <MaterialCommunityIcons
              key={i}
              name="square-rounded"
              size={8}
              color="#5D3754"
            />
          ))}
        </View>
      );

      const sixPlus = (
        <Text style={{ textAlign: 'center' }}>
          {frames[current].data[virtue][index - 1]}
        </Text>
      );

      let renderedValue = null;
      switch (frames[current].data[virtue][index - 1]) {
        case 0:
          renderedValue = null;
          break;
        case 1:
          renderedValue = <Dots value={1} />;
          break;
        case 2:
          renderedValue = <Dots value={2} />;
          break;
        case 3:
          renderedValue = <Dots value={3} />;
          break;
        case 4:
          renderedValue = <Dots value={4} />;
          break;
        case 5:
          renderedValue = <Dots value={5} />;
          break;
        default:
          renderedValue = sixPlus;
          break;
      }
      return (
        <View
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {renderedValue}
        </View>
      );
    },
    [frames, current]
  );

  const title = useCallback(
    (virtue: string) => {
      return (
        <View>
          <Text style={{ textAlign: 'center' }}>{capitalize(virtue)}</Text>
        </View>
      );
    },
    [frames, current]
  );

  const header = ['', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const data = useMemo(() => {
    if (!frames[current]) {
      return null;
    }
    return Object.entries(frames[current].data).map(([key, values]) => {
      return [key, ...values.map(String)];
    });
  }, [frames, current]);

  const virtues = useMemo(() => {
    return frames[current]?.data ? Object.keys(frames[current].data) : [];
  }, [frames, current]);

  const onSaveAdjustment = useCallback(
    (action: string, day: number, virtue: string, amount: number = 1) => {
      if (action === 'dismiss') {
        setVisible(false);
        return;
      }
      dispatch(
        updateFrame({
          ...frames[current],
          data: {
            ...frames[current].data,
            [virtue]: frames[current].data[virtue].map((value, index) => {
              if (index === day) {
                if (action === 'plus') {
                  return value + amount;
                } else {
                  return value - amount;
                }
              }
              return value;
            })
          }
        })
      );
      setVisible(false);
    },
    [frames, current]
  );

  // Render null directly without a conditional hook call.
  if (frames.length === 0 || !frames[current]?.data || !data) {
    return null;
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Adjuster
          visible={visible}
          onSave={onSaveAdjustment}
          virtues={virtues}
        />
        <Table borderStyle={{ borderWidth: 1 }}>
          <Row
            data={header}
            flexArr={[2, 1, 1, 1, 1, 1, 1, 1]}
            style={styles.head}
            textStyle={styles.text}
          />
          {data.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  style={{ flex: cellIndex === 0 ? 2 : 1 }}
                  key={cellIndex}
                  data={
                    cellIndex > 0
                      ? element(rowData[0], cellIndex)
                      : title(rowData[0])
                  }
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
        <View
          style={{
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}
        >
          <Button
            mode="contained"
            style={{ backgroundColor: '#5D3754' }}
            onPress={() => setVisible(true)}
          >
            Log an Entry
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
};
// TODO: Handle case where so many virtues they go off the screen.
export default VirtuesScreen;
