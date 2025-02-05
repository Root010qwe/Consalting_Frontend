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
  isInitialLoad: boolean;
}

const initialState: RequestState = {
  requests: [],
  dateFrom: "",
  dateTo: "",
  status: "",
  clientFilter: "",
  loading: false,
  error: null,
  isInitialLoad: true,
};

interface UpdateStatusResponse {
  message: string;
  status: string;
  completion_date: string;
  total_cost: string;
  qr?: string; // Добавляем поле QR-кода
}

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
      state.isInitialLoad = true;
    },
    fetchRequestsStart: (state) => {
      if (state.isInitialLoad) {
        state.loading = true;
      }
      state.error = null;
    },
    fetchRequestsSuccess: (state, action: PayloadAction<T_Request[]>) => {
      console.log("Полученные заявки:", action.payload); // Логируем все заявки
      state.requests = action.payload.map((req) => ({
        ...req,
        qr: req.qr || null, // Проверяем, что `qr` не становится undefined
      }));
      state.loading = false;
      state.isInitialLoad = false;
    },
    fetchRequestsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.isInitialLoad = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateRequestStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const updatedRequest = state.requests.find(
          (request) => request.id === Number(action.meta.arg.requestId)
        );
        if (updatedRequest) {
          updatedRequest.status = action.meta.arg.status;
          updatedRequest.completion_date = action.payload.completion_date;
          updatedRequest.total_cost = action.payload.total_cost;
          updatedRequest.qr = action.payload.qr || null;
        }
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  fetchRequestsStart,
  fetchRequestsSuccess,
  fetchRequestsFailure,
} = requestSlice.actions;

export const fetchRequests = createAsyncThunk(
  "requests/fetchRequests",
  async (_, { dispatch, getState }) => {
    const { dateFrom, dateTo, status, clientFilter } = (getState() as RootState)
      .requests;

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

export const updateRequestStatus = createAsyncThunk(
  "requests/updateStatus",
  async (
    {
      requestId,
      status,
    }: { requestId: number; status: "Completed" | "Rejected" },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.requests.requestsCompleteOrRejectUpdate(
        requestId.toString(),
        { status },
        {
          headers: {
            "X-CSRFToken": getCsrfToken(),
          },
          withCredentials: true,
        }
      );

      return response.data as unknown as UpdateStatusResponse;
    } catch (error: any) {
      if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue("Ошибка при обновлении статуса заявки");
    }
  }
);

export default requestSlice.reducer;
