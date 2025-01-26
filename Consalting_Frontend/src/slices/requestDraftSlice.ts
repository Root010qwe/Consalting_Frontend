// Consalting_Frontend\src\slices\requestDraftSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RequestDraftState {
  app_id?: number;
  count?: number;
}

const initialState: RequestDraftState = {
  app_id: undefined,
  count: undefined,
};

const requestDraftSlice = createSlice({
  name: 'requestDraft',
  initialState,
  reducers: {
    setAppId: (state, action: PayloadAction<number>) => {
      state.app_id = action.payload;
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    clearDraft: (state) => {
      state.app_id = undefined;
      state.count = undefined;
    },
  },
});

export const { setAppId, setCount, clearDraft } = requestDraftSlice.actions;
export default requestDraftSlice.reducer;