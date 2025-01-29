import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { T_User, T_Login, T_RegistrationData } from "../modules/types";
import { api } from "../api";
import { getCsrfToken } from "../modules/Utils";
import { RootState } from "../store";
import { clearDraft } from "../slices/requestDraftSlice";
interface UserState {
  user: T_User | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false,
};

export type T_ProfileUpdate = {
  username?: string;
  email?: string;
  password?: string;
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: T_Login, { rejectWithValue }) => {
    try {
      const response = await api.api.apiUsersLoginCreate(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue("Ошибка авторизации");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.api.apiUsersLogoutCreate({
        withCredentials: true,
        headers: { "X-CSRFToken": getCsrfToken() },
      });
      dispatch(clearDraft()); // Очищаем данные корзины при выходе
    } catch (error) {
      return rejectWithValue("Ошибка при выходе");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<Partial<T_User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, { payload }: any) => {
        state.user = payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
      state.error = null;
    });

    builder.addCase(updateProfile.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export default userSlice.reducer;
export const { setProfileData } = userSlice.actions;

// регистрация

// Добавим новый асинхронный экшен
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: T_RegistrationData, { rejectWithValue }) => {
    try {
      const response = await api.user.userCreate(userData, {
        headers: {
          "X-CSRFToken": getCsrfToken(),
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        return rejectWithValue(error.response.data.detail);
      }
      return rejectWithValue("Ошибка регистрации");
    }
  }
);

// update user's profile user
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData: T_ProfileUpdate, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const userId = state.user.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const payload = {
        id: userId,
        ...userData,
      } as unknown as T_User; // Или создайте правильный тип для API

      const response = await api.api.apiUsersUpdateUpdate(payload, {
        headers: {
          "X-CSRFToken": getCsrfToken(),
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue("Ошибка обновления профиля");
    }
  }
);
