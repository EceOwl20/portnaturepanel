import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        activeUser: null,
        error: false,
        wait: false,
    },
    reducers: {
        loginStart: (state) => {
            state.wait = true;
        },
        loginSuccess: (state, action) =>{
            state.wait = false;
            state.error = false; 
            state.activeUser = action.payload;
        },
        loginError: (state, action) => {
            state.wait = false;
            state.activeUser = null;
            state.error = action.payload;
        },
        logOutStart: (state) => {
            state.wait = true;
        },
        logOutSuccess: (state) => {
            state.wait = false;
            state.error = false;
            state.activeUser = null;
        },
        logOutError: (state, action) => {
            satisfies= false;
            state.error = action.payload;
        }
    },
});

export const { loginStart, loginSuccess, loginError, logOutStart, logOutSuccess, logOutError } = userSlice.actions;
export default userSlice.reducer;