import { IUserDuty } from "./context";

export enum UserDutyActionEnum {
  PENDING = "USER_DUTY_PENDING",
  SUCCESS = "USER_DUTY_SUCCESS",
  ERROR = "USER_DUTY_ERROR",
  DUTIES_LOADED = "USER_DUTIES_LOADED",
}

// Base Actions
export const userDutyPending = () => ({
  type: UserDutyActionEnum.PENDING,
  payload: { isPending: true, isSuccess: false, isError: false }
});

export const userDutySuccess = (message: string) => ({
  type: UserDutyActionEnum.SUCCESS,
  payload: { isPending: false, isSuccess: true, message }
});

export const userDutyError = (message: string) => ({
  type: UserDutyActionEnum.ERROR,
  payload: { isPending: false, isError: true, message }
});

// Specific Actions
export const createUserDutySuccess = (duty: IUserDuty) => ({
  type: UserDutyActionEnum.SUCCESS,
  payload: {
    ...userDutySuccess("User duty created successfully").payload,
    userDuty: duty,
    userDuties: [duty]
  }
});

export const loadUserDutiesSuccess = (duties: IUserDuty[]) => ({
  type: UserDutyActionEnum.DUTIES_LOADED,
  payload: {
    ...userDutySuccess("User duties loaded successfully").payload,
    userDuties: duties
  }
});