import {
  Dispatch,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from "react";
import { IUser } from "../types/user";
interface ISessionContext {
  user: IUser | null;
  isLoggedIn: boolean;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}
export const SessionContext = createContext<ISessionContext>({
  user: null,
  isLoggedIn: false,
  setIsLoggedIn: () => undefined,
  setUser: () => undefined,
});

function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const state: ISessionContext = {
    user,
    isLoggedIn,
    setUser,
    setIsLoggedIn,
  };
  return (
    <>
      <SessionContext.Provider value={useMemo(() => state, [state])}>
        {children}
      </SessionContext.Provider>
    </>
  );
}

export default SessionProvider;
