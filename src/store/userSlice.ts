import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserDetails, UserState } from '../types/user';
import { userApi } from '../api/userApi';

// AsyncThunk для CRUD операцій
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async () => {
    const response = await userApi.getAll();
    return response;
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData: Omit<UserDetails, 'id'>) => {
    const response = await userApi.create(userData);
    return response;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: UserDetails) => {
    const response = await userApi.update(userData.id!, userData);
    return response;
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: string) => {
    await userApi.delete(id);
    return id;
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
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create user';
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;