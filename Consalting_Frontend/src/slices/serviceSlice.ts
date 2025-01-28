import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { T_Service } from "../modules/types";
import { ServiceMocks } from "../modules/Mocks";
import { setAppId, setCount } from '../slices/requestDraftSlice';
import mockImage from "src/assets/5.png";
import { api } from "../api"; 
import { AxiosResponse } from "axios";
import { RootState } from '../store'
import { getCsrfToken } from '../modules/Utils';
interface ServicesState {
    serviceName: string;
    filteredServices: T_Service[];
    selectedService: T_Service | null;
    isMock: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: ServicesState = {
    serviceName: "",
    filteredServices: [],
    selectedService: null,
    isMock: false,
    loading: false,
    error: null,
};

export const addServiceToDraft = createAsyncThunk<void, string, { state: RootState }>(
    "services/addServiceToDraft",
    async (service_id) => {
      await api.services.servicesAddToDraftCreate(service_id, {
        // Все настройки axios/request идут сюда:
        withCredentials: true,
        headers: { "X-CSRFToken": getCsrfToken() },
      });
    }
  );
  

  export const fetchServices = createAsyncThunk<
  T_Service[],            // что возвращаем при успехе
  string,                 // входной параметр (serviceName)
  { state: RootState; rejectValue: string } // доп. настройки
>(
  "services/fetchServices",
  async (serviceName, { dispatch, rejectWithValue }) => {
    try {
      // Вызываем кодогенерированный метод с фильтром name=...
      const response = (await api.services.servicesList({
        name: serviceName.toLowerCase(),
      })) as AxiosResponse<any>; // или уточните тип вместо 'any'
      
      // Предполагаем, что сервер возвращает объект { services, count, draft_vacancy_application }
      const data = response.data;
      console.log(data);
      // Извлекаем нужные поля
      const app_id = data.draft_request_id;
      const count = data.services_in_draft_request;
      const services = data.services as T_Service[];

      // Диспатчим в стор доп. данные
      dispatch(setAppId(app_id));
      dispatch(setCount(count));

      // Возвращаем массив услуг
      return services;
    } catch (error) {
      return rejectWithValue("Ошибка при загрузке данных");
    }
  },
);


export const fetchServiceById = createAsyncThunk<
  { data: T_Service; isMock: boolean },  // тип результата
  string                                 // входной параметр (id)
>("services/fetchServiceById", async (id, {  }) => {
  try {
    // Запрос через кодогенерированный метод
    // Возвращаемый тип — AxiosResponse<Service>
    const response = (await api.services.servicesRead(id)) as AxiosResponse<T_Service>;
    const data = response.data; // Это объект T_Service
    
    return {
      data,
      isMock: false,
    };
  } catch (error) {
    // Если произошла ошибка — ищем услугу в локальных mock-данных
    const mockService = ServiceMocks.find(
      (service) => service.id === parseInt(id, 10),
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
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.filteredServices = action.payload;
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

export const { setServiceName, clearSelectedService } = serviceSlice.actions;

export default serviceSlice.reducer;