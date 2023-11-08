import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice
} from '@reduxjs/toolkit';
import { Frame } from '../api/types';
import { RootState } from './store';
import { listFrames, putFrame } from '../api';

export const fetchFrames = createAsyncThunk('frames/fetch', async () => {
  const response = await listFrames();
  return response.results;
});

const framesAdapter = createEntityAdapter<Frame>({
  sortComparer: (a, b) => a.date.localeCompare(b.date)
});

export const framesSlice = createSlice({
  name: 'frames',
  initialState: framesAdapter.getInitialState(),
  reducers: {
    updateFrame: framesAdapter.updateOne
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFrames.fulfilled, (state, action) => {
      framesAdapter.setAll(state, action.payload);
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
