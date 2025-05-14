import React, { useContext, useReducer } from 'react';
import { TimelineStateContext, TimelineActionContext, 
  ICreateTimelineDto, IUpdateTimelineDto, IGetTimelineInput, ICreateTimelinePhaseDto, 
  IUpdateTimelinePhaseDto, IGetTimelinePhaseInput, ITimeline, INITIAL_STATE, ITimelinePhase } from './context';
import { TimelineReducer } from './reducer';
import { setPending, setSuccess, setError, setTimeline, setTimelines, 
  setTimelinePhase, setTimelinePhases} from './action';
import axios from 'axios';
import { getAxiosInstance } from '../../utils/axiosInstance';

interface Props {
  children: React.ReactNode;
}

interface TimelineResponse {
  totalCount: number;
  items: ITimeline[];
}

const TimelineProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(TimelineReducer, INITIAL_STATE);
  const axiosInstance = getAxiosInstance();

  // Skip certificate validation in development
  const setupHttpsAgent = async () => {
    const httpsModule = await import('https');
    return new httpsModule.Agent({
      rejectUnauthorized: false
    });
  };

  const handleError = (error: unknown): string => {
    let errorMessage = 'An unexpected error occurred';
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error?.message || error.message;
      
      switch (status) {
        case 400:
          errorMessage = `Invalid request: ${message}`;
          break;
        case 401:
          errorMessage = `Authentication required: ${message}`;
          break;
        case 403:
          errorMessage = `Access denied: ${message}`;
          break;
        case 404:
          errorMessage = `Resource not found: ${message}`;
          break;
        case 409:
          errorMessage = `Conflict: ${message}`;
          break;
        case 500:
          errorMessage = `Server error: ${message}`;
          break;
        default:
          errorMessage = message || errorMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    dispatch(setError(errorMessage));
    return errorMessage;
  };

  // Timeline API operations
  const createTimeline = async (timeline: ICreateTimelineDto): Promise<ITimeline> => {
    dispatch(setPending());
    try {
      const httpsAgent = await setupHttpsAgent();
      const response = await axiosInstance.post('/api/services/app/Timeline/Create', 
        timeline,
        { httpsAgent }
      );
      const result = response.data.result;
      dispatch(setTimeline(result));
      dispatch(setSuccess());
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const updateTimeline = async (timeline: IUpdateTimelineDto): Promise<ITimeline> => {
    dispatch(setPending());
    try {
      const httpsAgent = await setupHttpsAgent();
      const response = await axiosInstance.put('/api/services/app/Timeline/Update', 
        timeline,
        { httpsAgent }
      );
      const result = response.data.result;
      dispatch(setTimeline(result));
      dispatch(setSuccess());
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const deleteTimeline = async (id: string): Promise<void> => {
    dispatch(setPending());
    try {
      const httpsAgent = await setupHttpsAgent();
      await axiosInstance.delete(`/api/services/app/Timeline/Delete?Id=${encodeURIComponent(id)}`,
        { httpsAgent }
      );
      dispatch(setSuccess());
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const getTimeline = async (id: string): Promise<ITimeline> => {
    dispatch(setPending());
    try {
      const httpsAgent = await setupHttpsAgent();
      const response = await axiosInstance.get(`/api/services/app/Timeline/Get?Id=${encodeURIComponent(id)}`,
        { httpsAgent }
      );
      const result = response.data.result;
      dispatch(setTimeline(result));
      dispatch(setSuccess());
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const getTimelines = async (input: IGetTimelineInput): Promise<TimelineResponse> => {
    dispatch(setPending());
    try {
      const httpsAgent = await setupHttpsAgent();
      const params = {
        maxResultCount: input.maxResultCount || 10,
        skipCount: input.skipCount || 0,
        projectId: input.projectId,
        isDeleted: input.isDeleted
      };
      
      const response = await axiosInstance.get('/api/services/app/Timeline/GetAll', { 
        params,
        httpsAgent
      });
      
      const result = response.data.result as TimelineResponse;
      dispatch(setTimelines(result.items, result.totalCount));
      dispatch(setSuccess());
      return result;
    } catch (error) {
      handleError(error);
      return { totalCount: 0, items: [] };
    }
  };

  // TimelinePhase API operations
  const createTimelinePhase = async (phase: ICreateTimelinePhaseDto): Promise<ITimelinePhase> => {
    dispatch(setPending());
    try {
      const httpsAgent = await setupHttpsAgent();
      const response = await axiosInstance.post('/api/services/app/TimelinePhase/Create', 
        phase,
        { httpsAgent }
      );
      const result = response.data.result;
      dispatch(setTimelinePhase(result));
      dispatch(setSuccess());
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const updateTimelinePhase = async (phase: IUpdateTimelinePhaseDto): Promise<ITimelinePhase> => {
    dispatch(setPending());
    try {
      const httpsAgent = await setupHttpsAgent();
      const response = await axiosInstance.put('/api/services/app/TimelinePhase/Update', 
        phase,
        { httpsAgent }
      );
      const result = response.data.result;
      dispatch(setTimelinePhase(result));
      dispatch(setSuccess());
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const deleteTimelinePhase = async (id: string): Promise<void> => {
    dispatch(setPending());
    try {
      const httpsAgent = await setupHttpsAgent();
      await axiosInstance.delete(`/api/services/app/TimelinePhase/Delete?Id=${encodeURIComponent(id)}`,
        { httpsAgent }
      );
      dispatch(setSuccess());
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const getTimelinePhase = async (id: string): Promise<ITimelinePhase> => {
    dispatch(setPending());
    try {
      const httpsAgent = await setupHttpsAgent();
      const response = await axiosInstance.get(`/api/services/app/TimelinePhase/Get?Id=${encodeURIComponent(id)}`,
        { httpsAgent }
      );
      const result = response.data.result;
      dispatch(setTimelinePhase(result));
      dispatch(setSuccess());
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const getTimelinePhases = async (input: IGetTimelinePhaseInput): Promise<ITimelinePhase[]> => {
    dispatch(setPending());
    try {
      const httpsAgent = await setupHttpsAgent();
      const response = await axiosInstance.get('/api/services/app/TimelinePhase/GetList', { 
        params: input,
        httpsAgent
      });
      const result = response.data.result;
      dispatch(setTimelinePhases(result));
      dispatch(setSuccess());
      return result;
    } catch (error) {
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
