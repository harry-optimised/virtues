import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice
} from '@reduxjs/toolkit';
import { Frame } from '../api/types';
import { RootState } from './store';
import { listFrames, putFrame, postFrame, destroyFrame } from '../api';

const DEFAULT_FRAME: Omit<Frame, 'id'> = {
  name: 'Default',
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

export type OrderUpdate = {
  id: string;
  order: Record<string, number>;
};

export const fetchFrames = createAsyncThunk('frames/fetch', async () => {
  const response = await listFrames();
  return response.results;
});

export const duplicateFrame = createAsyncThunk(
  'frame/duplicateFrame',
  async ({ id }: { id: string }, { getState }) => {
    const state = getState() as RootState;
    const existingFrame = state.appointments.entities[id];

    if (existingFrame) {
      const newFrame = {
        ...existingFrame,
        name: `${existingFrame.name} (copy)`,
        date: new Date().toISOString()
      };

      for (const key in newFrame.data) {
        if (Object.prototype.hasOwnProperty.call(newFrame.data, key)) {
          newFrame.data[key].log = [0, 0, 0, 0, 0, 0, 0];
        }
      }

      await postFrame(newFrame);
      return newFrame;
    }
    throw new Error('Frame not found');
  }
);

export const createFrame = createAsyncThunk(
  'frame/createFrame',
  async ({ name, seed }: { name: string; seed: boolean }, {}) => {
    const newFrame = seed
      ? {
          ...DEFAULT_FRAME,
          name: name,
          date: new Date().toISOString()
        }
      : {
          name: name,
          date: new Date().toISOString(),
          data: {}
        };

    const frame = await postFrame(newFrame);
    return frame;
  }
);

export const updateFrame = createAsyncThunk(
  'frame/updateFrame',
  async (frame: Frame, {}) => {
    await putFrame(frame);
    return { changes: frame, id: frame.id };
  }
);

export const updateOrder = createAsyncThunk(
  'frames/updateOrder',
  async ({ orderUpdate }: { orderUpdate: OrderUpdate }, { getState }) => {
    const state = getState() as RootState;
    const { id, order } = orderUpdate;
    const frame = state.appointments.entities[id];

    if (frame) {
      const newFrame: Frame = {
        ...frame
      };
      for (const key in order) {
        newFrame.data[key].order = order[key];
      }
      await putFrame(frame);
      return { changes: newFrame, id: frame.id };
    }
    throw new Error('Frame not found');
  }
);

const framesAdapter = createEntityAdapter<Frame>({
  sortComparer: (a, b) => a.date.localeCompare(b.date)
});

export const framesSlice = createSlice({
  name: 'frames',
  initialState: framesAdapter.getInitialState(),
  reducers: {
    deleteFrame: framesAdapter.removeOne
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFrames.fulfilled, (state, action) => {
        framesAdapter.setAll(state, action.payload);
      })
      .addCase(duplicateFrame.fulfilled, (state, action) => {
        framesAdapter.addOne(state, action.payload);
      })
      .addCase(createFrame.fulfilled, (state, action) => {
        framesAdapter.addOne(state, action.payload);
      })
      .addCase(updateFrame.fulfilled, (state, action) => {
        framesAdapter.updateOne(state, action.payload);
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        framesAdapter.updateOne(state, action.payload);
      });
  }
});

export default framesSlice.reducer;

export const { selectAll: selectAllFrames, selectById } =
  framesAdapter.getSelectors((state: RootState) => state.appointments);

export const deleteFrame = createAsyncThunk(
  'frame/deleteFrame',
  async (frame: Frame, { dispatch }) => {
    dispatch(framesSlice.actions.deleteFrame(frame.id));
    await destroyFrame(frame.id);
  }
);

// Move all this into store.tsx.
