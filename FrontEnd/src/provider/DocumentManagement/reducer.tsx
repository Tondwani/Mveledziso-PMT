import { handleActions } from "redux-actions";
import { INITIAL_STATE, IDocumentStateContext, IDocument } from "./context";
import { DocumentActionEnum } from "./action";

interface IDocumentAction {
  type: DocumentActionEnum;
  payload?: {
    isPending?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    errorMessage?: string;
    document?: IDocument | null;
    documents?: IDocument[];
    totalCount?: number;
  };
}

export const DocumentReducer = handleActions<IDocumentStateContext, IDocumentAction['payload']>(
  {
    [DocumentActionEnum.SET_PENDING]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [DocumentActionEnum.SET_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [DocumentActionEnum.SET_ERROR]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [DocumentActionEnum.SET_DOCUMENT]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [DocumentActionEnum.SET_DOCUMENTS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [DocumentActionEnum.SET_TOTAL_COUNT]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [DocumentActionEnum.RESET_STATE]: () => ({
      ...INITIAL_STATE
    })
  },
  INITIAL_STATE
);
