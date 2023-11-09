import React, { useCallback } from 'react';

// Redux
import { useSelector } from 'react-redux';
import { selectAllFrames } from '../state/frames';

// UI
import { PaperProvider } from 'react-native-paper';

// Custom Components
import Grid from '../Components/Grid';

const VirtuesScreen: React.FC = () => {
  const frames = useSelector(selectAllFrames);
  const [frameIndex, setFrameIndex] = React.useState(0);

  const moveIndex = useCallback(
    (direction: string) => {
      if (direction === 'left') {
        setFrameIndex((prev) => (prev === 0 ? frames.length - 1 : prev - 1));
      } else if (direction === 'right') {
        setFrameIndex((prev) => (prev === frames.length - 1 ? 0 : prev + 1));
      }
    },
    [frames]
  );

  const frame = frames[frameIndex];

  return (
    <PaperProvider>
      {frame && <Grid frame={frames[frameIndex]} moveIndex={moveIndex} />}
    </PaperProvider>
  );
};
// TODO: Handle case where so many virtues they go off the screen.
export default VirtuesScreen;
