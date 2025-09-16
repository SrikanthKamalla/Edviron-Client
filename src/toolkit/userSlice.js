import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { saveToLocalStorage } from "../helpers/localstorage";
const initialState = {
  loading: false,
  user: {
    name: "",
    email: "",
    userId: "",
  },
  transactionsState: [],

};

export const fetchUserSignUp = createAsyncThunk(
  "user/fetchUserSignUp",
  async ({ signUp, signUpUser }, thunkAPI) => {
    try {
      const response = await signUp(signUpUser);
      saveToLocalStorage(response?.data?.data?.token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error?.response?.data?.message || "Signup failed",
      });
    }
  }
);

export const fetchUserLogin = createAsyncThunk(
  "user/fetchUserLogin",
  async ({ login, loginUser }, thunkAPI) => {
    try {
      const response = await login(loginUser);
      saveToLocalStorage(response?.data?.data?.token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error?.response?.data?.message || "Login failed",
      });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setTransactionsState: (state, action) => {
      state.transactionsState = action.payload;

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSignUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserSignUp.fulfilled, (state, action) => {
        const { name, email, _id } = action.payload.data.user;

        state.user = { name, email, userId: _id };
        state.loading = false;
      })
      .addCase(fetchUserSignUp.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchUserLogin.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchUserLogin.fulfilled, (state, action) => {
        const { name, email, _id } = action.payload.data.user;

        state.user = { name, email, userId: _id };
        state.loading = false;
      })

      .addCase(fetchUserLogin.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUser, setTransactionsState } = userSlice.actions;

export default userSlice.reducer;
