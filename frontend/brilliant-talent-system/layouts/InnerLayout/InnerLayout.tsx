"use client";
import { MainFooter } from "@/components/footer/mainFooter";
import userContext from "@/contexts/userContext";
import _ from "lodash";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Spinner } from "../../components/ui/spinner";
import { User } from "@/interfaces/user";
import { useUserCheckToken } from "@/hooks";
import { useAdminCheckToken } from "@/hooks/useAdminCheckToken";
import { useSuperAdminCheckToken } from "@/hooks/useSuperAdminCheckToken";

const InnerLayout = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "user" | "admin" | "superAdmin";
}) => {
  let [user, setUser] = useState<User>();
  let [loading, setLoading] = useState<any>(true);
  let [shouldRedirect, setShouldRedirect] = useState(false);
  let serverUser: any | undefined;
  let error: any;
  let isLoading: boolean = false;
  
  if (role === "user") {
    const userHookResult = useUserCheckToken();
    serverUser = userHookResult.data;
    error = userHookResult.error;
    isLoading = userHookResult.isLoading;
  } else if (role === "admin") {
    const adminHookResult = useAdminCheckToken();
    serverUser = adminHookResult.data;
    error = adminHookResult.error;
    isLoading = adminHookResult.isLoading;
  } else if (role === "superAdmin") {
    const superAdminHookResult = useSuperAdminCheckToken();
    serverUser = superAdminHookResult.data;
    error = superAdminHookResult.error;
    isLoading = superAdminHookResult.isLoading;
  }
  
  const router = useRouter();

  useEffect(() => {
    setLoading(isLoading);
    
    if (!isLoading) {
      if (!serverUser || error) {
        setShouldRedirect(true);
      } else if (serverUser?.id && !_.isEqual(serverUser, user)) {
        if (serverUser.role != role) {
          setShouldRedirect(true);
        } else {
          setUser(serverUser);
        }
      }
    }
  }, [serverUser, isLoading, error]);

  useEffect(() => {
    if (shouldRedirect) {
      if (role == "user") {
        router.push("/user/auth");
      } else if (role == "admin") {
        router.push("/admin/auth");
      } else if (role == "superAdmin") {
        router.push("/superAdmin/auth");
      }
    }
  }, [shouldRedirect, role, router]);

  if (shouldRedirect) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner className="size-14" />
      </div>
    );
  }

  return (
    <userContext.Provider
      value={{ user: user, setUser: setUser, isLoading: loading }}
    >
      <div className="flex flex-col">
        {isLoading ? (
          <div className="w-full h-screen flex justify-center items-center">
            <Spinner className="size-14" />
          </div>
        ) : (
          <>
            {children}
            <MainFooter />
          </>
        )}
      </div>
    </userContext.Provider>
  );
};

export default InnerLayout;