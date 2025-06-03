import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserDetails, UserState } from '../types/user';
import { userApi } from '../api/userApi';

// Async thunks for Strapi API
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await userApi.getAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData: Omit<UserDetails, 'id'>, { rejectWithValue }) => {
    try {
      return await userApi.create(userData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: UserDetails, { rejectWithValue }) => {
    try {
      return await userApi.update(userData.id!, userData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await userApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete user');
    }
  }
);

export const uploadPhoto = createAsyncThunk(
  'user/uploadPhoto',
  async (file: File, { rejectWithValue }) => {
    try {
      return await userApi.uploadPhoto(file);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to upload photo');
    }
  }
);

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Upload photo
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;