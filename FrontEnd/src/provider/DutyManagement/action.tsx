import { IUserDuty } from "./context";

export enum UserDutyActionEnum {
  SET_PENDING = "SET_DUTY_PENDING",
  SET_SUCCESS = "SET_DUTY_SUCCESS",
  SET_ERROR = "SET_DUTY_ERROR",
  SET_USER_DUTY = "SET_USER_DUTY",
  SET_USER_DUTIES = "SET_USER_DUTIES",
  RESET_STATE = "RESET_DUTY_STATE"
}


export const setPending = () => ({
  type: UserDutyActionEnum.SET_PENDING,
  payload: { isPending: true, isSuccess: false, isError: false, errorMessage: undefined }
});

export const setSuccess = (message?: string) => ({
  type: UserDutyActionEnum.SET_SUCCESS,
  payload: { isPending: false, isSuccess: true, isError: false, errorMessage: undefined, message }
});

export const setError = (errorMessage: string) => ({
  type: UserDutyActionEnum.SET_ERROR,
  payload: { isPending: false, isSuccess: false, isError: true, errorMessage }
});

export const resetState = () => ({
  type: UserDutyActionEnum.RESET_STATE
});

export const setUserDuty = (userDuty: IUserDuty) => ({
  type: UserDutyActionEnum.SET_USER_DUTY,
  payload: { userDuty, isPending: false, isSuccess: true, isError: false }
});

export const setUserDuties = (userDuties: IUserDuty[], totalCount: number = 0) => ({
  type: UserDutyActionEnum.SET_USER_DUTIES,
  payload: { userDuties, totalCount, isPending: false, isSuccess: true, isError: false }
});