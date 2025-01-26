import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { T_Service } from "../modules/types";
import { ServiceMocks } from "../modules/Mocks";
import { setAppId, setCount } from '../slices/requestDraftSlice';

interface ServicesState {
    serviceName: string;
    filteredServices: T_Service[];
    isMock: boolean;
    loading: boolean;
}

const initialState: ServicesState = {
    serviceName: "",
    filteredServices: [],
    isMock: false,
    loading: false,
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

const serviceSlice = createSlice({
    name: "services",
    initialState,
    reducers: {
        setServiceName(state, action: PayloadAction<string>) {
            state.serviceName = action.payload;
        },
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
            });
    },
});

export const { setServiceName } = serviceSlice.actions;

export default serviceSlice.reducer;