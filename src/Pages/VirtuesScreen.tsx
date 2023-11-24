import React, { useCallback } from 'react';

// Redux
import { useSelector } from 'react-redux';
import { selectAllFrames } from '../state/frames';

// UI
import { View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';

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
        setFrameIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (direction === 'right') {
        setFrameIndex((prev) => (prev < frames.length - 1 ? prev + 1 : prev));
      }
    },
    [frames]
  );

  const frameIndicator = (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        marginTop: 8
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        {frames.map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === frameIndex ? '#6F5E53' : '#D9D0C7',
              marginTop: 8,
              margin: 2,
              marginBottom: 0
            }}
          />
        ))}
      </View>
    </View>
  );

  const frame = frames[frameIndex];
  type ValidKey = keyof typeof frame.data;
  const banner = frame ? frame.data[bannerVirtue as ValidKey] : '';

  const closeBanner = useCallback(() => {
    setBannerVirtue('');
  }, []);

  return (
    <>
      {frameIndicator}
      {banner && (
        <Card
          style={{
            borderRadius: 0,
            minHeight: 96,
            width: '100%',
            position: 'absolute',
            zIndex: 10
          }}
        >
          <Card.Content>
            <Text variant="titleLarge">{capitalize(bannerVirtue)}</Text>
            <Text variant="bodyMedium">
              {banner.tagLine === ''
                ? 'No description provided, go to Settings to add one.'
                : banner.tagLine}
            </Text>
            <Card.Actions>
              <Button compact={true} onPress={closeBanner}>
                Close
              </Button>
            </Card.Actions>
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
    </>
  );
};

export default VirtuesScreen;
