import React, { useCallback, useMemo, useState, useEffect } from 'react';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectAllFrames, updateFrame } from '../state/frames';

// UI
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Text,
  PaperProvider,
  Portal,
  Modal,
  Button,
  Divider,
  IconButton,
  Paragraph
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
import { Frame } from '../api/types';

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


const VirtuesScreen: React.FC = () => {
  const frames = useSelector(selectAllFrames);
  const dispatch = useDispatch<AppDispatch>();
  const [current, setCurrent] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [tagLine, setTagLine] = React.useState('');

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

  const [selectedVirtue, setSelectedVirtue] = useState('');
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    if (!currentVirtue || !currentDay) {
      return;
    }
    setSelectedVirtue(currentVirtue);
    setSelectedDay(currentDay);
  }, [currentVirtue, currentDay]);

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
          {frames[current].data[virtue].log[index - 1]}
        </Text>
      );

      let renderedValue = null;
      switch (frames[current].data[virtue].log[index - 1]) {
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
    (virtue: string, highlight: boolean, tagLine: string) => {
      return (
        // <TouchableOpacity onPress={() => {setTagLine((previous) => {
        //   if (previous.includes(capitalize(virtue))) {
        //     return '';
        //   }
        //   return `${capitalize(virtue)}: ${tagLine}`;
        // })}}>
        <View style={{
          height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', backgroundColor: highlight ? '#E8D8E5' : 'white'
        }}>
          <Text style={{ textAlign: 'center' }}>{capitalize(virtue)}</Text>
        </View>
       // </TouchableOpacity>
      );
    },
    [frames, current]
  );

  const topTitle = useCallback(
    (day: string, highlight: boolean) => {
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
      return [key, ...values.log.map(String)];
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
            [selectedVirtue]: {
              ...frames[current].data[selectedVirtue],
              log: frames[current].data[selectedVirtue].log.map((value, index) => {
                if (index === selectedDay - 1) {
                  if (action === 'plus') {
                    return value + 1;
                  }
                  return value - 1;
                }
                return value;
              }
              )
            }
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

  const getFrameTitle = (frame: Frame) => {
    const frameStart = new Date(frame.date);
    const monday = new Date(
      frameStart.getFullYear(),
      frameStart.getMonth(),
      frameStart.getDate() - frameStart.getDay() + 1
    );
    const start = `${monday.getDate()}/${monday.getMonth() + 1}`;
    const endDate = monday.setDate(monday.getDate() + ( 6 + 7 * Object.keys(frame.data).length));
    const end = `${new Date(endDate).getDate()}/${new Date(endDate).getMonth() + 1}`;
    return `${start} - ${end}`;
  }

  

  return (
    <PaperProvider>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <IconButton icon='chevron-left' size={16} containerColor={current === 0 ? 'lightgray': '#5D3754'} iconColor='white' onPress={() => {if (current > 0) {setCurrent(current - 1)}}} disabled={current === 0}/>
        <Text style={{ textAlign: 'center', fontSize: 24, marginTop: 8, marginBottom: 8, marginHorizontal: 16 }}>
        {frames[current] ? getFrameTitle(frames[current]) : null}
      </Text>
      <IconButton icon='chevron-right' size={16} containerColor={current === frames.length - 1 ? 'lightgray': '#5D3754'} iconColor='white' onPress={() => {if (current < frames.length - 1) {setCurrent(current + 1)}}} disabled={current === frames.length - 1}/>
      </View>
      {tagLine ? (
        <View style={{display: 'flex', flexDirection: 'row', backgroundColor: 'lightgray'}}>
        <Paragraph style={{fontSize: 18}}>{tagLine}</Paragraph>
        </View>
      ) : null}
      <ScrollView contentContainerStyle={styles.container}>
        <Table borderStyle={{ borderWidth: 1 }}>
           <TableWrapper key={0} style={styles.row}>
            {header.map((cellData, cellIndex) => {
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
                      : title(rowData[0], rowData[0] === currentVirtue, frames[current].data[rowData[0]].tagLine)
                  }
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </ScrollView>
      <View
          style={{
            bottom: 8,
            right: 8,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            position: 'absolute',
          }} 
        >
          <IconButton icon='minus' size={32} containerColor={selectedVirtue == '' ? 'lightgray': '#5D3754'} iconColor='white' onPress={() => onSaveAdjustment('minus')} disabled={selectedVirtue == ''}/>
          <IconButton icon='plus' size={32} containerColor={selectedVirtue == '' ? 'lightgray': '#5D3754'} iconColor='white' onPress={() => onSaveAdjustment('plus')} disabled={selectedVirtue == ''}/>
        </View>
    </PaperProvider>
  );
};
// TODO: Handle case where so many virtues they go off the screen.
export default VirtuesScreen;
