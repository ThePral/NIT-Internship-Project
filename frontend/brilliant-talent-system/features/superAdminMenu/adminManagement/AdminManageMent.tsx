"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminManagement() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-border bg-card text-card-foreground">
        <h1 className="text-xl font-bold">مدیریت ادمین</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-success">
          اقدام جدید
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card text-card-foreground border border-border">
          <CardHeader>
            <CardTitle>تعداد کاربران</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,245</p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border border-border">
          <CardHeader>
            <CardTitle>تراکنش‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3,482</p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border border-border">
          <CardHeader>
            <CardTitle>نوتیفیکیشن‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">27</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
