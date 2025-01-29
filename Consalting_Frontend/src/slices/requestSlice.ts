import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { T_Request } from "../modules/types";
import { api } from "../api";
import { AxiosResponse } from "axios";
import { RootState } from "../store";
import { getCsrfToken } from "../modules/Utils";

interface RequestState {
  requests: T_Request[];
  dateFrom: string;
  dateTo: string;
  status: string;
  clientFilter: string;
  loading: boolean;
  error: string | null;
}

const initialState: RequestState = {
  requests: [],
  dateFrom: "",
  dateTo: "",
  status: "",
  clientFilter: "",
  loading: false,
  error: null,
};

// Фильтры заявок
const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<{
        dateFrom: string;
        dateTo: string;
        status: string;
        clientFilter?: string;
      }>
    ) => {
      state.dateFrom = action.payload.dateFrom;
      state.dateTo = action.payload.dateTo;
      state.status = action.payload.status;
      if (action.payload.clientFilter !== undefined) {
        state.clientFilter = action.payload.clientFilter;
      }
    },
    fetchRequestsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRequestsSuccess: (state, action: PayloadAction<T_Request[]>) => {
      state.requests = action.payload;
      state.loading = false;
    },
    fetchRequestsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Экшены
export const {
  setFilters,
  fetchRequestsStart,
  fetchRequestsSuccess,
  fetchRequestsFailure,
} = requestSlice.actions;

// Асинхронный экшен для загрузки заявок
export const fetchRequests = createAsyncThunk(
  "requests/fetchRequests",
  async (_, { dispatch, getState }) => {
    const { dateFrom, dateTo, status, clientFilter } = (getState() as RootState).requests;

    dispatch(fetchRequestsStart());

    try {
      const response = (await api.requests.requestsList({
        start_date: dateFrom,
        end_date: dateTo,
        status,
        ...(clientFilter ? { client: clientFilter } : {}),
      })) as unknown as AxiosResponse<T_Request[]>;

      dispatch(fetchRequestsSuccess(response.data));
    } catch (error) {
      dispatch(fetchRequestsFailure("Ошибка при загрузке заявок"));
    }
  }
);

export default requestSlice.reducer;
