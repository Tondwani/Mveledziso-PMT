import { createContext } from "react";

// Document Interfaces
export interface IDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  projectDutyId?: string;
  creationTime: string;
  creatorUserId?: number;
}

// Input DTOs
export interface ICreateDocumentDto {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  projectDutyId?: string;
}

export interface IUpdateDocumentDto {
  fileName: string;
  fileUrl: string;
  projectDutyId?: string;
}

export interface IGetDocumentInput {
  keyword?: string;
  projectDutyId?: string;
  fromDate?: string;
  toDate?: string;
  skipCount?: number;
  maxResultCount?: number;
}

// State Interface
export interface IDocumentStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  document: IDocument | null;
  documents: IDocument[];
  totalCount: number;
}

// Initial State
export const INITIAL_STATE: IDocumentStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  document: null,
  documents: [],
  totalCount: 0
};

// Actions Interface
export interface IDocumentActionContext {
  createDocument: (document: ICreateDocumentDto) => Promise<IDocument>;
  updateDocument: (id: string, document: IUpdateDocumentDto) => Promise<IDocument>;
  deleteDocument: (id: string) => Promise<void>;
  getDocument: (id: string) => Promise<IDocument>;
  getDocuments: (input: IGetDocumentInput) => Promise<{ items: IDocument[], totalCount: number }>;
  uploadDocument: (file: File, projectDutyId?: string) => Promise<IDocument>;
}

// Create contexts
export const DocumentStateContext = createContext<IDocumentStateContext>(INITIAL_STATE);
export const DocumentActionContext = createContext<IDocumentActionContext>({
  createDocument: () => Promise.resolve({} as IDocument),
  updateDocument: () => Promise.resolve({} as IDocument),
  deleteDocument: () => Promise.resolve(),
  getDocument: () => Promise.resolve({} as IDocument),
  getDocuments: () => Promise.resolve({ items: [], totalCount: 0 }),
  uploadDocument: () => Promise.resolve({} as IDocument)
} as IDocumentActionContext);