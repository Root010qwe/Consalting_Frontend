// Consalting_Frontend\src\slices\requestDraftSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { T_RequestDetail, T_Request } from "../modules/types";
import { api } from "../api";
import { AxiosResponse } from "axios";
import { RootState } from "@reduxjs/toolkit/query";
import { getCsrfToken } from "../modules/Utils";

interface RequestDraftFilters {
  start_date: string; // Начальная дата
  end_date: string; // Конечная дата
  status: string; // Статус заявки
}

interface RequestDraftState {
  app_id?: number;
  count?: number;
  requests: T_Request[]; // Список заявок
  request: T_RequestDetail | null;
  filters: RequestDraftFilters; // Фильтры
}

interface Service {
  name: string;
  desc: string;
  comment: string;
  price: string;
  duration: string;
}

const initialState: RequestDraftState = {
  app_id: undefined,
  count: undefined,
  requests: [],
  request: null,
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
    const response = (await api.requests.requestsRead(
      request_id
    )) as unknown as AxiosResponse<T_RequestDetail>;
    console.log("Fetched request detail for ID:", request_id);
    return response.data;
  }
);

// Получение списка заявок с фильтрацией
export const fetchRequests = createAsyncThunk<
  T_Request[],
  void,
  { state: { requestDraft: RequestDraftState } }
>("requests/fetchRequests", async (_, { getState }) => {
  const { filters } = getState().requestDraft;

  const response = (await api.requests.requestsList({
    start_date: filters.start_date,
    end_date: filters.end_date,
    status: filters.status,
  })) as unknown as AxiosResponse<T_Request[]>;

  return response.data; // Возвращаем список заявок
});

// Удаление заявки со статусом Draft
// Удаление черновой заявки
export const deleteDraftRequest = createAsyncThunk<void, string>(
  "requests/deleteDraftRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      await api.requests.requestsDeleteDelete(requestId, {
        headers: {
          "X-CSRFToken": getCsrfToken(),
        },
        withCredentials: true,
      });
      console.log(`Заявка ${requestId} успешно удалена.`);
    } catch (error) {
      console.error("Ошибка при удалении черновой заявки:", error);
      return rejectWithValue("Ошибка при удалении черновой заявки.");
    }
  }
);

// Удаление услуги из заявки
export const removeServiceFromRequest = createAsyncThunk<
  void,
  { requestId: string; serviceId: string }
>(
  "requests/removeServiceFromRequest",
  async ({ requestId, serviceId }, { rejectWithValue, dispatch }) => {
    try {
      await api.requestItems.requestItemsDeleteDelete(requestId, serviceId, {
        headers: {
          "X-CSRFToken": getCsrfToken(),
        },
        withCredentials: true,
      });
      console.log(
        `Услуга ${serviceId} успешно удалена из заявки ${requestId}.`
      );
      dispatch(fetchRequestDetail("" + requestId));
    } catch (error) {
      console.log(error);
      return rejectWithValue("Ошибка при удалении услуги из заявки.");
    }
  }
);

// Обновление комментария к услуге в заявке
export const updateServiceComment = createAsyncThunk<
  void,
  { requestId: string; serviceId: string; comment: string }
>(
  "requests/updateServiceComment",
  async ({ requestId, serviceId, comment }, { rejectWithValue }) => {
    try {
      await api.requestItems.requestItemsUpdateUpdate(
        requestId,
        serviceId,
        {
          comment,
        },
        {
          headers: {
            "X-CSRFToken": getCsrfToken(),
          },
          withCredentials: true,
        }
      );
      console.log(
        `Комментарий для услуги ${serviceId} в заявке ${requestId} обновлён.`
      );
    } catch (error) {
      console.log(error);
      return rejectWithValue("Ошибка при обновлении комментария к услуге.");
    }
  }
);

// Обновление полей заявки (contact_phone и priority_level)
export const updateRequestFields = createAsyncThunk<
  void,
  { requestId: string; contactPhone: string; priorityLevel: string }
