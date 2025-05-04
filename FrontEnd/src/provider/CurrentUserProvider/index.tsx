import React, { useContext, useReducer, useEffect, useCallback } from "react";
import { getAxiosInstance } from "../../utils/axiosInstance";
import {
  INITIAL_STATE,
  SessionStateContext,
  SessionActionContext,
  SessionData,
} from "./context";
import { SessionReducer } from "./reducer";
import {
  getSessionPending,
  getSessionSuccess,
  getSessionError,
  clearSession,
} from "./action";
import { AxiosError } from "axios";

const SESSION_ENDPOINT = "/api/services/app/Session/GetCurrentLoginInformations";
const TOKEN_KEY = "auth_token";

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(SessionReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const checkAdminStatus = useCallback(async (token: string): Promise<boolean> => {
    try {
      const response = await instance.get<{ result: string[] }>(
        "/api/services/app/User/GetPermissions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.result.includes("Pages.Administration");
    } catch {
      return false;
    }
  }, [instance]);

  const handleClearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    dispatch(clearSession());
  }, []);

  const handleGetSession = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      handleClearSession();
      return;
    }

    dispatch(getSessionPending());
    try {
      const response = await instance.get<{ result: SessionData }>(SESSION_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Abp.TenantId": localStorage.getItem("abp_tenant_id") || "",
        },
      });

      const isAdmin = await checkAdminStatus(token);
      const originalData = response.data.result;

      const sessionData: SessionData = {
        ...originalData,
        user: {
          ...(originalData.user ?? {
            id: 0,
            name: "",
            surname: "",
            userName: "",
            emailAddress: "",
          }),
          role: isAdmin ? "Admin" : "User",
        },
      };

      dispatch(getSessionSuccess(sessionData));
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error: { message: string } }>;
      const message = axiosError.response?.data?.error?.message || "Session fetch failed";
      console.error("Session error:", message);
      dispatch(getSessionError(message));
      handleClearSession();
    }
  }, [handleClearSession, instance, checkAdminStatus]);

  useEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) {
      handleGetSession();
    }
  }, [handleGetSession]);

  return (
    <SessionStateContext.Provider value={state}>
      <SessionActionContext.Provider
        value={{
          getCurrentLoginInfo: handleGetSession,
          clearSession: handleClearSession,
        }}
      >
        {children}
      </SessionActionContext.Provider>
    </SessionStateContext.Provider>
  );
};

// Custom hook
export const useSession = () => {
  const state = useContext(SessionStateContext);
  const actions = useContext(SessionActionContext);

  if (!state || !actions) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return { ...state, ...actions };
};