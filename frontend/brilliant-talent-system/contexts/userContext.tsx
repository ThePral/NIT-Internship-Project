"use client";

import { User } from "@/interfaces/user";
import { createContext } from "react";

interface userContextType {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  isLoading: boolean;
}

let userContext = createContext<userContextType | undefined>(undefined);

export default userContext;
