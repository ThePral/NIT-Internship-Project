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
  let serverUser: User | undefined;
  let error;
  let isLoading;
  if (role == "user") {
    let { data: serverUser, error, isLoading } = useUserCheckToken();
  } else if (role == "admin") {
    let { data: serverUser, error, isLoading } = useAdminCheckToken();
  } else if (role == "superAdmin") {
    let { data: serverUser, error, isLoading } = useSuperAdminCheckToken();
  }
  const router = useRouter();

  useEffect(() => {
    setLoading(isLoading);
    if (error) {
      setUser(undefined);
      if (role == "user") {
        router.push("/user/auth");
      } else if (role == "admin") {
        router.push("/admin/auth");
      } else if (role == "superAdmin") {
        router.push("/admin/auth");
      }
    } else if (serverUser?.id && !_.isEqual(serverUser, user)) {
      if (serverUser.role != role) {
        setUser(undefined);
        if (role == "user") {
          router.push("/user/auth");
        } else if (role == "admin") {
          router.push("/admin/auth");
        } else if (role == "superAdmin") {
          router.push("/admin/auth");
        }
      }
      setUser(serverUser);
    }

    console.log("user", serverUser);
  }, [serverUser, isLoading]);

  return (
    <userContext.Provider
      value={{ user: user, setUser: setUser, isLoading: loading }}
    >
      {/* <UserNav/>      */}
      <div className="flex flex-col">
        {isLoading ? (
          <div className="w-full h-screen flex justify-center items-center">
            {" "}
            <Spinner className="size-14" />{" "}
          </div>
        ) : (
          <>
            {children}
            <MainFooter />
          </>
        )}
        <Toaster />
      </div>
    </userContext.Provider>
  );
};

export default InnerLayout;
