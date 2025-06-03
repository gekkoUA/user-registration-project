import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserDetails, UserState } from '../types/user';

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Local storage helpers
const loadUsersFromStorage = (): UserDetails[] => {
  try {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const saveUsersToStorage = (users: UserDetails[]) => {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

// Simplified async thunks that work with local data
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async () => {
    return loadUsersFromStorage();
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData: Omit<UserDetails, 'id'>) => {
    const users = loadUsersFromStorage();
    const newUser = { ...userData, id: generateId() };
    const updatedUsers = [...users, newUser];
    saveUsersToStorage(updatedUsers);
    return newUser;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: UserDetails) => {
    const users = loadUsersFromStorage();
    const updatedUsers = users.map(user => 
      user.id === userData.id ? userData : user
    );
    saveUsersToStorage(updatedUsers);
    return userData;
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: string) => {
    const users = loadUsersFromStorage();
    const updatedUsers = users.filter(user => user.id !== id);
    saveUsersToStorage(updatedUsers);
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