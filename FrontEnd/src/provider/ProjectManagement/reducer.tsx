import { handleActions } from "redux-actions";
import { INITIAL_STATE, IProjectStateContext, IProject, IProjectDuty } from "./context";
import { ProjectActionEnum } from "./action";

interface IProjectAction {
  type: ProjectActionEnum;
  payload?: {
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
    errorMessage?: string;
  message?: string;
    project?: IProject | null;
  projects?: IProject[];
    projectDuty?: IProjectDuty | null;
  projectDuties?: IProjectDuty[];
  };
}

export const ProjectReducer = handleActions<IProjectStateContext, IProjectAction['payload']>(
  {
    [ProjectActionEnum.SET_PENDING]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.SET_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.SET_ERROR]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.SET_PROJECT]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.SET_PROJECTS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.SET_PROJECT_DUTY]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.SET_PROJECT_DUTIES]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.RESET_STATE]: () => ({
      ...INITIAL_STATE
    })
  },
  INITIAL_STATE
);