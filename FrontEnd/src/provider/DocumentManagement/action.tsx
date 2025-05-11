import { IDocument } from "./context";

// Action Types
export enum DocumentActionEnum {
  SET_PENDING = "SET_PENDING",
  SET_ERROR = "SET_ERROR",
  SET_SUCCESS = "SET_SUCCESS",
  SET_DOCUMENT = "SET_DOCUMENT",
  SET_DOCUMENTS = "SET_DOCUMENTS",
  SET_TOTAL_COUNT = "SET_TOTAL_COUNT",
  RESET_STATE = "RESET_STATE"
}

// Action Interfaces
export interface ISetPendingAction {
  type: typeof DocumentActionEnum.SET_PENDING;
  payload: {
    isPending: boolean;
    isSuccess: boolean;
  };
}

export interface ISetErrorAction {
  type: typeof DocumentActionEnum.SET_ERROR;
  payload: {
    isError: boolean;
    errorMessage: string;
    isPending: boolean;
    isSuccess: boolean;
  };
}

export interface ISetSuccessAction {
  type: typeof DocumentActionEnum.SET_SUCCESS;
  payload: {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    errorMessage?: string;
  };
}

export interface ISetDocumentAction {
  type: typeof DocumentActionEnum.SET_DOCUMENT;
  payload: {
    document: IDocument | null;
  };
}

export interface ISetDocumentsAction {
  type: typeof DocumentActionEnum.SET_DOCUMENTS;
  payload: {
    documents: IDocument[];
  };
}

export interface ISetTotalCountAction {
  type: typeof DocumentActionEnum.SET_TOTAL_COUNT;
  payload: {
    totalCount: number;
  };
}

// Union Action Types
export type DocumentActionTypes =
  | ISetPendingAction
  | ISetErrorAction
  | ISetSuccessAction
  | ISetDocumentAction
  | ISetDocumentsAction
  | ISetTotalCountAction;

// Action Creators
export const setPending = (isPending: boolean) => ({
  type: DocumentActionEnum.SET_PENDING,
  payload: {
    isPending,
    isSuccess: false
  }
});

export const setError = (errorMessage: string) => ({
  type: DocumentActionEnum.SET_ERROR,
  payload: {
    isError: true,
    errorMessage,
    isPending: false,
    isSuccess: false
  }
});

export const setSuccess = (isSuccess: boolean) => ({
  type: DocumentActionEnum.SET_SUCCESS,
  payload: {
    isSuccess,
    isPending: false,
    isError: false,
    errorMessage: undefined
  }
});

export const setDocument = (document: IDocument | null) => ({
  type: DocumentActionEnum.SET_DOCUMENT,
  payload: {
    document
  }
});

export const setDocuments = (documents: IDocument[]) => ({
  type: DocumentActionEnum.SET_DOCUMENTS,
  payload: {
    documents
  }
});

export const setTotalCount = (totalCount: number) => ({
  type: DocumentActionEnum.SET_TOTAL_COUNT,
  payload: {
    totalCount
  }
});

export const resetState = () => ({
  type: DocumentActionEnum.RESET_STATE
});
