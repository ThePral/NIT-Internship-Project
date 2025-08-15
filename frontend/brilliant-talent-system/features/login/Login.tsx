import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock } from "lucide-react";

export default function LoginPage() {
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
            <Input placeholder="نام کاربری" className="pr-10" />
            <User className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <div className="relative">
            <Input type="password" placeholder="رمز عبور" className="pr-10" />
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
