import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { T_Service } from "../modules/types";
import { ServiceMocks } from "../modules/Mocks";
import { setAppId, setCount } from "../slices/requestDraftSlice";
import mockImage from "src/assets/5.png";
import { api } from "../api";
import { AxiosResponse } from "axios";
import { RootState } from "../store";
import { getCsrfToken } from "../modules/Utils";

interface ServicesState {
  serviceName: string;
  filteredServices: T_Service[];
  selectedService: T_Service | null;
  isMock: boolean;
  loading: boolean;
  error: string | null;
  totalCount: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
  pageSize: number;
}

const initialState: ServicesState = {
  serviceName: "",
  filteredServices: [],
  selectedService: null,
  isMock: false,
  loading: false,
  error: null,
  totalCount: 0,
  next: null,
  previous: null,
  currentPage: 1,
  pageSize: 20,
};

export const addServiceToDraft = createAsyncThunk<
  void,
  string,
  { state: RootState }
>(
  "services/addServiceToDraft",
  async (service_id, { dispatch, getState, rejectWithValue }) => {
    try {
      // Добавление услуги в черновик
      await api.services.servicesAddToDraftCreate(service_id, {
        withCredentials: true,
        headers: { "X-CSRFToken": getCsrfToken() },
      });

      // Запрашиваем обновлённые данные корзины после добавления
      const response = (await api.services.servicesList(
        {}
      )) as AxiosResponse<any>;

      // Извлекаем данные корзины из ответа
      const data = response.data;
      const app_id = data.draft_request_id;
      const count = data.services_in_draft_request;

      // Обновляем корзину в состоянии
      dispatch(setAppId(app_id));
      dispatch(setCount(count));

      console.log("Услуга добавлена и корзина обновлена:", { app_id, count });
    } catch (error) {
      console.error("Ошибка при добавлении услуги в черновик:", error);
      return rejectWithValue("Не удалось добавить услугу в черновик.");
    }
  }
);

export const fetchServices = createAsyncThunk<
  { services: T_Service[]; totalCount: number; next: string | null; previous: string | null },
  { serviceName: string; page?: number; page_size?: number },
  { state: RootState; rejectValue: string }
>(
  "services/fetchServices",
  async ({ serviceName, page = 1, page_size = 20 }, { dispatch, rejectWithValue }) => {
    try {
      // Передаём параметры пагинации вместе с фильтром по имени
      const response = (await api.services.servicesList({
        name: serviceName.toLowerCase(),
        page,
        page_size,
      })) as AxiosResponse<any>;

      // Ответ ожидается в виде:
      // { count, next, previous, results: { duration, draft_request_id, services_in_draft_request, services } }
      const { count, next, previous, results } = response.data;

      // Обновляем данные корзины
      dispatch(setAppId(results.draft_request_id));
      dispatch(setCount(results.services_in_draft_request));

      return {
        services: results.services as T_Service[],
        totalCount: count,
        next,
        previous,
      };
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      return rejectWithValue("Ошибка при загрузке данных");
    }
  }
);

export const fetchServiceById = createAsyncThunk<
  { data: T_Service; isMock: boolean }, // тип результата
  string // входной параметр (id)
>("services/fetchServiceById", async (id, {}) => {
  try {
    // Запрос через кодогенерированный метод
    // Возвращаемый тип — AxiosResponse<Service>
    const response = (await api.services.servicesRead(
      id
    )) as AxiosResponse<T_Service>;
    const data = response.data; // Это объект T_Service

    return {
      data,
      isMock: false,
    };
  } catch (error) {
    // Если произошла ошибка — ищем услугу в локальных mock-данных
    const mockService = ServiceMocks.find(
      (service) => service.id === parseInt(id, 10)
    );

    // Если нет в локальных, возвращаем "заглушку"
    return {
      data: mockService || {
        id: parseInt(id, 10),
        name: "(MOCK) Услуга не найдена",
        description: "Описание недоступно. Проверьте подключение к серверу.",
        // Обратите внимание, T_Service.status имеет тип "A" | "D",
        // поэтому "N/A" придётся написать через "as any" или изменить тип
        status: "N/A" as any,
        price: "0.00",
        duration: 0,
        image_url: mockImage,
      },
      isMock: true,
    };
  }
});

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setServiceName(state, action: PayloadAction<string>) {
      state.serviceName = action.payload;
    },
    clearSelectedService(state) {
      state.selectedService = null;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredServices = action.payload.services;
        state.totalCount = action.payload.totalCount;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
        state.isMock = false;
      })
      .addCase(fetchServices.rejected, (state) => {
        state.loading = false;
        state.filteredServices = ServiceMocks.filter((service) =>
          service.name.toLowerCase().includes(state.serviceName.toLowerCase())
        );
        state.isMock = true;
      })
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedService = action.payload.data;
        state.isMock = action.payload.isMock;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setServiceName, clearSelectedService, setCurrentPage } = serviceSlice.actions;

export default serviceSlice.reducer;
