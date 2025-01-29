import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { T_Service } from '../modules/types';
import { api } from '../api';
import { getCsrfToken } from '../modules/Utils';

interface ModerState {
  loading: boolean;
  error: string | null;
}

const initialState: ModerState = {
  loading: false,
  error: null,
};

// Удаление услуги
export const deleteService = createAsyncThunk(
  'moder/deleteService',
  async (serviceId: number, { rejectWithValue }) => {
    try {
      const response = await api.services.servicesDeleteDelete(serviceId.toString(), {
        headers: {
          'X-CSRFToken': getCsrfToken(),
        },
        withCredentials: true,
      });
      
      // Проверяем успешность удаления
      if (response.status === 204) {
        return serviceId;
      } else {
        throw new Error('Ошибка при удалении услуги');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      return rejectWithValue('Ошибка при удалении услуги');
    }
  }
);

// Обновление услуги




// Создание услуги
export const createService = createAsyncThunk(
  'moder/createService',
  async (serviceData: Omit<T_Service, 'id'>, { rejectWithValue }) => {
    try {
      const response = await api.services.servicesCreateCreate(serviceData as T_Service, {
        headers: {
          'X-CSRFToken': getCsrfToken(),
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при создании услуги');
    }
  }
);

const moderSlice = createSlice({
  name: 'moder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка состояний для deleteService
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
     
      
      // Обработка состояний для createService
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
  },
});

export default moderSlice.reducer;
