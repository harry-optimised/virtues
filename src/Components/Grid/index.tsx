import React, {
  useCallback,
  useMemo,
  useState,
  ReactElement,
  useEffect
} from 'react';

// Redux
import { useDispatch } from 'react-redux';
import { updateFrame } from '../../state/frames';
import { AppDispatch } from '../../state/store';

// UI
import { View, ScrollView, TouchableOpacity } from 'react-native';

import { IconButton, Text } from 'react-native-paper';

// Types
import { Frame } from '../../api/types';

// Custom Components
import LogCell from '../LogCell';
import VirtueCell from '../VirtueCell';
import TableHeader from './TableHeader';

interface GridProps {
  frame: Frame;
  moveIndex(direction: string): void;
  setBanner(virtue: string): void;
}

function Grid({ frame, moveIndex, setBanner }: GridProps): ReactElement {
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
    const qualifiedEntries = Object.entries(frame.data).map(([key, values]) => {
      return [values.order, key, ...values.log.map(String)];
    });

    const orderedEntries = qualifiedEntries.sort((a, b) => {
      return a[0] > b[0] ? 1 : -1;
    });

    const processedEntries = orderedEntries.map((row) => {
      return row.slice(1);
    });

    return processedEntries;
  }, [frame]);

  const onSelect = useCallback((virtueIndex: number, dayIndex: number) => {
    const virtue = dayIndex === 0 ? Object.keys(frame.data)[virtueIndex] : '';
    setBanner(virtue);
    setSelectedVirtueIndex(virtueIndex);
    setSelectedDayIndex(dayIndex);
  }, []);

  useEffect(() => {
    setSelectedDayIndex(currentDayIndex);
    setSelectedVirtueIndex(currentVirtueIndex);
  }, [currentDayIndex, currentVirtueIndex]);

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
    <View style={{ height: '100%' }}>
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
          iconColor="#6F5E53"
          onPress={() => moveIndex('left')}
        />
        <Text
          style={{
            textAlign: 'center',
            fontSize: 24,
            marginTop: 8,
            marginBottom: 8,
            marginHorizontal: 16,
            color: '#6F5E53'
          }}
        >
          {frame.name}
        </Text>
        <IconButton
          icon="chevron-right"
          size={32}
          iconColor="#6F5E53"
          onPress={() => moveIndex('right')}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <TableHeader />
        {data.map((row, virtueIndex) => (
          <View
            key={virtueIndex}
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            {row.map((content, dayIndex) =>
              dayIndex > 0 ? (
                <TouchableOpacity
                  key={dayIndex}
                  onPress={() => onSelect(virtueIndex, dayIndex)}
                >
                  <LogCell
                    value={Number(content)}
                    selected={
                      selectedDayIndex === dayIndex &&
                      selectedVirtueIndex === virtueIndex
                    }
                    highlighted={
                      dayIndex % 7 === currentDayIndex ||
                      virtueIndex === currentVirtueIndex
                    }
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={dayIndex}
                  onPress={() => onSelect(virtueIndex, dayIndex)}
                >
                  <VirtueCell
                    key={dayIndex}
                    virtue={content}
                    selected={
                      selectedDayIndex === dayIndex &&
                      selectedVirtueIndex === virtueIndex
                    }
                    highlighted={virtueIndex === currentVirtueIndex}
                  />
                </TouchableOpacity>
              )
            )}
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          bottom: 8,
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
          style={{ borderRadius: 8 }}
          containerColor="#6F5E53"
          iconColor="white"
          onPress={() => onLog('clear')}
        />
        <IconButton
          icon="minus"
          size={32}
          style={{ borderRadius: 8 }}
          containerColor="#6F5E53"
          iconColor="white"
          onPress={() => onLog('minus')}
        />
        <IconButton
          icon="plus"
          size={32}
          style={{ borderRadius: 8 }}
          containerColor="#6F5E53"
          iconColor="white"
          onPress={() => onLog('plus')}
        />
      </View>
    </View>
  );
}

export default Grid;