>(
  "requests/updateRequestFields",
  async (
    { requestId, contactPhone, priorityLevel },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await api.requests.requestsUpdateFieldsUpdate(
        requestId,
        {
          contact_phone: contactPhone,
          priority_level: priorityLevel,
        },
        {
          headers: {
            "X-CSRFToken": getCsrfToken(), // Добавление CSRF токена
          },
          withCredentials: true, // Учет авторизации
        }
      );
      console.log(`Поля заявки ${requestId} успешно обновлены.`);

      // Перезагружаем данные заявки после обновления
      dispatch(fetchRequestDetail(requestId));
    } catch (error) {
      console.error("Ошибка при обновлении полей заявки:", error);
      return rejectWithValue("Ошибка при обновлении полей заявки.");
    }
  }
);

// Перевод черновой заявки в статус 'Submitted'
// Перевод черновой заявки в статус 'Submitted'
export const submitDraftRequest = createAsyncThunk<void, string>(
  "requests/submitDraftRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      await api.requests.requestsFormUpdate(requestId, {
        headers: {
          "X-CSRFToken": getCsrfToken(),
        },
        withCredentials: true,
      });
      console.log(
        `Заявка ${requestId} успешно переведена в статус 'Submitted'.`
      );
    } catch (error) {
      console.error("Ошибка при переводе заявки в статус 'Submitted':", error);
      return rejectWithValue(
        "Ошибка при переводе заявки в статус 'Submitted'."
      );
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
    setServiceData: (
      state,
      { payload }: { payload: { serviceId: number; comment: string } }
    ) => {
      const { serviceId, comment } = payload;
      const index = state.request!.service_requests!.findIndex(
        (service) => service.id === serviceId
      );

      if (index === -1) {
        console.error("Service with specific ID not found");
        return;
      }
      state.request!.service_requests![index].comment = comment;
    },
    setFilters: (state, action: PayloadAction<RequestDraftFilters>) => {
      state.filters = action.payload;
    },
    setRequestField: (
      state,
      action: PayloadAction<{ field: string; value: string }>
    ) => {
      if (state.request) {
        (state.request as any)[action.payload.field] = action.payload.value;
      }
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
    builder.addCase(
      fetchRequestDetail.fulfilled,
      (state, action: PayloadAction<T_RequestDetail>) => {
        state.request = action.payload; // Сохраняем детальную информацию о заявке
        console.log("Request detail loaded:", state.request);
      }
    );

    // Обработка deleteDraftRequest
    builder.addCase(deleteDraftRequest.fulfilled, (state, action) => {
      console.log("Draft request deleted successfully.");
      // Удаляем заявку из состояния
      state.requests = state.requests.filter(
        (request) => request.id?.toString() !== action.meta.arg
      );
    });
    builder.addCase(deleteDraftRequest.rejected, (_, action) => {
      console.error("Ошибка при удалении заявки:", action.payload);
    });
    // Удаление услуги из заявки
    // builder.addCase(removeServiceFromRequest.fulfilled, (state, action) => {
    //   const { requestId, serviceId } = action.meta.arg;

    //   // Удаляем услугу из текущей заявки
    //   // if (state.request && state.request.id?.toString() === requestId) {
    //   //   state.request.service_requests = state.request.service_requests?.filter(
    //   //     (serviceRequest) => serviceRequest.id?.toString() !== serviceId
    //   //   );
    //   // }
    //   dispatch(fetchRequestDetail(id));

    //   console.log(`Услуга ${serviceId} удалена из заявки ${requestId}`);
    // });

    builder.addCase(removeServiceFromRequest.rejected, (_, action) => {
      console.error("Ошибка при удалении услуги из заявки:", action.payload);
    });
    // Обработка обновления комментария
    builder.addCase(updateServiceComment.fulfilled, () => {
      console.log("Комментарий к услуге успешно обновлён.");
    });
    builder.addCase(updateServiceComment.rejected, (_, action) => {
      console.error(
        "Ошибка при обновлении комментария к услуге:",
        action.payload
      );
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
      console.error(
        "Ошибка при переводе заявки в статус 'Submitted':",
        action.payload
      );
    });
  },
});

export const {
  setAppId,
  setCount,
  clearDraft,
  setFilters,
  setServiceData,
  setRequestField,
} = requestDraftSlice.actions;
export default requestDraftSlice.reducer;
