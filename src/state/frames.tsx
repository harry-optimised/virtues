import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice
} from '@reduxjs/toolkit';
import { Frame } from '../api/types';
import { RootState } from './store';
import { listFrames, putFrame, postFrame, destroyFrame } from '../api';

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
        id: Math.random().toString(36),
        name: `${existingFrame.name} (copy)`,
        date: new Date().toISOString() // Ensure the new date is ISO format
      };
      await postFrame(newFrame);
      return newFrame;
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
    updateFrame: framesAdapter.updateOne,
    deleteFrame: framesAdapter.removeOne
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFrames.fulfilled, (state, action) => {
        framesAdapter.setAll(state, action.payload);
      })
      .addCase(duplicateFrame.fulfilled, (state, action) => {
        framesAdapter.addOne(state, action.payload);
      });
  }
});

export default framesSlice.reducer;

export const { selectAll: selectAllFrames } = framesAdapter.getSelectors(
  (state: RootState) => state.appointments
);

export const updateFrame = createAsyncThunk(
  'frame/updateFrame',
  async (frame: Frame, { dispatch }) => {
    dispatch(framesSlice.actions.updateFrame({ changes: frame, id: frame.id }));
    await putFrame(frame);
  }
);

export const deleteFrame = createAsyncThunk(
  'frame/deleteFrame',
  async (frame: Frame, { dispatch }) => {
    dispatch(framesSlice.actions.deleteFrame(frame.id));
    await destroyFrame(frame.id);
  }
);

// Move all this into store.tsx.
