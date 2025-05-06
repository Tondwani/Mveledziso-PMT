"use client";
import { useContext, useReducer, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { INITIAL_STATE, AuthStateContext, AuthActionContext, IRegisterUser } from "./context";
import { AuthReducer } from "./reducer";
import {
  loginPending,
  loginSuccess,
  loginError,
  logoutSuccess,
  getCurrentLoginInfoPending,
  getCurrentLoginInfoSuccess,
  getCurrentLoginInfoError,
  registerPending,
  registerSuccess,
  registerError,
} from "./action";

// Define type for ABP API error response
interface AbpErrorResponse {
  error?: {
    message?: string;
    details?: string;
    code?: number;
  };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  const getCurrentLoginInfo = useCallback(async () => {
    dispatch(getCurrentLoginInfoPending());
    
    try {
      const response = await getAxiosInstance().get(`/api/services/app/Session/GetCurrentLoginInformations`);
      dispatch(getCurrentLoginInfoSuccess(response.data.result.user));
    } catch {
      dispatch(getCurrentLoginInfoError());
      // If getting current user fails, assume token is invalid and logout
      logout();
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      getCurrentLoginInfo();
    }
  }, [getCurrentLoginInfo]);

  const login = async (userNameOrEmail: string, password: string) => {
    dispatch(loginPending());
    
    try {
      const response = await getAxiosInstance().post(`/api/TokenAuth/Authenticate`, {
        userNameOrEmailAddress: userNameOrEmail,
        password,
        rememberClient: true
      });

      const token = response.data.result.accessToken;
      sessionStorage.setItem("auth_token", token);
      getAxiosInstance().defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      dispatch(loginSuccess(token));
      await getCurrentLoginInfo();
    } catch (error) {
      const axiosError = error as AxiosError;
      let errorMessage = "Login failed";
      
      if (
        axiosError.response && 
        axiosError.response.data
      ) {
        const responseData = axiosError.response.data as AbpErrorResponse;
        if (responseData.error && responseData.error.message) {
          errorMessage = responseData.error.message;
        }
      }
      
      dispatch(loginError(errorMessage));
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("auth_token");
    delete getAxiosInstance().defaults.headers.common["Authorization"];
    dispatch(logoutSuccess());
  };

  const register = async (userData: IRegisterUser): Promise<void> => {
    dispatch(registerPending());
    
    try {
      await getAxiosInstance().post('/api/services/app/User/Register', {
        ...userData,
        isActive: true
      });
      
      dispatch(registerSuccess());
    } catch (error) {
      const axiosError = error as AxiosError;
      let errorMessage = "Registration failed";
      
      if (
        axiosError.response && 
        axiosError.response.data
      ) {
        const responseData = axiosError.response.data as AbpErrorResponse;
        if (responseData.error && responseData.error.message) {
          errorMessage = responseData.error.message;
        }
      }
      
      dispatch(registerError(errorMessage));
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionContext.Provider value={{ login, logout, getCurrentLoginInfo, register }}>
        {children}
      </AuthActionContext.Provider>
    </AuthStateContext.Provider>
  );
};

// Custom hooks for easy access to context
export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }
  return context;
};

export const useAuthActions = () => {
  const context = useContext(AuthActionContext);
  if (!context) {
    throw new Error("useAuthActions must be used within an AuthProvider");
  }
  return context;
};