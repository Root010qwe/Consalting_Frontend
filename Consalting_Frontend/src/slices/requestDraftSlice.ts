// Consalting_Frontend\src\slices\requestDraftSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { T_RequestDetail, T_Request } from "../modules/types";
import { api } from "../api";
import { AxiosResponse } from "axios";

interface RequestDraftFilters {
  start_date: string; // Начальная дата
  end_date: string;   // Конечная дата
  status: string;     // Статус заявки
}

interface RequestDraftState {
  app_id?: number;
  count?: number;
  requests: T_Request[];          // Список заявок
  filters: RequestDraftFilters;   // Фильтры
}

const initialState: RequestDraftState = {
  app_id: undefined,
  count: undefined,
  requests: [],
  filters: {
    start_date: "", // Установите значения по умолчанию, если нужно
    end_date: "",
    status: "",
  },
};

// Получение детальной информации о заявке
export const fetchRequestDetail = createAsyncThunk<T_RequestDetail, string>(
  "requests/fetchRequestDetail",
  async (request_id) => {
    const response = (await api.requests.requestsRead(request_id)) as unknown as AxiosResponse<T_RequestDetail>;
    console.log("Fetched request detail for ID:", request_id);
    return response.data;
  }
);

// Получение списка заявок с фильтрацией
export const fetchRequests = createAsyncThunk<
  T_Request[],
  void,
  { state: { requestDraft: RequestDraftState } }
>(
  "requests/fetchRequests",
  async (_, { getState }) => {
    const { filters } = getState().requestDraft;

    const response = (await api.requests.requestsList({
      start_date: filters.start_date,
      end_date: filters.end_date,
      status: filters.status,
    })) as unknown as AxiosResponse<T_Request[]>;

    return response.data; // Возвращаем список заявок
  }
);

// Удаление заявки со статусом Draft
export const deleteDraftRequest = createAsyncThunk<
  void,
  string,
  { state: { requestDraft: RequestDraftState } }
>(
  "requests/deleteDraftRequest",
  async (request_id, { getState, rejectWithValue }) => {
    const { requests } = getState().requestDraft;
    const requestToDelete = requests.find((request) => request.id?.toString() === request_id);

    if (!requestToDelete) {
      return rejectWithValue("Заявка с указанным ID не найдена.");
    }

    if (requestToDelete.status !== "Draft") {
      return rejectWithValue("Удалить можно только заявки в статусе Draft.");
    }

    try {
      await api.requests.requestsDeleteDelete(request_id);
    } catch (error) {
      return rejectWithValue("Ошибка при удалении заявки.");
    }
  }
);

// Удаление услуги из заявки
export const removeServiceFromRequest = createAsyncThunk<
  void,
  { requestId: string; serviceId: string },
  { state: { requestDraft: RequestDraftState } }
>(
  "requests/removeServiceFromRequest",
  async ({ requestId, serviceId }, { getState, rejectWithValue }) => {
    const { requests } = getState().requestDraft;
    const request = requests.find((req) => req.id?.toString() === requestId);

    if (!request) {
      return rejectWithValue("Заявка с указанным ID не найдена.");
    }

    try {
      await api.requestItems.requestItemsDeleteDelete(requestId, serviceId);
      console.log(`Service ${serviceId} successfully removed from request ${requestId}`);
    } catch (error) {
      return rejectWithValue("Ошибка при удалении услуги из заявки.");
    }
  }
);

// Обновление комментария к услуге в заявке
export const updateServiceComment = createAsyncThunk<
  void,
  { requestId: string; serviceId: string; comment: string },
  { state: { requestDraft: RequestDraftState } }
>(
  "requests/updateServiceComment",
  async ({ requestId, serviceId, comment }, { getState, rejectWithValue }) => {
    const { requests } = getState().requestDraft;
    const request = requests.find((req) => req.id?.toString() === requestId);

    if (!request) {
      return rejectWithValue("Заявка с указанным ID не найдена.");
    }

    try {
      await api.requestItems.requestItemsUpdateUpdate(requestId, serviceId, { comment });
      console.log(`Комментарий для услуги ${serviceId} в заявке ${requestId} обновлён.`);
    } catch (error) {
      return rejectWithValue("Ошибка при обновлении комментария к услуге.");
    }
  }
);

// Перевод черновой заявки в статус 'Submitted'
export const submitDraftRequest = createAsyncThunk<
  void,
  string,
  { state: { requestDraft: RequestDraftState } }
>(
  "requests/submitDraftRequest",
  async (requestId, { getState, rejectWithValue }) => {
    const { requests } = getState().requestDraft;
    const request = requests.find((req) => req.id?.toString() === requestId);

    if (!request) {
      return rejectWithValue("Заявка с указанным ID не найдена.");
    }

    if (request.status !== "Draft") {
      return rejectWithValue("Только черновые заявки могут быть отправлены.");
    }

    try {
      await api.requests.requestsFormUpdate(requestId);
      console.log(`Заявка ${requestId} успешно переведена в статус 'Submitted'.`);
    } catch (error) {
      return rejectWithValue("Ошибка при переводе заявки в статус 'Submitted'.");
    }
  }
);

const requestDraftSlice = createSlice({
  name: "requestDraft",
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
    setFilters: (state, action: PayloadAction<RequestDraftFilters>) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Обработка fetchRequests
    builder.addCase(fetchRequests.fulfilled, (state, action) => {
      state.requests = action.payload;
    });
    builder.addCase(fetchRequests.rejected, (_, action) => {
      console.error("Ошибка при загрузке списка заявок:", action.error.message);
    });

    // Обработка fetchRequestDetail (пример)
    builder.addCase(fetchRequestDetail.fulfilled, (_, action) => {
      console.log("Request detail loaded:", action.payload);
    });

      // Обработка deleteDraftRequest
    builder.addCase(deleteDraftRequest.fulfilled, (state, action) => {
      console.log("Draft request deleted successfully.");
        // Удаляем заявку из состояния
      state.requests = state.requests.filter((request) => request.id?.toString() !== action.meta.arg);
      });
    builder.addCase(deleteDraftRequest.rejected, (_, action) => {
        console.error("Ошибка при удалении заявки:", action.payload);
      });
      // Удаление услуги из заявки
    builder.addCase(removeServiceFromRequest.fulfilled, () => {
      console.log("Услуга успешно удалена из заявки.");
    });
    builder.addCase(removeServiceFromRequest.rejected, (_, action) => {
      console.error("Ошибка при удалении услуги из заявки:", action.payload);
    });
    // Обработка обновления комментария
    builder.addCase(updateServiceComment.fulfilled, () => {
      console.log("Комментарий к услуге успешно обновлён.");
    });
    builder.addCase(updateServiceComment.rejected, (_, action) => {
      console.error("Ошибка при обновлении комментария к услуге:", action.payload);
    });
    // Обработка submitDraftRequest
    builder.addCase(submitDraftRequest.fulfilled, (state, action) => {
      console.log("Заявка успешно переведена в статус 'Submitted'.");
      const requestIndex = state.requests.findIndex(
        (req) => req.id?.toString() === action.meta.arg
      );
      if (requestIndex >= 0) {
        state.requests[requestIndex].status = "Submitted";
      }
    });
    builder.addCase(submitDraftRequest.rejected, (_, action) => {
      console.error("Ошибка при переводе заявки в статус 'Submitted':", action.payload);
    });
  },
});

export const { setAppId, setCount, clearDraft, setFilters } = requestDraftSlice.actions;
export default requestDraftSlice.reducer;
