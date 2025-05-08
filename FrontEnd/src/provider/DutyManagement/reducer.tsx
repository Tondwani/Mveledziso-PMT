import { handleActions } from "redux-actions";
import { INITIAL_STATE, IUserDutyStateContext, IUserDuty } from "./context";
import { UserDutyActionEnum } from "./action";

interface IUserDutyAction {
  type: UserDutyActionEnum;
  payload?: {
    isPending?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    errorMessage?: string;
    userDuty?: IUserDuty | null;
    userDuties?: IUserDuty[];
  };
}

export const UserDutyReducer = handleActions<IUserDutyStateContext, IUserDutyAction['payload']>(
  {
    [UserDutyActionEnum.SET_PENDING]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [UserDutyActionEnum.SET_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [UserDutyActionEnum.SET_ERROR]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [UserDutyActionEnum.SET_USER_DUTY]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [UserDutyActionEnum.SET_USER_DUTIES]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [UserDutyActionEnum.RESET_STATE]: () => ({
      ...INITIAL_STATE
    })
  },
  INITIAL_STATE
);