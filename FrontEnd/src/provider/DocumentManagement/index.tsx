import React, { useReducer, useContext, useCallback } from "react";
import {
  DocumentStateContext,
  DocumentActionContext,
  IDocumentStateContext,
  IDocumentActionContext,
  IDocument,
  ICreateDocumentDto,
  IUpdateDocumentDto,
  IGetDocumentInput,
  INITIAL_STATE,
} from "./context";
import { DocumentReducer } from "./reducer";
import {
  setPending,
  setError,
  setSuccess,
  setDocument,
  setDocuments,
  setTotalCount,
} from "./action";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { AxiosError } from "axios";

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(DocumentReducer, INITIAL_STATE);
  const api = getAxiosInstance();

  const createDocument = useCallback(
    (document: ICreateDocumentDto): Promise<IDocument> => {
      return new Promise((resolve, reject) => {
        dispatch(setPending(true));
        api.post("/api/services/app/Document/Create", document)
          .then(response => {
            const result = response.data.result;
            dispatch(setDocument(result));
            dispatch(setSuccess(true));
            resolve(result);
          })
          .catch(error => {
            const axiosError = error as AxiosError;
            dispatch(setError(axiosError.message || "Failed to create document"));
            reject(error);
          });
      });
    },
    [api]
  );

  const updateDocument = useCallback(
    (id: string, document: IUpdateDocumentDto): Promise<IDocument> => {
      return new Promise((resolve, reject) => {
        dispatch(setPending(true));
        api.put(`/api/services/app/Document/Update?id=${id}`, document)
          .then(response => {
            const result = response.data.result;
            dispatch(setDocument(result));
            dispatch(setSuccess(true));
            resolve(result);
          })
          .catch(error => {
            const axiosError = error as AxiosError;
            dispatch(setError(axiosError.message || "Failed to update document"));
            reject(error);
          });
      });
    },
    [api]
  );

  const deleteDocument = useCallback(
    (id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        dispatch(setPending(true));
        api.delete(`/api/services/app/Document/Delete?id=${id}`)
          .then(() => {
            dispatch(setDocument(null));
            dispatch(setSuccess(true));
            resolve();
          })
          .catch(error => {
            const axiosError = error as AxiosError;
            dispatch(setError(axiosError.message || "Failed to delete document"));
            reject(error);
          });
      });
    },
    [api]
  );

  const getDocument = useCallback(
    (id: string): Promise<IDocument> => {
      return new Promise((resolve, reject) => {
        dispatch(setPending(true));
        api.get(`/api/services/app/Document/Get?id=${id}`)
          .then(response => {
            const result = response.data.result;
            dispatch(setDocument(result));
            dispatch(setSuccess(true));
            resolve(result);
          })
          .catch(error => {
            const axiosError = error as AxiosError;
            dispatch(setError(axiosError.message || "Failed to fetch document"));
            reject(error);
          });
      });
    },
    [api]
  );

  const getDocuments = useCallback(
    (input: IGetDocumentInput): Promise<{ items: IDocument[]; totalCount: number }> => {
      return new Promise((resolve, reject) => {
        dispatch(setPending(true));
        console.log('Fetching documents with params:', input);
        
        api.get<{
          result: {
            items: IDocument[];
            totalCount: number;
          };
        }>("/api/services/app/Document/GetAll", {
          params: input,
          paramsSerializer: params => {
            return Object.entries(params)
              .filter(([, value]) => value !== undefined && value !== '')
              .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
              .join('&');
          },
        })
          .then(response => {
            console.log('Documents API response:', response);
            
            if (!response.data || !response.data.result) {
              throw new Error('Invalid response format from server');
            }
            
            const { items, totalCount } = response.data.result;
            
            if (!Array.isArray(items)) {
              console.error('Expected items to be an array, received:', items);
              throw new Error('Invalid data format: expected items to be an array');
            }
            
            console.log(`Fetched ${items.length} documents, total count: ${totalCount}`);
            
            dispatch(setDocuments(items));
            dispatch(setTotalCount(totalCount || items.length));
            dispatch(setSuccess(true));
            
            return { items, totalCount };
          })
          .then(result => {
            resolve(result);
            return result;
          })
          .catch((error: unknown) => {
            const axiosError = error as AxiosError<{
              error?: {
                message?: string;
                details?: string;
              };
              message?: string;
            }>;
            
            console.error('Error fetching documents:', axiosError);
            
            let errorMessage = 'Failed to fetch documents';
            
            if (axiosError.response) {
              console.error('Response data:', axiosError.response.data);
              console.error('Response status:', axiosError.response.status);
              
              const responseData = axiosError.response.data;
              
              if (responseData?.error) {
                errorMessage = responseData.error.message || 
                              responseData.error.details || 
                              errorMessage;
              } else if (responseData?.message) {
                errorMessage = responseData.message;
              } else {
                errorMessage = `Request failed with status ${axiosError.response.status}`;
              }
            } else if (axiosError.request) {
              // The request was made but no response was received
              console.error('No response received:', axiosError.request);
              errorMessage = 'No response from server. Please check your connection.';
            } else {
              // Something happened in setting up the request that triggered an Error
              console.error('Request error:', axiosError.message);
              errorMessage = axiosError.message || errorMessage;
            }
            
            dispatch(setDocuments([]));
            dispatch(setTotalCount(0));
            dispatch(setError(errorMessage));
            
            reject(new Error(errorMessage));
          });
      });
    },
    [api]
  );

  const uploadDocument = useCallback(
    async (file: File, projectDutyId?: string): Promise<IDocument> => {
      return new Promise((resolve, reject) => {
        dispatch(setPending(true));

        const formData = new FormData();
        formData.append('file', file);

        if (projectDutyId) {
          formData.append('projectDutyId', projectDutyId);
        }

        console.log('Uploading file:', file.name);

        api
          .post('/api/services/app/Document/Upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json'
            },
          })
          .then(response => {
            console.log('Upload response:', response);
            
            if (!response.data || !response.data.result) {
              throw new Error('Invalid response format from server');
            }
            
            const result = response.data.result;
            console.log('Upload successful, document:', result);
            
            // Update the document in the state
            dispatch(setDocument(result));
            
            // Also add to the documents list if needed
            if (Array.isArray(state.documents)) {
              dispatch(setDocuments([...state.documents, result]));
            }
            
            dispatch(setSuccess(true));
            resolve(result);
          })
          .catch((error: unknown) => {
            const axiosError = error as AxiosError<{
              error?: {
                message?: string;
                details?: string;
                validationErrors?: Array<{
                  message: string;
                  members: string[];
                }>;
              };
              message?: string;
            }>;
            
            console.error('Upload error:', axiosError);
            
            let errorMessage = "Failed to upload document";
            
            if (axiosError.response) {
              console.error('Response data:', axiosError.response.data);
              console.error('Response status:', axiosError.response.status);
              
              const responseData = axiosError.response.data;
              
              if (responseData?.error) {
                errorMessage = responseData.error.message || 
                              responseData.error.details || 
                              errorMessage;
                              
                // Handle validation errors if present
                if (responseData.error.validationErrors?.length) {
                  errorMessage = responseData.error.validationErrors
                    .map(err => err.message)
                    .join('; ');
                }
              } else if (responseData?.message) {
                errorMessage = responseData.message;
              }
            } else if (axiosError.request) {
              console.error('No response received:', axiosError.request);
              errorMessage = 'No response from server. Please check your connection.';
            } else {
              console.error('Request error:', axiosError.message);
              errorMessage = axiosError.message || errorMessage;
            }
            
            dispatch(setError(errorMessage));
            reject(new Error(errorMessage));
          });
      });
    },
    [api, state.documents]
  );

  const actions: IDocumentActionContext = {
    createDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    getDocuments,
    uploadDocument,
  };

  return (
    <DocumentStateContext.Provider value={state}>
      <DocumentActionContext.Provider value={actions}>
        {children}
      </DocumentActionContext.Provider>
    </DocumentStateContext.Provider>
  );
};

// Custom hooks for consuming the context
export const useDocumentState = (): IDocumentStateContext => {
  const context = useContext(DocumentStateContext);
  if (context === undefined) {
    throw new Error("useDocumentState must be used within a DocumentProvider");
  }
  return context;
};

export const useDocumentActions = (): IDocumentActionContext => {
  const context = useContext(DocumentActionContext);
  if (context === undefined) {
    throw new Error("useDocumentActions must be used within a DocumentProvider");
  }
  return context;
};