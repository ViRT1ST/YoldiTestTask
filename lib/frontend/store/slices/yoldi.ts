import { createSlice } from '@reduxjs/toolkit';

const LOGIN = 'login';
const REGISTRATION = 'registration';

const initialState: {
  isUserAuthenticated: boolean;
  currentAuthPage: string;
} = {
  isUserAuthenticated: false,
  currentAuthPage: LOGIN
};

const yoldiSlice = createSlice({
  name: 'yoldi',
  initialState,
  reducers: {
    setIsUserAuthenticated(state, action) {
      state.isUserAuthenticated = action.payload.isUserAuthenticated;
    },
    switchCurrentAuthPage(state) {
      state.currentAuthPage = state.currentAuthPage === REGISTRATION
        ? LOGIN
        : REGISTRATION;
    }
  }
});

export default yoldiSlice;
