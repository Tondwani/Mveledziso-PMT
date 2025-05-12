"use client";

import { useContext, useReducer } from "react";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { 
  INITIAL_STATE, 
  UserDutyStateContext, 
  UserDutyActionContext,
  IUserDutyActionContext,
  IUserDuty,
  ICreateUserDutyDto,
  IUpdateUserDutyDto,
  IGetUserDutyInput
} from "./context";
import { UserDutyReducer } from "./reducer";
import { 
  setPending,
  setSuccess,
  setError,
  setUserDuty,
  setUserDuties
} from "./action";
import axios from 'axios';

const API_ENDPOINTS = {
  userDuties: "/api/services/app/UserDuty"
};

export const UserDutyProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(UserDutyReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.error?.message || error.message;
    }
    return 'An unexpected error occurred';
  };

  // Action implementations
  const createUserDuty = async (duty: ICreateUserDutyDto): Promise<IUserDuty> => {
    if (!duty.teamMemberId || !duty.projectDutyId) {
      throw new Error('TeamMemberId and ProjectDutyId are required');
    }

    if (!isValidGuid(duty.teamMemberId) || !isValidGuid(duty.projectDutyId)) {
      throw new Error('Invalid GUID format for teamMemberId or projectDutyId');
    }

    try {
      const response = await instance.post(`${API_ENDPOINTS.userDuties}/Create`, duty);
      return response.data.result;
    } catch (error) {
      console.error('Error creating user duty:', error);
      throw error;
    }
  };

  const getUserDuties = async (input: IGetUserDutyInput) => {
    console.log('getUserDuties called with input:', input);
    dispatch(setPending());
    try {
      // Validate GUIDs if provided
      if (input.teamMemberId && !isValidGuid(input.teamMemberId)) {
        console.error('Invalid GUID format for teamMemberId:', input.teamMemberId);
        throw new Error('Invalid GUID format for teamMemberId');
      }
      if (input.projectDutyId && !isValidGuid(input.projectDutyId)) {
        console.error('Invalid GUID format for projectDutyId:', input.projectDutyId);
        throw new Error('Invalid GUID format for projectDutyId');
      }

      const params = {
        teamMemberId: input.teamMemberId,
        projectDutyId: input.projectDutyId,
        fromDate: input.fromDate?.toISOString(),
        toDate: input.toDate?.toISOString(),
        skipCount: input.skipCount || 0,
        maxResultCount: input.maxResultCount || 10
      };

      console.log('Making API call to GetAll with params:', params);
      const response = await instance.get(`${API_ENDPOINTS.userDuties}/GetAll`, { params });
      console.log('API response from GetAll:', response.data);
      
      const duties: IUserDuty[] = response.data.result.items;
      const totalCount: number = response.data.result.totalCount;
      console.log('Mapped duties from API:', duties);
      console.log('Total count:', totalCount);
      
      dispatch(setUserDuties(duties, totalCount));
      return duties;
    } catch (error) {
      console.error('Error in getUserDuties:', error);
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const updateUserDuty = async (duty: IUpdateUserDutyDto) => {
    dispatch(setPending());
    try {
      // Validate GUIDs
      if (!isValidGuid(duty.id) || !isValidGuid(duty.teamMemberId) || !isValidGuid(duty.projectDutyId)) {
        throw new Error('Invalid GUID format for id, teamMemberId, or projectDutyId');
      }

      const response = await instance.put(`${API_ENDPOINTS.userDuties}/Update`, duty);
      const updatedDuty: IUserDuty = response.data.result;
      dispatch(setUserDuty(updatedDuty));
      return updatedDuty;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const deleteUserDuty = async (id: string) => {
    dispatch(setPending());
    try {
      // Validate GUID
      if (!isValidGuid(id)) {
        throw new Error('Invalid GUID format for id');
      }

      await instance.delete(`${API_ENDPOINTS.userDuties}/Delete`, { params: { id } });
      dispatch(setSuccess("User duty deleted successfully"));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const getUserDuty = async (id: string) => {
    dispatch(setPending());
    try {
      // Validate GUID
      if (!isValidGuid(id)) {
        throw new Error('Invalid GUID format for id');
      }

      const response = await instance.get(`${API_ENDPOINTS.userDuties}/Get`, { params: { id } });
      const duty: IUserDuty = response.data.result;
      dispatch(setUserDuty(duty));
      return duty;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const actionContextValue: IUserDutyActionContext = {
    createUserDuty,
    updateUserDuty,
    deleteUserDuty,
    getUserDuty,
    getUserDuties
  };

  return (
    <UserDutyStateContext.Provider value={state}>
      <UserDutyActionContext.Provider value={actionContextValue}>
        {children}
      </UserDutyActionContext.Provider>
    </UserDutyStateContext.Provider>
  );
};

// Helper function to validate GUID format
const isValidGuid = (guid: string): boolean => {
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return guidRegex.test(guid);
};

export const useUserDutyState = () => {
  const context = useContext(UserDutyStateContext);
  if (!context) throw new Error('useUserDutyState must be used within a UserDutyProvider');
  return context;
};

export const useUserDutyActions = () => {
  const context = useContext(UserDutyActionContext);
  if (!context) throw new Error('useUserDutyActions must be used within a UserDutyProvider');
  return context;
};