"use client";
import { handleActions } from "redux-actions";
import { INITIAL_STATE, IProjectManagerStateContext, IProjectManager } from "./context";
import { ProjectManagerActionEnum } from "./action";

interface IProjectManagerAction {
  type: ProjectManagerActionEnum;
  payload?: {
    isPending?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    errorMessage?: string;
    projectManager?: IProjectManager | null;
    projectManagers?: IProjectManager[];
    totalCount?: number;
  };
}

export const ProjectManagerReducer = handleActions<IProjectManagerStateContext, IProjectManagerAction['payload']>(
  {
    [ProjectManagerActionEnum.SET_PENDING]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectManagerActionEnum.SET_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectManagerActionEnum.SET_ERROR]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectManagerActionEnum.SET_PROJECT_MANAGER]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectManagerActionEnum.SET_PROJECT_MANAGERS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectManagerActionEnum.SET_TOTAL_COUNT]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectManagerActionEnum.RESET_STATE]: () => ({
      ...INITIAL_STATE
    })
  },
  INITIAL_STATE
); 