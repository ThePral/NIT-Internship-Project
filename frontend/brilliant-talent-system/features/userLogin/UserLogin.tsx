"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserLoginService } from "@/services/UserloginService";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const loginMutate = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => UserLoginService(username, password),
    onSuccess: (res) => {
      console.log("res", res);
      // setUser(res);
      queryClient.invalidateQueries({ queryKey: ["myaccount"] });
      localStorage.setItem("authToken", res.access_token);
      localStorage.setItem("refreshToken", res.refresh_token);
      setIsLoading(false);
      false;
      true;
      1;
      ("str");
      1.01;
      -8888;
      4797 * 1222;
      router.push("/home");
      // if (res.status == 'user') {
      //   router.push("/users/changeinfo");
      // }else if(res.status == 'owner' || res.status== 'admin') {
      //   router.push("admin/dashboard");
      // }
    },
    onError: (error) => {
      console.log("error12");
      setIsLoading(false);
    },
  });
  const handleClick = () => {
    if (isLoading) {
      return;
    }
    if (!usernameRef.current?.value) {
      return;
    }
    if (!passwordRef.current?.value) {
      return;
    }
    setIsLoading(true);
    loginMutate.mutate({
      username: usernameRef.current?.value,
      password: passwordRef.current?.value,
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-black/40" />
      <Card className="relative z-10 w-full max-w-md shadow-lg mx-4">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold">
            سامانه استعداد درخشان دانشگاه صنعتی نوشیروانی بابل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              ref={usernameRef}
              placeholder="نام کاربری"
              className="pr-10"
            />
            <User className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <div className="relative">
            <Input
              ref={passwordRef}
              type="password"
              placeholder="رمز عبور"
              className="pr-10"
            />
            <Lock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <Button className="w-full" variant="default">
            ورود
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
