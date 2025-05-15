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

  // Helper function to validate GUID format
  const isValidGuid = (value: unknown): boolean => {
    if (!value) return false;
    const guid = String(value).trim();
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(guid);
  };

  // Helper function to format value as GUID
  const formatGuid = (value: unknown): string => {
    if (!value) return '';
    return String(value).trim().toLowerCase();
  };

  const createUserDuty = async (duty: ICreateUserDutyDto): Promise<IUserDuty> => {
    dispatch(setPending());
    try {
      // Validate required fields
      if (!duty.teamMemberId || !duty.projectDutyId) {
        throw new Error('TeamMemberId and ProjectDutyId are required');
      }

      // Format and validate GUIDs
      const formattedDuty = {
        teamMemberId: formatGuid(duty.teamMemberId),
        projectDutyId: formatGuid(duty.projectDutyId)
      };

      // Validate GUIDs
      if (!isValidGuid(formattedDuty.teamMemberId)) {
        throw new Error('Invalid GUID format for teamMemberId');
      }
      if (!isValidGuid(formattedDuty.projectDutyId)) {
        throw new Error('Invalid GUID format for projectDutyId');
      }

      const response = await instance.post(`${API_ENDPOINTS.userDuties}/Create`, formattedDuty);
      const createdDuty = response.data.result;
      dispatch(setUserDuty(createdDuty));
      dispatch(setSuccess('User duty created successfully'));
      return createdDuty;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const getUserDuties = async (input: IGetUserDutyInput): Promise<IUserDuty[]> => {
    dispatch(setPending());
    try {
      // Format and validate GUIDs if provided
      const formattedInput = {
        ...input,
        teamMemberId: input.teamMemberId ? formatGuid(input.teamMemberId) : undefined,
        projectDutyId: input.projectDutyId ? formatGuid(input.projectDutyId) : undefined
      };

      // Validate GUIDs if provided
      if (formattedInput.teamMemberId && !isValidGuid(formattedInput.teamMemberId)) {
        throw new Error('Invalid GUID format for teamMemberId');
      }
      if (formattedInput.projectDutyId && !isValidGuid(formattedInput.projectDutyId)) {
        throw new Error('Invalid GUID format for projectDutyId');
      }

      const response = await instance.get(`${API_ENDPOINTS.userDuties}/GetAll`, { params: formattedInput });
      const duties = response.data.result.items;
      const totalCount = response.data.result.totalCount;
      dispatch(setUserDuties(duties, totalCount));
      return duties;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const updateUserDuty = async (duty: IUpdateUserDutyDto): Promise<IUserDuty> => {
    dispatch(setPending());
    try {
      // Format and validate GUIDs
      const formattedDuty = {
        id: formatGuid(duty.id),
        teamMemberId: formatGuid(duty.teamMemberId),
        projectDutyId: formatGuid(duty.projectDutyId)
      };

      // Validate GUIDs
      if (!isValidGuid(formattedDuty.id)) {
        throw new Error('Invalid GUID format for id');
      }
      if (!isValidGuid(formattedDuty.teamMemberId)) {
        throw new Error('Invalid GUID format for teamMemberId');
      }
      if (!isValidGuid(formattedDuty.projectDutyId)) {
        throw new Error('Invalid GUID format for projectDutyId');
      }

      const response = await instance.put(`${API_ENDPOINTS.userDuties}/Update`, formattedDuty);
      const updatedDuty = response.data.result;
      dispatch(setUserDuty(updatedDuty));
      dispatch(setSuccess('User duty updated successfully'));
      return updatedDuty;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const deleteUserDuty = async (id: string): Promise<void> => {
    dispatch(setPending());
    try {
      // Format and validate GUID
      const formattedId = formatGuid(id);
      if (!isValidGuid(formattedId)) {
        throw new Error('Invalid GUID format for id');
      }

      await instance.delete(`${API_ENDPOINTS.userDuties}/Delete`, { params: { id: formattedId } });
      dispatch(setSuccess('User duty deleted successfully'));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const getUserDuty = async (id: string): Promise<IUserDuty> => {
    dispatch(setPending());
    try {
      // Format and validate GUID
      const formattedId = formatGuid(id);
      if (!isValidGuid(formattedId)) {
        throw new Error('Invalid GUID format for id');
      }

      const response = await instance.get(`${API_ENDPOINTS.userDuties}/Get`, { params: { id: formattedId } });
      const duty = response.data.result;
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