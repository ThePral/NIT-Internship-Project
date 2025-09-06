"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GenericDataTable } from "./adminsTable/GenericDataTable";
import { adminsColumns } from "./adminsTable/columns";
import AddAdminModal from "./adminsTable/AddAdminModal";
import EditAdminModal from "./adminsTable/EditAdminModal";

export default function AdminManagement() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  useEffect(() => {
    const handleEditAdmin = (event: CustomEvent) => {
      setSelectedAdmin(event.detail);
      setIsEditModalOpen(true);
    };

    window.addEventListener(
      "open-edit-dialog",
      handleEditAdmin as EventListener
    );

    return () => {
      window.removeEventListener(
        "open-edit-dialog",
        handleEditAdmin as EventListener
      );
    };
  }, []);

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

  const handleAddAdmin = async (adminData: {
    first_name: string;
    last_name: string;
  }) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAdmin = {
          id: Math.max(...data.map((admin) => admin.id), 0) + 1,
          ...adminData,
        };
        setData((prev) => [...prev, newAdmin]);
        resolve(true);
      }, 500);
    });
  };

  const handleEditAdmin = async (adminData: {
    id: number;
    first_name: string;
    last_name: string;
  }) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setData((prev) =>
          prev.map((admin) =>
            admin.id === adminData.id
              ? {
                  ...admin,
                  first_name: adminData.first_name,
                  last_name: adminData.last_name,
                }
              : admin
          )
        );
        resolve(true);
      }, 500);
    });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAdmin(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-4">
      <Card className="w-full shadow-primary border border-border">
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
            onAdd={() => setIsAddModalOpen(true)}
            addButtonLabel="افزودن ادمین"
            searchPlaceholder="جستجوی ادمین..."
          />
        </CardContent>
      </Card>

      <AddAdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAdmin={handleAddAdmin}
      />

      <EditAdminModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onEditAdmin={handleEditAdmin}
        admin={selectedAdmin}
      />
    </div>
  );
}
