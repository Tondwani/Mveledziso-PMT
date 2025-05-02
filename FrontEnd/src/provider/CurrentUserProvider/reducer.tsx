import { handleActions } from "redux-actions";
import { INITIAL_STATE, ISessionStateContext, SessionData } from "./context";
import { SessionActionEnum } from "./action";

type SessionActionPayload =
  | undefined // for CLEAR_SESSION
  | SessionData // for GET_SESSION_SUCCESS
  | string;     // for GET_SESSION_ERROR (error message)

export const SessionReducer = handleActions<ISessionStateContext, SessionActionPayload>(
  {
    [SessionActionEnum.GET_SESSION_PENDING]: (state) => ({
      ...state,
      isPending: true,
      isSuccess: false,
      isError: false,
    }),
    [SessionActionEnum.GET_SESSION_SUCCESS]: (state, action) => ({
      ...state,
      isPending: false,
      isSuccess: true,
      data: action.payload as SessionData,
    }),
    [SessionActionEnum.GET_SESSION_ERROR]: (state, action) => ({
      ...state,
      isPending: false,
      isError: true,
      error: action.payload as string,
    }),
    [SessionActionEnum.CLEAR_SESSION]: () => INITIAL_STATE,
  },
  INITIAL_STATE
);
