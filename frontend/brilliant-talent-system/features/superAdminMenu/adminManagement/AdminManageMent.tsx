"use client";

import { useState, useEffect } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GenericDataTable } from "./adminsTable/GenericDataTable";
import { adminsColumns } from "./adminsTable/columns";

export default function AdminManagement() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        setData([
          { id: 1, first_name: "علی", last_name: "محمدی" },
          { id: 2, first_name: "سارا", last_name: "رضایی" },
          { id: 3, first_name: "مهدی", last_name: "کریمی" },
        ]);
        setError(false);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-6">
      <Card className="w-full shadow-md border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            لیست ادمین‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GenericDataTable
            data={data}
            columns={adminsColumns}
            title=""
            isLoading={loading}
            isError={error}
            searchPlaceholder="جستجوی ادمین..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
