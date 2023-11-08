import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Profile } from '../api/types';
import { retrieveProfile, putProfile, addCarer } from '../api/profile';

export const fetchProfile = createAsyncThunk('profile/fetch', async () => {
  const response = await retrieveProfile();
  return response;
});

const initialState: Profile = {
  firstName: '',
  lastName: ''
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (
      state,
      action: PayloadAction<{ firstName: string; lastName: string }>
    ) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    });
  }
});

export default profileSlice.reducer;

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profile: Profile, { dispatch }) => {
    console.info(`profile:updateProfile:updating user profile`);
    dispatch(profileSlice.actions.updateProfile(profile));
    await putProfile(profile);
  }
);

export const addCarerToProfile = async (carerID: string): Promise<void> => {
  console.info(`profile:addCarerToProfile:adding carer ${carerID}`);
  await addCarer(carerID);
};
