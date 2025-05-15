"use client";
import { useContext, useReducer, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { INITIAL_STATE, AuthStateContext, AuthActionContext, ICreateTeamMember, ICreateProjectManager, ITeamMember, IProjectManager, ICurrentUser } from "./context";
import { AuthReducer } from "./reducer";
import {
  loginPending,
  loginSuccess,
  loginError,
  logoutSuccess,
  getCurrentLoginInfoPending,
  getCurrentLoginInfoSuccess,
  getCurrentLoginInfoError,
  createTeamMemberPending,
  createTeamMemberSuccess,
  createTeamMemberError,
  createProjectManagerPending,
  createProjectManagerSuccess,
  createProjectManagerError,
} from "./action";

// Define type for ABP API error response
interface AbpErrorResponse {
  error?: {
    message?: string;
    details?: string;
    code?: number;
  };
}

// Function to decode JWT token
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  const getCurrentLoginInfo = useCallback(async () => {
    dispatch(getCurrentLoginInfoPending());
    
    try {
      console.log('Fetching current user info...');
      const response = await getAxiosInstance().get(`/api/services/app/Session/GetCurrentLoginInformations`);
      console.log('Current user API response:', response.data);
      const userData = response.data.result.user;
      console.log('Raw user data:', userData);
      
      // Get token from storage
      const token = sessionStorage.getItem("auth_token");
      let roles: string[] = [];
      
      if (token) {
        const decodedToken = parseJwt(token);
        console.log('Decoded token:', decodedToken);
        
        // Extract role from token claims
        const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (roleClaim) {
          roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
          console.log('Roles from token:', roles);
        }
      }
      
      const user: ICurrentUser = {
        ...userData,
        roles: roles
      };
      console.log('Final user object with roles:', user);
      dispatch(getCurrentLoginInfoSuccess(user));
    } catch (error) {
      console.error('Error getting current user:', error);
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
      
      if (axiosError.response?.data) {
        const responseData = axiosError.response.data as AbpErrorResponse;
        if (responseData.error?.message) {
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

  const createTeamMember = useCallback(async (data: ICreateTeamMember) => {
    try {
      dispatch(createTeamMemberPending());
      
      console.log('Creating team member account...');

      // Create request payload
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        userName: data.userName || data.email,
        password: data.password,
        roleNames: ['TeamMember'] // Specify the ABP role name
      };

      // Use the TeamMember endpoint
      const registerResponse = await getAxiosInstance().post("/api/services/app/TeamMember/Create", payload);

      console.log('TeamMember creation response:', registerResponse.data);

      if (!registerResponse.data.success) {
        throw new Error(registerResponse.data.error?.message || "Failed to create team member");
      }

      const teamMember = {
        ...registerResponse.data.result,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roles: ['TeamMember'] // Use the ABP role name
      } as ITeamMember;

      dispatch(createTeamMemberSuccess(teamMember));
      return teamMember;
    } catch (error) {
      const axiosError = error as AxiosError;
      let errorMessage = "Failed to create team member";
      
      console.error('Error creating team member:', error);
      
      if (axiosError.response?.data) {
        const responseData = axiosError.response.data as AbpErrorResponse;
        if (responseData.error?.message) {
          errorMessage = responseData.error.message;
        }
      }
      
      dispatch(createTeamMemberError(errorMessage));
      throw new Error(errorMessage);
    }
  }, []);

  const createProjectManager = useCallback(async (data: ICreateProjectManager) => {
    try {
      dispatch(createProjectManagerPending());
      
      console.log('Creating project manager account...');
      
      // Use the ProjectManager/Create endpoint with role
      const registerResponse = await getAxiosInstance().post("/api/services/app/ProjectManager/Create", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        userName: data.userName || data.email,
        password: data.password,
        roleNames: ['ProjectManager'] // Specify the ABP role name
      });

      console.log('ProjectManager creation response:', registerResponse.data);

      if (!registerResponse.data.success) {
        throw new Error(registerResponse.data.error?.message || "Failed to create project manager");
      }

      const projectManager = {
        ...registerResponse.data.result,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roles: ['ProjectManager'] // Use the ABP role name
      } as IProjectManager;

      dispatch(createProjectManagerSuccess(projectManager));
      return projectManager;
    } catch (error) {
      const axiosError = error as AxiosError;
      let errorMessage = "Failed to create project manager";
      
      console.error('Error creating project manager:', error);
      
      if (axiosError.response?.data) {
        const responseData = axiosError.response.data as AbpErrorResponse;
        if (responseData.error?.message) {
          errorMessage = responseData.error.message;
        }
      }
      
      dispatch(createProjectManagerError(errorMessage));
      throw new Error(errorMessage);
    }
  }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionContext.Provider
        value={{
          login,
          logout,
          getCurrentLoginInfo,
          createTeamMember,
          createProjectManager,
        }}
      >
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