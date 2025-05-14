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
        api.get("/api/services/app/Document/GetAll", {
          params: input,
        })
          .then(response => {
            const result = response.data.result;
            dispatch(setDocuments(result.items));
            dispatch(setTotalCount(result.totalCount));
            dispatch(setSuccess(true));
            resolve(result);
          })
          .catch(error => {
            const axiosError = error as AxiosError;
            dispatch(setError(axiosError.message || "Failed to fetch documents"));
            reject(error);
          });
      });
    },
    [api]
  );

  const uploadDocument = useCallback(
    (file: File, projectDutyId?: string): Promise<IDocument> => {
      return new Promise((resolve, reject) => {
        dispatch(setPending(true));
        const formData = new FormData();
        formData.append("file", file);
        if (projectDutyId) {
          formData.append("projectDutyId", projectDutyId);
        }

        api.post("/api/services/app/Document/Upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then(response => {
            const result = response.data.result;
            dispatch(setDocument(result));
            dispatch(setSuccess(true));
            resolve(result);
          })
          .catch(error => {
            const axiosError = error as AxiosError;
            dispatch(setError(axiosError.message || "Failed to upload document"));
            reject(error);
          });
      });
    },
    [api]
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