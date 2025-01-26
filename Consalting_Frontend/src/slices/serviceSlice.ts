import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { T_Service } from "../modules/types";
import { ServiceMocks } from "../modules/Mocks";
import { setAppId, setCount } from '../slices/requestDraftSlice';
import mockImage from "src/assets/5.png";

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

export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async (serviceName: string, { dispatch, rejectWithValue }) => {
        try {
            const response = await fetch(`/api/services/?name=${serviceName.toLowerCase()}`);
            if (!response.ok) { throw new Error('Server error');}
            const data = await response.json();

            const app_id = data.draft_vacancy_application;
            const count = data.count;
            dispatch(setAppId(app_id));
            dispatch(setCount(count));    

            return data.services;
        } catch (error) {
            return rejectWithValue('Ошибка при загрузке данных');
        }
    }
);


export const fetchServiceById = createAsyncThunk(
    'services/fetchServiceById',
    async (id: string, { rejectWithValue }) => {
      try {
        const response = await fetch(`/api/services/${id}/`);
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        return { data, isMock: false };
      } catch (error) {
        const mockService = ServiceMocks.find(service => service.id === parseInt(id));
        return {
          data: mockService || {
            id: parseInt(id),
            name: "(MOCK) Услуга не найдена",
            description: "Описание недоступно. Проверьте подключение к серверу.",
            status: "N/A",
            price: "0.00",
            duration: 0,
            image_url: mockImage,
          },
          isMock: true
        };
      }
    }
  );


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