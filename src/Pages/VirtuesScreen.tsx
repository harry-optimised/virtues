import React, { useCallback } from 'react';

// Redux
import { useSelector } from 'react-redux';
import { selectAllFrames } from '../state/frames';

// UI
import { PaperProvider, Card, Text } from 'react-native-paper';

// Custom Components
import Grid from '../Components/Grid';

// Utils
import { capitalize } from 'lodash';

const VirtuesScreen: React.FC = () => {
  const frames = useSelector(selectAllFrames);
  const [frameIndex, setFrameIndex] = React.useState(0);
  const [bannerVirtue, setBannerVirtue] = React.useState<string>('');

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
  type ValidKey = keyof typeof frame.data;
  const banner = frame ? frame.data[bannerVirtue as ValidKey] : '';

  return (
    <PaperProvider>
      {banner && (
        <Card style={{ borderRadius: 0, minHeight: 96 }}>
          <Card.Content>
            <Text variant="titleLarge">{capitalize(bannerVirtue)}</Text>
            <Text variant="bodyMedium">
              {banner.tagLine === ''
                ? 'No description provided, go to Settings to add one.'
                : banner.tagLine}
            </Text>
          </Card.Content>
        </Card>
      )}
      {frame && (
        <Grid
          frame={frames[frameIndex]}
          moveIndex={moveIndex}
          setBanner={setBannerVirtue}
        />
      )}
    </PaperProvider>
  );
};

export default VirtuesScreen;
