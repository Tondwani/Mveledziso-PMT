import React, { useContext, useReducer } from 'react';
import { TimelineStateContext, TimelineActionContext, ITimelineStateContext, 
  ICreateTimelineDto, IUpdateTimelineDto, IGetTimelineInput, ICreateTimelinePhaseDto, 
  IUpdateTimelinePhaseDto, IGetTimelinePhaseInput } from './context';
import { TimelineReducer } from './reducer';
import { setPending, setSuccess, setError, setTimeline, setTimelines, 
  setTimelinePhase, setTimelinePhases } from './action';
import axios from 'axios';

interface Props {
  children: React.ReactNode;
}

const TimelineProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(TimelineReducer, {} as ITimelineStateContext);

  const handleError = (error: unknown) => {
    const message = axios.isAxiosError(error) 
      ? error.response?.data?.error?.message || error.message
      : 'An unexpected error occurred';
    dispatch(setError(message));
    throw error;
  };

  const createTimeline = async (timeline: ICreateTimelineDto) => {
    try {
      dispatch(setPending());
      const response = await axios.post('/api/services/app/Timeline/Create', timeline);
      const result = response.data.result;
      dispatch(setTimeline(result));
      dispatch(setSuccess());
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
      dispatch(setSuccess());
      return result;
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const deleteTimeline = async (id: string) => {
    try {
      dispatch(setPending());
      await axios.delete(`/api/services/app/Timeline/Delete?Id=${id}`);
      dispatch(setSuccess());
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

  const getTimelines = async (input: IGetTimelineInput) => {
    try {
      dispatch(setPending());
      const response = await axios.get('/api/services/app/Timeline/GetAll', { params: input });
      const result = response.data.result;
      dispatch(setTimelines(result));
      dispatch(setSuccess());
      return result;
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const createTimelinePhase = async (phase: ICreateTimelinePhaseDto) => {
    try {
      dispatch(setPending());
      const response = await axios.post('/api/services/app/TimelinePhase/Create', phase);
      const result = response.data.result;
      dispatch(setTimelinePhase(result));
      dispatch(setSuccess());
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
      dispatch(setSuccess());
      return result;
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const deleteTimelinePhase = async (id: string) => {
    try {
      dispatch(setPending());
      await axios.delete(`/api/services/app/TimelinePhase/Delete?Id=${id}`);
      dispatch(setSuccess());
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
      const response = await axios.get('/api/services/app/TimelinePhase/GetAll', { params: input });
      const result = response.data.result;
      dispatch(setTimelinePhases(result));
      dispatch(setSuccess());
      return result;
    } catch (error: unknown) {
      handleError(error);
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
