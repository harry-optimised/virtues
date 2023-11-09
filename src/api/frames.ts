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
  name: "Franklin's Virtues",
  date: new Date().toISOString(),
  data: {
    temperance: {
      tagLine: 'Eat not to dullness; drink not to elevation.',
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 1
    },
    silence: {
      tagLine:
        'Speak not but what may benefit others or yourself; avoid trifling conversation.',
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 2
    },
    order: {
      tagLine:
        'Let all your things have their places; let each part of your business have its time.',
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 3
    },
    resolution: {
      tagLine:
        'Resolve to perform what you ought; perform without fail what you resolve.',
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 4
    },
    frugality: {
      tagLine:
        'Make no expense but to do good to others or yourself; that is, waste nothing.',
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 5
    },
    industry: {
      tagLine:
        'Lose no time; be always employed in something useful; cut off all unnecessary actions.',
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 6
    },
    sincerity: {
      tagLine:
        'Use no hurtful deceit; think innocently and justly, and, if you speak, speak accordingly.',
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 7
    },
    justice: {
      tagLine:
        'Wrong none by doing injuries, or omitting the benefits that are your duty.',
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 8
    },
    moderation: {
      tagLine:
        'Avoid extremes; forbear resenting injuries so much as you think they deserve.',
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 9
    },
    cleanliness: {
      tagLine: 'Tolerate no uncleanliness in body, clothes, or habitation.',
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 10
    },
    tranquility: {
      tagLine:
        'Be not disturbed at trifles, or at accidents common or unavoidable.',
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 11
    },
    chastity: {
      tagLine:
        "Rarely use venery but for health or offspring, never to dullness, weakness, or the injury of your own or another's peace or reputation.",
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 12
    },
    humility: {
      tagLine: 'Imitate Jesus and Socrates.',
      log: [0, 0, 0, 0, 0, 0, 0],
      order: 13
    }
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

export const postFrame = async (
  newFrame: Omit<Frame, 'id'>
): Promise<Frame> => {
  const rawFrames = await AsyncStorage.getItem('frames');
  let frames: Frame[] = [];

  if (rawFrames) {
    frames = JSON.parse(rawFrames);
  }

  // Assuming 'id' is a string. Generate a new ID for the frame.
  const frameWithId: Frame = {
    ...newFrame,
    id: Math.random().toString(36).substr(2, 9)
  };

  frames.push(frameWithId); // Add the new frame with an ID to the array
  await AsyncStorage.setItem('frames', JSON.stringify(frames));

  return frameWithId;
};

export const destroyFrame = async (frameId: string): Promise<void> => {
  const rawFrames = await AsyncStorage.getItem('frames');
  if (rawFrames) {
    let frames: Frame[] = JSON.parse(rawFrames);
    frames = frames.filter((frame) => frame.id !== frameId); // Remove the frame with the given ID
    await AsyncStorage.setItem('frames', JSON.stringify(frames));
  }
};
