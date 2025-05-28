import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/api';

// Async Thunks for API calls

// Login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Verify token and get user profile
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        localStorage.removeItem('authToken');
        throw new Error('Token verification failed');
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      localStorage.removeItem('authToken');
      return rejectWithValue(error.message);
    }
  }
);

// Register user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Google Auth
export const googleAuth = createAsyncThunk(
  'auth/googleAuth',
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/firebase/firebase-google-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google authentication failed');
      }
      
      const data = await response.json();
      localStorage.setItem('authToken', idToken);
      
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: false,
  loading: false,
  error: null,
  isCheckingAuth: true,
  isInitialLoad: true,
  loginSuccess: false,
  registerSuccess: false,
};

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loginSuccess = false;
      state.registerSuccess = false;
      state.isInitialLoad = false;
      localStorage.removeItem('authToken');
      
      // Dispatch custom event to notify other parts of app
      window.dispatchEvent(new CustomEvent('authChanged'));
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear success flags
    clearSuccess: (state) => {
      state.loginSuccess = false;
      state.registerSuccess = false;
    },
    
    // Set credentials (for manual token setting)
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
      state.isInitialLoad = false;
    },
    
    // Set checking auth state
    setCheckingAuth: (state, action) => {
      state.isCheckingAuth = action.payload;
    },
    
    // Set initial load complete
    setInitialLoadComplete: (state) => {
      state.isInitialLoad = false;
      state.isCheckingAuth = false;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // ✅ FIXED: Login cases - Don't set isAuthenticated immediately
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loginSuccess = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Store user data but DON'T set isAuthenticated
        state.user = action.payload.user;
        state.token = action.payload.token;
        // state.isAuthenticated = true; // ❌ REMOVED - causes flickering
        state.loginSuccess = true;
        // Don't change isCheckingAuth or isInitialLoad - let page reload handle it
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.loginSuccess = false;
        state.isInitialLoad = false;
      })
      
      // ✅ FIXED: Register cases - Don't set isAuthenticated immediately
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Store user data but DON'T set isAuthenticated
        state.user = action.payload.user;
        state.token = action.payload.token;
        // state.isAuthenticated = true; // ❌ REMOVED - causes flickering
        state.registerSuccess = true;
        // Don't change isCheckingAuth or isInitialLoad - let page reload handle it
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.registerSuccess = false;
        state.isInitialLoad = false;
      })
      
      // ✅ ONLY set isAuthenticated in verifyToken.fulfilled (after page reload)
      .addCase(verifyToken.pending, (state) => {
        state.isCheckingAuth = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true; // ✅ Only set here after verification
        state.isCheckingAuth = false;
        state.isInitialLoad = false;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
        state.isInitialLoad = false;
        state.error = action.payload;
      })
      
      // ✅ FIXED: Google Auth cases - Don't set isAuthenticated immediately
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Store user data but DON'T set isAuthenticated
        state.user = action.payload;
        // state.isAuthenticated = true; // ❌ REMOVED - causes flickering
        // Don't change isCheckingAuth or isInitialLoad - let page reload handle it
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.isInitialLoad = false;
      });
  },
});

// Export actions
export const { 
  logout, 
  clearError, 
  clearSuccess, 
  setCredentials, 
  setCheckingAuth,
  setInitialLoadComplete
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
