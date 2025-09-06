"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usersColumns } from "./usersTable/columns";
import { GenericDataTable } from "./usersTable/GenericDataTable";
import EditUserModal from "./usersTable/EditUserModal";

export default function UserManagement() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    // Add event listener for edit action
    const handleEditUser = (event: CustomEvent) => {
      setSelectedUser(event.detail);
      setIsEditModalOpen(true);
    };

    window.addEventListener(
      "open-edit-dialog",
      handleEditUser as EventListener
    );

    return () => {
      window.removeEventListener(
        "open-edit-dialog",
        handleEditUser as EventListener
      );
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        setData([
          {
            id: 1,
            first_name: "علی",
            last_name: "محمدی",
            student_id: "98123456",
          },
          {
            id: 2,
            first_name: "سارا",
            last_name: "رضایی",
            student_id: "98123457",
          },
          {
            id: 3,
            first_name: "مهدی",
            last_name: "کریمی",
            student_id: "98123458",
          },
        ]);
        setError(false);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, []);

  const handleEditUser = async (userData: {
    id: number;
    first_name: string;
    last_name: string;
    student_id: string;
  }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setData((prev) =>
          prev.map((user) =>
            user.id === userData.id
              ? {
                  ...user,
                  first_name: userData.first_name,
                  last_name: userData.last_name,
                  student_id: userData.student_id,
                }
              : user
          )
        );
        resolve(true);
      }, 500);
    });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-4">
      <Card className="w-full shadow-primary border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            لیست دانشجویان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GenericDataTable
            data={data}
            columns={usersColumns}
            title=""
            isLoading={loading}
            isError={error}
            searchPlaceholder="جستجوی دانشجو..."
          />
        </CardContent>
      </Card>

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onEditUser={handleEditUser}
        user={selectedUser}
      />
    </div>
  );
}
