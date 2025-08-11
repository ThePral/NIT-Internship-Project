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

const InnerLayout = ({ children }: { children: React.ReactNode }) => {
  let [user, setUser] = useState<User>();
  let [loading, setLoading] = useState<any>(true);
  let { data: serverUser, error, isLoading } = useUserCheckToken();
  const router = useRouter();

  useEffect(() => {
    // setLoading(isLoading);
    if (error) {
      setUser(undefined);
      //   router.push("/authentication");
    } else if (serverUser?.user_id && !_.isEqual(serverUser, user)) {
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
