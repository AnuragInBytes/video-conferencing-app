import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = 'https://localhost:5000/api/v1/rooms';

export const createInstantMeeting = createAsyncThunk('room/createInstant', async(_, { rejectWithValue }) => {
  try {
    const startTime = new Date().toISOString();
    const title = `Instant Meeting ${Date.now()}`;

    const response = await axios.post(
      `${API_URL}/create`,
      { title, startTime },
      {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const scheduleMeeting = createAsyncThunk('room/schedule', async({ title, startTime }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${API_URL}/create`,
      { title, startTime },
      {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const joinMeeting = createAsyncThunk('room/join', async(roomId, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${API_URL}/join/${roomId}`,
      {},
      {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  currentRoom: null,
  isLoading: false,
  error: null,
  isInCall: false,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    leaveRoom: (state) => {
      state.currentRoom = null;
      state.isInCall = false;
    },
    setInCall: (state, action) => {
      state.isInCall = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // instant meeting
      .addCase(createInstantMeeting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createInstantMeeting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRoom = action.payload;
        state.error = null;
      })
      .addCase(createInstantMeeting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // schedule meeting
      .addCase(scheduleMeeting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(scheduleMeeting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRoom = action.payload;
        state.error = null;
      })
      .addCase(scheduleMeeting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // join meeting
      .addCase(joinMeeting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(joinMeeting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRoom = action.payload;
        state.error = null;
      })
      .addCase(joinMeeting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { leaveRoom, setInCall } = roomSlice.actions;
export default roomSlice.reducer;