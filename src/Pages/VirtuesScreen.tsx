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

  const [selectedVirtue, setSelectedVirtue] = useState('');
  const [selectedDay, setSelectedDay] = useState(0);

  const currentVirtue = useMemo(() => {

    if (!frames[current]) {
      return null;
    }

    const frameStart = new Date(frames[current].date);


    // TODO: This logic feels like it should be in a Frame class or something.
    const monday = new Date(
      frameStart.getFullYear(),
      frameStart.getMonth(),
      frameStart.getDate() - frameStart.getDay() + 1
    );

    // // How many days between the monday and today?
    const days = Math.floor(
      (new Date().getTime() - monday.getTime()) / (1000 * 3600 * 24)
    );

    const numWeeks = Math.floor(days / 7);
    const virtues = Object.keys(frames[current].data);
    return virtues[numWeeks % virtues.length];

  }, [frames, current]);

  const currentDay = useMemo(() => {
    return new Date().getDay();
  }, []);


  const element = useCallback(
    (virtue: string, index: number, highlight: boolean, border: boolean) => {
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
            padding: 4
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
        case 6:
          renderedValue = <Dots value={6} />;
          break;
        default:
          renderedValue = sixPlus;
          break;
      }
      return (
        <TouchableOpacity onPress={() => {setSelectedDay(index); setSelectedVirtue(virtue)}}>
        <View
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: highlight ? '#E8D8E5' : 'white',
            borderWidth: border ? 3 : 0,
            borderColor: '#5D3754'
          }}
        >
          {renderedValue}
        </View>
        </TouchableOpacity>
      );
    },
    [frames, current]
  );

  const title = useCallback(
    (virtue: string, highlight: boolean) => {
      return (
        <View style={{
          height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', backgroundColor: highlight ? '#E8D8E5' : 'white'
        }}>
          <Text style={{ textAlign: 'center' }}>{capitalize(virtue)}</Text>
        </View>
      );
    },
    [frames, current]
  );

  const topTitle = useCallback(
    (day: string, highlight: boolean) => {
      console.log(day)
      return (
        <View style={{
            height: 48,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', 
            backgroundColor: highlight ? '#E8D8E5' : 'white'
        }}>
          <Text style={{ textAlign: 'center' }}>{capitalize(day)}</Text>
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
    (action: string) => {
      
      dispatch(
        updateFrame({
          ...frames[current],
          data: {
            ...frames[current].data,
            [selectedVirtue]: frames[current].data[selectedVirtue].map((value, index) => {
              if (index === selectedDay - 1) {
                if (action === 'plus') {
                  return value < 6 ? value + 1 : 6;
                } else {
                  return value > 0 ? value - 1 : 0;
                }
              }
              return value;
            })
          }
        })
      );
      setVisible(false);
    },
    [frames, current, selectedDay, selectedVirtue]
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
           <TableWrapper key={0} style={styles.row}>
            {header.map((cellData, cellIndex) => {
              console.log(cellIndex, currentDay)
              return (
              <Cell
                style={{ flex: cellIndex === 0 ? 2 : 1 }}
                key={cellIndex}
                data={topTitle(cellData, cellIndex === currentDay)}
              />
            )
            })}
          </TableWrapper>
          {data.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  style={{ flex: cellIndex === 0 ? 2 : 1 }}
                  key={cellIndex}
                  data={
                    cellIndex > 0
                      ? element(rowData[0], cellIndex, rowData[0] === currentVirtue || cellIndex === currentDay, rowData[0] === selectedVirtue && cellIndex === selectedDay)
                      : title(rowData[0], rowData[0] === currentVirtue)
                  }
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
        <View
          style={{
            marginBottom: 20,
            marginRight: 20,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }} 
        >
          <IconButton icon='minus' size={32} containerColor={selectedVirtue == '' ? 'grey': '#5D3754'} iconColor='white' onPress={() => onSaveAdjustment('minus')} disabled={selectedVirtue == ''}/>
          <IconButton icon='plus' size={32} containerColor={selectedVirtue == '' ? 'grey': '#5D3754'} iconColor='white' onPress={() => onSaveAdjustment('plus')} disabled={selectedVirtue == ''}/>
        </View>
      </View>
    </PaperProvider>
  );
};
// TODO: Handle case where so many virtues they go off the screen.
export default VirtuesScreen;
