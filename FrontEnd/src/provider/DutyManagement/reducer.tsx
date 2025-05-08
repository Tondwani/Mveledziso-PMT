import { handleActions } from "redux-actions";
import { INITIAL_STATE, IUserDutyStateContext, IUserDuty } from "./context";
import { UserDutyActionEnum } from "./action";

interface IUserDutyAction {
  type: UserDutyActionEnum;
  payload: {
    isPending?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    message?: string;
    userDuty?: IUserDuty;
    userDuties?: IUserDuty[];
  };
}

export const UserDutyReducer = handleActions<IUserDutyStateContext, IUserDutyAction['payload']>(
  {
    [UserDutyActionEnum.PENDING]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [UserDutyActionEnum.SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [UserDutyActionEnum.ERROR]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [UserDutyActionEnum.DUTIES_LOADED]: (state, action) => ({
      ...state,
      userDuties: action.payload.userDuties,
      ...action.payload
    }),
  },
  INITIAL_STATE
);