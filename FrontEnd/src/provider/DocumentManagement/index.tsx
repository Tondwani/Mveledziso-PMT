import React, { useReducer, useContext, useEffect, useState } from "react";
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

  type PendingOperation =
    | { type: 'create'; payload: ICreateDocumentDto; resolve: (value: IDocument) => void; reject: (error: unknown) => void }
    | { type: 'update'; payload: { id: string; document: IUpdateDocumentDto }; resolve: (value: IDocument) => void; reject: (error: unknown) => void }
    | { type: 'delete'; payload: string; resolve: (value: void) => void; reject: (error: unknown) => void }
    | { type: 'get'; payload: string; resolve: (value: IDocument) => void; reject: (error: unknown) => void }
    | { type: 'getAll'; payload: IGetDocumentInput; resolve: (value: { items: IDocument[]; totalCount: number }) => void; reject: (error: unknown) => void }
    | { type: 'upload'; payload: { file: File; projectDutyId?: string }; resolve: (value: IDocument) => void; reject: (error: unknown) => void };

  const [pendingOperation, setPendingOperation] = useState<PendingOperation | null>(null);

  useEffect(() => {
    const createDocument = async (document: ICreateDocumentDto) => {
      try {
        dispatch(setPending(true));
        const response = await api.post("/api/services/app/Document/Create", document);
        const result = response.data.result;
        dispatch(setDocument(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to create document"));
        throw error;
      } finally {
        dispatch(setPending(false));
      }
    };

    const updateDocument = async (id: string, document: IUpdateDocumentDto) => {
      try {
        dispatch(setPending(true));
        const response = await api.put(`/api/services/app/Document/Update?id=${id}`, document);
        const result = response.data.result;
        dispatch(setDocument(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to update document"));
        throw error;
      } finally {
        dispatch(setPending(false));
      }
    };

    const deleteDocument = async (id: string) => {
      try {
        dispatch(setPending(true));
        await api.delete(`/api/services/app/Document/Delete?id=${id}`);
        dispatch(setDocument(null));
        dispatch(setSuccess(true));
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to delete document"));
        throw error;
      } finally {
        dispatch(setPending(false));
      }
    };

    const getDocument = async (id: string) => {
      try {
        dispatch(setPending(true));
        const response = await api.get(`/api/services/app/Document/Get?id=${id}`);
        const result = response.data.result;
        dispatch(setDocument(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to fetch document"));
        throw error;
      } finally {
        dispatch(setPending(false));
      }
    };

    const getDocuments = async (input: IGetDocumentInput) => {
      try {
        dispatch(setPending(true));
        const response = await api.get("/api/services/app/Document/GetAll", {
          params: input,
        });
        const result = response.data.result;
        dispatch(setDocuments(result.items));
        dispatch(setTotalCount(result.totalCount));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to fetch documents"));
        throw error;
      } finally {
        dispatch(setPending(false));
      }
    };

    const uploadDocument = async (file: File, projectDutyId?: string) => {
      try {
        dispatch(setPending(true));
        console.log('Starting upload for file:', {
          name: file.name,
          size: file.size,
          type: file.type
        });

        if (file.size > 10 * 1024 * 1024) {
          throw new Error('File size exceeds 10MB limit');
        }

        const formData = new FormData();
        formData.append("file", file);
        if (projectDutyId) {
          formData.append("projectDutyId", projectDutyId);
        }

        console.log('FormData contents:');
        for (const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        console.log('Sending upload request to:', '/api/services/app/Document/Create');
        const response = await api.post("/api/services/app/Document/Create", formData, {
          timeout: 60000,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              console.log('Upload progress:', percentCompleted);
            }
          }
        });

        console.log('Upload response:', response.data);
        const result = response.data.result;
        
        if (!result) {
          throw new Error('No document data received from server');
        }

        dispatch(setDocument(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        console.error('Upload error details:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          axiosError: error instanceof AxiosError ? {
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
          } : null
        });

        const errorMessage = error instanceof Error 
          ? error.message 
          : error instanceof AxiosError && error.response?.data?.error?.message
          ? error.response.data.error.message
          : "Failed to upload document";
        
        dispatch(setError(errorMessage));
        throw new Error(errorMessage);
      } finally {
        dispatch(setPending(false));
      }
    };

    if (!pendingOperation) return;

    const handleOperation = async () => {
      try {
        switch (pendingOperation.type) {
          case 'create':
            const createResult = await createDocument(pendingOperation.payload);
            pendingOperation.resolve(createResult);
            break;
          case 'update':
            const updateResult = await updateDocument(pendingOperation.payload.id, pendingOperation.payload.document);
            pendingOperation.resolve(updateResult);
            break;
          case 'delete':
            await deleteDocument(pendingOperation.payload);
            pendingOperation.resolve();
            break;
          case 'get':
            const getResult = await getDocument(pendingOperation.payload);
            pendingOperation.resolve(getResult);
            break;
          case 'getAll':
            const getAllResult = await getDocuments(pendingOperation.payload);
            pendingOperation.resolve(getAllResult);
            break;
          case 'upload':
            const uploadResult = await uploadDocument(pendingOperation.payload.file, pendingOperation.payload.projectDutyId);
            pendingOperation.resolve(uploadResult);
            break;
        }
      } catch (error) {
        pendingOperation.reject(error);
      } finally {
        setPendingOperation(null);
      }
    };

    handleOperation();
  }, [pendingOperation, api]);

  const actions: IDocumentActionContext = {
    createDocument: (document) => {
      return new Promise<IDocument>((resolve, reject) => {
        setPendingOperation({ type: 'create', payload: document, resolve, reject });
      });
    },
    updateDocument: (id, document) => {
      return new Promise<IDocument>((resolve, reject) => {
        setPendingOperation({ type: 'update', payload: { id, document }, resolve, reject });
      });
    },
    deleteDocument: (id) => {
      return new Promise<void>((resolve, reject) => {
        setPendingOperation({ type: 'delete', payload: id, resolve, reject });
      });
    },
    getDocument: (id) => {
      return new Promise<IDocument>((resolve, reject) => {
        setPendingOperation({ type: 'get', payload: id, resolve, reject });
      });
    },
    getDocuments: (input) => {
      return new Promise<{ items: IDocument[]; totalCount: number }>((resolve, reject) => {
        setPendingOperation({ type: 'getAll', payload: input, resolve, reject });
      });
    },
    uploadDocument: (file, projectDutyId) => {
      return new Promise<IDocument>((resolve, reject) => {
        setPendingOperation({ type: 'upload', payload: { file, projectDutyId }, resolve, reject });
      });
    }
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
