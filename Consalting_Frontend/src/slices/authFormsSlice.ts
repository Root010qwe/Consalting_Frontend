// Consalting_Frontend\src\slices\authFormsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  username: string;
  password: string;
}

interface AuthFormsState {
  login: FormState;
  registration: FormState;
  profile: FormState;
}

const initialState: AuthFormsState = {
  login: { username: '', password: '' },
  registration: { username: '', password: ''},
  profile: { username: '', password: '' },
};

const authFormsSlice = createSlice({
  name: 'authForms',
  initialState,
  reducers: {
    // Обновление полей для страницы входа
    setLoginUsername: (state, action: PayloadAction<string>) => {
      state.login.username = action.payload;
    },
    setLoginPassword: (state, action: PayloadAction<string>) => {
      state.login.password = action.payload;
    },
    
    // Обновление полей для страницы регистрации
    setRegistrationUsername: (state, action: PayloadAction<string>) => {
      state.registration.username = action.payload;
    },
    setRegistrationPassword: (state, action: PayloadAction<string>) => {
      state.registration.password = action.payload;
    },

    
    // Обновление полей для страницы профиля
    setProfileUsername: (state, action: PayloadAction<string>) => {
      state.profile.username = action.payload;
    },
    setProfilePassword: (state, action: PayloadAction<string>) => {
      state.profile.password = action.payload;
    },
    
    // Сброс состояний
    resetLoginForm: (state) => {
      state.login = initialState.login;
    },
    resetRegistrationForm: (state) => {
      state.registration = initialState.registration;
    },
    resetProfileForm: (state) => {
      state.profile = initialState.profile;
    },
    
    // Инициализация профиля данными пользователя
    initializeProfileForm: (state, action: PayloadAction<{username: string}>) => {
        state.profile = {
          ...initialState.profile,
          username: action.payload.username
        };
      }
  },
});

export const { 
  setLoginUsername,
  setLoginPassword,
  setRegistrationUsername,
  setRegistrationPassword,
  setProfileUsername,
  setProfilePassword,
  resetLoginForm,
  resetRegistrationForm,
  resetProfileForm,
  initializeProfileForm
} = authFormsSlice.actions;

export default authFormsSlice.reducer;

// Селекторы
export const selectLoginForm = (state: {authForms: AuthFormsState}) => state.authForms.login;
export const selectRegistrationForm = (state: {authForms: AuthFormsState}) => state.authForms.registration;
export const selectProfileForm = (state: {authForms: AuthFormsState}) => state.authForms.profile;