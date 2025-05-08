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
  userDutyPending,
  userDutySuccess,
  userDutyError,
  createUserDutySuccess,
  loadUserDutiesSuccess
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
  const createUserDuty = async (duty: ICreateUserDutyDto) => {
    dispatch(userDutyPending());
    try {
      const response = await instance.post(`${API_ENDPOINTS.userDuties}/Create`, duty);
      const createdDuty: IUserDuty = response.data.result;
      dispatch(createUserDutySuccess(createdDuty));
      return createdDuty;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(userDutyError(errorMessage));
      throw error;
    }
  };

  const getUserDuties = async (input: IGetUserDutyInput) => {
    dispatch(userDutyPending());
    try {
      const params = {
        teamMemberId: input.teamMemberId,
        projectDutyId: input.projectDutyId,
        fromDate: input.fromDate?.toISOString(),
        toDate: input.toDate?.toISOString()
      };

      const response = await instance.get(`${API_ENDPOINTS.userDuties}/GetAll`, { params });
      const duties: IUserDuty[] = response.data.result.items;
      dispatch(loadUserDutiesSuccess(duties));
      return duties;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(userDutyError(errorMessage));
      throw error;
    }
  };

  const updateUserDuty = async (duty: IUpdateUserDutyDto) => {
    dispatch(userDutyPending());
    try {
      const response = await instance.put(`${API_ENDPOINTS.userDuties}/Update`, duty);
      const updatedDuty: IUserDuty = response.data.result;
      dispatch(createUserDutySuccess(updatedDuty));
      return updatedDuty;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(userDutyError(errorMessage));
      throw error;
    }
  };

  const deleteUserDuty = async (id: string) => {
    dispatch(userDutyPending());
    try {
      await instance.delete(`${API_ENDPOINTS.userDuties}/Delete`, { params: { id } });
      dispatch(userDutySuccess("User duty deleted successfully"));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(userDutyError(errorMessage));
      throw error;
    }
  };

  const actionContextValue: IUserDutyActionContext = {
    createUserDuty,
    updateUserDuty,
    deleteUserDuty,
    getUserDuty: async (id) => {
      dispatch(userDutyPending());
      try {
        const response = await instance.get(`${API_ENDPOINTS.userDuties}/Get`, { params: { id } });
        const duty: IUserDuty = response.data.result;
        dispatch(createUserDutySuccess(duty));
        return duty;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        dispatch(userDutyError(errorMessage));
        throw error;
      }
    },
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