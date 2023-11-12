import React from 'react';

// UI
import { View } from 'react-native';

// Custom Components
import DayCell from '../DayCell';
import VirtueCell from '../VirtueCell';


const HEADER = ['', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];

const TableHeader = () => {
  const today = new Date().getDay()
  
  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      {HEADER.map((day, dayIndex) =>
        dayIndex > 0 ? (
          <DayCell
            key={dayIndex}
            day={day}
            highlighted={dayIndex % 7 === today}
          />
        ) : (
          <VirtueCell
            key={dayIndex}
            virtue={''}
            highlighted={false}
            selected={false}
          />
        )
      )}
    </View>
  );
};

export default TableHeader;
