import { handleActions } from "redux-actions";
import { INITIAL_STATE, ICommentStateContext, IComment } from "./context";
import { CommentActionEnum } from "./action";

interface ICommentAction {
  type: CommentActionEnum;
  payload?: {
    isPending?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    errorMessage?: string;
    successMessage?: string;
    comment?: IComment | null;
    comments?: IComment[];
    totalCount?: number;
  };
}

export const CommentReducer = handleActions<ICommentStateContext, ICommentAction['payload']>(
  {
    [CommentActionEnum.SET_PENDING]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [CommentActionEnum.SET_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [CommentActionEnum.SET_ERROR]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [CommentActionEnum.SET_COMMENT]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [CommentActionEnum.SET_COMMENTS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [CommentActionEnum.RESET_STATE]: () => ({
      ...INITIAL_STATE
    })
  },
  INITIAL_STATE
);