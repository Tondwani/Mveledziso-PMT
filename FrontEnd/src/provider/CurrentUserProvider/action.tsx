import { createAction } from "redux-actions";
import { SessionData } from "./context";

export enum SessionActionEnum {
  GET_SESSION_PENDING = "GET_SESSION_PENDING",
  GET_SESSION_SUCCESS = "GET_SESSION_SUCCESS",
  GET_SESSION_ERROR = "GET_SESSION_ERROR",
  CLEAR_SESSION = "CLEAR_SESSION",
}

export const getSessionPending = createAction(SessionActionEnum.GET_SESSION_PENDING);
export const getSessionSuccess = createAction<SessionData>(SessionActionEnum.GET_SESSION_SUCCESS);
export const getSessionError = createAction<string>(SessionActionEnum.GET_SESSION_ERROR);
export const clearSession = createAction(SessionActionEnum.CLEAR_SESSION);