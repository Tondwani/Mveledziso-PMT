import React, { useContext, useReducer } from 'react';
import { TimelineStateContext, TimelineActionContext, ITimelineStateContext, 
  ICreateTimelineDto, IUpdateTimelineDto, IGetTimelineInput, ICreateTimelinePhaseDto, 
  IUpdateTimelinePhaseDto, IGetTimelinePhaseInput, ITimeline } from './context';
import { TimelineReducer } from './reducer';
import { setPending, setSuccess, setError, setTimeline, setTimelines, 
  setTimelinePhase, setTimelinePhases } from './action';
import axios from 'axios';

interface Props {
  children: React.ReactNode;
}

interface TimelineResponse {
  totalCount: number;
  items: ITimeline[];
}

const TimelineProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(TimelineReducer, {} as ITimelineStateContext);

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error?.message || error.message;
      
      switch (status) {
        case 400:
          dispatch(setError(`Invalid request: ${message}`));
          break;
        case 401:
          dispatch(setError(`Authentication required: ${message}`));
          break;
        case 403:
          dispatch(setError(`Access denied: ${message}`));
          break;
        case 404:
          dispatch(setError(`Resource not found: ${message}`));
          break;
        case 409:
          dispatch(setError(`Conflict: ${message}`));
          break;
        case 500:
          dispatch(setError(`Server error: ${message}`));
          break;
        default:
          dispatch(setError(message || 'An unexpected error occurred'));
      }
    } else if (error instanceof Error) {
      dispatch(setError(error.message));
    } else {
      dispatch(setError('An unexpected error occurred'));
    }
    throw error;
  };

  const createTimeline = async (timeline: ICreateTimelineDto) => {
    try {
      dispatch(setPending());
      const response = await axios.post('/api/services/app/Timeline/Create', timeline);
      const result = response.data.result;
      dispatch(setTimeline(result));
      dispatch(setSuccess('Timeline created successfully'));
      return result;
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const updateTimeline = async (timeline: IUpdateTimelineDto) => {
    try {
      dispatch(setPending());
      const response = await axios.put(`/api/services/app/Timeline/Update`, timeline);
      const result = response.data.result;
      dispatch(setTimeline(result));
      dispatch(setSuccess('Timeline updated successfully'));
      return result;
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const deleteTimeline = async (id: string) => {
    try {
      dispatch(setPending());
      await axios.delete(`/api/services/app/Timeline/Delete?Id=${id}`);
      dispatch(setSuccess('Timeline deleted successfully'));
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const getTimeline = async (id: string) => {
    try {
      dispatch(setPending());
      const response = await axios.get(`/api/services/app/Timeline/Get?Id=${id}`);
      const result = response.data.result;
      dispatch(setTimeline(result));
      dispatch(setSuccess());
      return result;
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const getTimelines = async (input: IGetTimelineInput): Promise<TimelineResponse> => {
    try {
      dispatch(setPending());
      const params = {
        maxResultCount: input.maxResultCount || 10,
        skipCount: input.skipCount || 0,
        projectId: input.projectId
      };
      const response = await axios.get('/api/services/app/Timeline/GetAll', { params });
     
      const result = response.data.result as TimelineResponse;
      dispatch(setTimelines(result.items));
      dispatch(setSuccess());
      return result;
    } catch (error: unknown) {
      handleError(error);
      return { totalCount: 0, items: [] };
    }
  };

  const createTimelinePhase = async (phase: ICreateTimelinePhaseDto) => {
    try {
      dispatch(setPending());
      const response = await axios.post('/api/services/app/TimelinePhase/Create', phase);
      const result = response.data.result;
      dispatch(setTimelinePhase(result));
      dispatch(setSuccess('Timeline phase created successfully'));
      return result;
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const updateTimelinePhase = async (phase: IUpdateTimelinePhaseDto) => {
    try {
      dispatch(setPending());
      const response = await axios.put(`/api/services/app/TimelinePhase/Update`, phase);
      const result = response.data.result;
      dispatch(setTimelinePhase(result));
      dispatch(setSuccess('Timeline phase updated successfully'));
      return result;
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const deleteTimelinePhase = async (id: string) => {
    try {
      dispatch(setPending());
      await axios.delete(`/api/services/app/TimelinePhase/Delete?Id=${id}`);
      dispatch(setSuccess('Timeline phase deleted successfully'));
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const getTimelinePhase = async (id: string) => {
    try {
      dispatch(setPending());
      const response = await axios.get(`/api/services/app/TimelinePhase/Get?Id=${id}`);
      const result = response.data.result;
      dispatch(setTimelinePhase(result));
      dispatch(setSuccess());
      return result;
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const getTimelinePhases = async (input: IGetTimelinePhaseInput) => {
    try {
      dispatch(setPending());
      const response = await axios.get('/api/services/app/TimelinePhase/GetList', { params: input });
      const result = response.data.result;
      dispatch(setTimelinePhases(result));
      dispatch(setSuccess());
      return result;
    } catch (error: unknown) {
      handleError(error);
      return [];
    }
  };

  return (
    <TimelineStateContext.Provider value={state}>
      <TimelineActionContext.Provider
        value={{
          createTimeline,
          updateTimeline,
          deleteTimeline,
          getTimeline,
          getTimelines,
          createTimelinePhase,
          updateTimelinePhase,
          deleteTimelinePhase,
          getTimelinePhase,
          getTimelinePhases
        }}
      >
        {children}
      </TimelineActionContext.Provider>
    </TimelineStateContext.Provider>
  );
};

// Custom hooks
export const useTimelineState = () => {
  const context = useContext(TimelineStateContext);
  if (context === undefined) {
    throw new Error('useTimelineState must be used within a TimelineProvider');
  }
  return context;
};

export const useTimelineActions = () => {
  const context = useContext(TimelineActionContext);
  if (context === undefined) {
    throw new Error('useTimelineActions must be used within a TimelineProvider');
  }
  return context;
};

export default TimelineProvider;
