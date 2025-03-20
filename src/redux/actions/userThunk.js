import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  loginWithGoogle,
  loginWithRefreshToken,
  register,
} from "../../services/auth.services";

export const loginThunk = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      return response;
    } catch (error) {
      console.log("error: ", error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const loginGoogleThunk = createAsyncThunk(
  "user/loginGoogleThunk",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginWithGoogle(credentials);
      return response;
    } catch (error) {
      console.log("error: ", error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const registerThunk = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await register(data);
      return response;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const getCurrentUserThunk = createAsyncThunk(
  "user/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshtoken");

      const response = await loginWithRefreshToken({
        refreshToken: refreshToken,
      });
      return response;
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue("Something went wrong");
    }
  }
);
