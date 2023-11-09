import React, { useCallback, useMemo, useState, ReactElement } from 'react';

// Redux
import { useDispatch } from 'react-redux';
import { updateFrame } from '../../state/frames';
import { AppDispatch } from '../../state/store';

// UI
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { IconButton, Text } from 'react-native-paper';
import { Table, TableWrapper, Cell } from 'react-native-reanimated-table';

// Styles
import { sharedStyles } from '../../SharedStyles';

// Types
import { Frame } from '../../api/types';

// Custom Components
import DayCell from '../DayCell';
import LogCell from '../LogCell';
import VirtueCell from '../VirtueCell';

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

const HEADER = ['', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface GridProps {
  frame: Frame;
  moveIndex(direction: string): void;
}

function Grid({ frame, moveIndex }: GridProps): ReactElement {
  const dispatch = useDispatch<AppDispatch>();

  const currentVirtueIndex = useMemo(() => {
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    const start = new Date(frame.date);
    start.setDate(start.getDate() - start.getDay() + 1);
    return Math.floor((new Date().getTime() - start.getTime()) / weekInMs);
  }, [frame]);

  const currentDayIndex = useMemo(() => {
    return new Date().getDay();
  }, []);

  const [selectedVirtueIndex, setSelectedVirtueIndex] = useState(-1);
  const [selectedDayIndex, setSelectedDayIndex] = useState(-1);

  const data = useMemo(() => {
    return Object.entries(frame.data).map(([key, values]) => {
      return [key, ...values.log.map(String)];
    });
  }, [frame]);

  const onSelect = useCallback((virtueIndex: number, dayIndex: number) => {
    setSelectedVirtueIndex(virtueIndex);
    setSelectedDayIndex(dayIndex);
  }, []);

  const onLog = useCallback(
    (action: string) => {
      if (selectedVirtueIndex === -1 || selectedDayIndex === -1) {
        return;
      }
      const virtue = Object.keys(frame.data)[selectedVirtueIndex];
      const newFrame = {
        ...frame,
        data: {
          ...frame.data,
          [virtue]: {
            ...frame.data[virtue],
            log: frame.data[virtue].log.map((value, index) => {
              if (index === selectedDayIndex - 1) {
                if (action === 'clear') {
                  return 0;
                } else if (action === 'plus') {
                  return value <= 6 ? value + 1 : value;
                } else if (action === 'minus') {
                  return value > 0 ? value - 1 : value;
                }
              }
              return value;
            })
          }
        }
      };
      dispatch(updateFrame(newFrame));
    },
    [frame, selectedVirtueIndex, selectedDayIndex]
  );

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <IconButton
          icon="chevron-left"
          size={32}
          onPress={() => moveIndex('left')}
        />
        <Text
          style={{
            textAlign: 'center',
            fontSize: 24,
            marginTop: 8,
            marginBottom: 8,
            marginHorizontal: 16
          }}
        >
          {frame.name}
        </Text>
        <IconButton
          icon="chevron-right"
          size={32}
          onPress={() => moveIndex('right')}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Table borderStyle={{ borderWidth: 1 }}>
          <TableWrapper key={0} style={styles.row}>
            {HEADER.map((day, dayIndex) => {
              return (
                <Cell
                  style={{ flex: dayIndex === 0 ? 2 : 1 }}
                  key={dayIndex}
                  data={
                    <DayCell
                      day={day}
                      highlighted={dayIndex === currentDayIndex}
                    />
                  }
                />
              );
            })}
          </TableWrapper>
          {data.map((row, virtueIndex) => (
            <TableWrapper key={virtueIndex} style={styles.row}>
              {row.map((content, dayIndex) => (
                <Cell
                  style={{ flex: dayIndex === 0 ? 2 : 1 }}
                  key={dayIndex}
                  data={
                    dayIndex > 0 ? (
                      <TouchableOpacity
                        onPress={() => onSelect(virtueIndex, dayIndex)}
                      >
                        <LogCell
                          value={Number(content)}
                          selected={
                            selectedDayIndex === dayIndex &&
                            selectedVirtueIndex === virtueIndex
                          }
                          highlighted={
                            dayIndex === currentDayIndex ||
                            virtueIndex === currentVirtueIndex
                          }
                        />
                      </TouchableOpacity>
                    ) : (
                      <VirtueCell
                        virtue={content}
                        highlighted={virtueIndex === currentVirtueIndex}
                      />
                    )
                  }
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </ScrollView>
      <View
        style={{
          bottom: 64,
          right: 8,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          position: 'absolute'
        }}
      >
        <IconButton
          icon="broom"
          size={32}
          style={{ opacity: 0.8 }}
          containerColor="#6F5E53"
          iconColor="white"
          onPress={() => onLog('clear')}
        />
        <IconButton
          icon="minus"
          size={32}
          style={{ opacity: 0.8 }}
          containerColor="#6F5E53"
          iconColor="white"
          onPress={() => onLog('minus')}
        />
        <IconButton
          icon="plus"
          size={32}
          style={{ opacity: 0.8 }}
          containerColor="#6F5E53"
          iconColor="white"
          onPress={() => onLog('plus')}
        />
      </View>
    </View>
  );
}

export default Grid;
