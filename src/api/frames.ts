import { Frame } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ListFramesAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Frame[];
}

const DEFAULT_FRAME: Frame = {
  id: Math.floor(100000 + Math.random() * 900000).toString(),
  date: new Date().toISOString(),
  data: {
    constitution: [0, 0, 0, 0, 0, 0, 0],
    order: [0, 0, 0, 0, 0, 0, 0],
    industry: [0, 0, 0, 0, 0, 0, 0],
    amity: [0, 0, 0, 0, 0, 0, 0],
    direction: [0, 0, 0, 0, 0, 0, 0],
    curiosity: [0, 0, 0, 0, 0, 0, 0]
  }
};

export const listFrames = async (): Promise<ListFramesAPIResponse> => {
  const rawFrames = await AsyncStorage.getItem('frames');
  if (rawFrames) {
    const parsedFrames = JSON.parse(rawFrames);
    return {
      count: parsedFrames.length,
      next: null,
      previous: null,
      results: parsedFrames
    };
  }
  AsyncStorage.setItem('frames', JSON.stringify([DEFAULT_FRAME]));
  return {
    count: 1,
    next: null,
    previous: null,
    results: [DEFAULT_FRAME]
  };
};

export const putFrame = async (frame: Frame): Promise<Frame> => {
  const rawFrames = await AsyncStorage.getItem('frames');
  if (rawFrames) {
    const parsedFrames = JSON.parse(rawFrames);
    const newFrames = parsedFrames.map((f: Frame) => {
      if (f.id === frame.id) {
        return frame;
      }
      return f;
    });
    AsyncStorage.setItem('frames', JSON.stringify(newFrames));
    return frame;
  }
  AsyncStorage.setItem('frames', JSON.stringify([frame]));
  return frame;
};
