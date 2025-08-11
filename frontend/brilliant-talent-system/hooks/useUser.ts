import userContext from "@/contexts/userContext";
import { useContext } from "react";

export const useUser = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUser must be used within an userProvider");
  }
  return context;
};
