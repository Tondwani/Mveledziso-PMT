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
    async (document: ICreateDocumentDto): Promise<IDocument> => {
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
      }
    },
    [api]
  );

  const updateDocument = useCallback(
    async (id: string, document: IUpdateDocumentDto): Promise<IDocument> => {
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
      }
    },
    [api]
  );

  const deleteDocument = useCallback(
    async (id: string): Promise<void> => {
      try {
        dispatch(setPending(true));
        await api.delete(`/api/services/app/Document/Delete?id=${id}`);
        dispatch(setDocument(null));
        dispatch(setSuccess(true));
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to delete document"));
        throw error;
      }
    },
    [api]
  );

  const getDocument = useCallback(
    async (id: string): Promise<IDocument> => {
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
      }
    },
    [api]
  );

  const getDocuments = useCallback(
    async (input: IGetDocumentInput): Promise<{ items: IDocument[]; totalCount: number }> => {
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
      }
    },
    [api]
  );

  const uploadDocument = useCallback(
    async (file: File, projectDutyId?: string): Promise<IDocument> => {
      try {
        dispatch(setPending(true));
        const formData = new FormData();
        formData.append("file", file);
        if (projectDutyId) {
          formData.append("projectDutyId", projectDutyId);
        }

        const response = await api.post("/api/services/app/Document/Upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const result = response.data.result;
        dispatch(setDocument(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to upload document"));
        throw error;
      }
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