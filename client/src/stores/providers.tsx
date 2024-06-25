import { FC, ReactNode } from "react";
import SessionProvider from "./session.context";

const providers: ReadonlyArray<FC<{ children: ReactNode }>> = [SessionProvider];
export default function Providers({ children }: { children: React.ReactNode }) {
  return providers.reduce(
    (acc, ChildProvider) => <ChildProvider>{acc}</ChildProvider>,
    children
  );
}
