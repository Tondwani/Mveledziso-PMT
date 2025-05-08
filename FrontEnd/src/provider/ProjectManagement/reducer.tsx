import { handleActions } from "redux-actions";
import { ProjectActionEnum } from "./action";
import { INITIAL_STATE, IProjectStateContext, IProject, IProjectDuty } from "./context";

// Define a type for the action payload
interface ActionPayload {
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  message?: string;
  project?: IProject;
  projects?: IProject[];
  projectDuty?: IProjectDuty;
  projectDuties?: IProjectDuty[];
}

export const ProjectReducer = handleActions<IProjectStateContext, ActionPayload>(
  {
    // Project Reducers
    [ProjectActionEnum.PROJECT_PENDING]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.PROJECT_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.PROJECT_ERROR]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.PROJECTS_LOADED]: (state, action) => ({
      ...state,
      projects: action.payload.projects,
      ...action.payload
    }),

    // Duty Reducers
    [ProjectActionEnum.DUTY_PENDING]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.DUTY_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.DUTY_ERROR]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ProjectActionEnum.DUTIES_LOADED]: (state, action) => ({
      ...state,
      projectDuties: action.payload.projectDuties,
      ...action.payload
    }),
  },
  INITIAL_STATE
);