import { createSlice } from "@reduxjs/toolkit";
import { disconnectSocket } from "../socket";
// בודק אם יש כבר משתמש שמור ב־localStorage ומטען אותו כ־state התחלתי
const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      disconnectSocket();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
