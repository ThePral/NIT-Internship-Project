"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { adminsColumns } from "./adminsTable/columns";
import AddAdminModal from "./adminsTable/AddAdminModal";
import EditAdminModal from "./adminsTable/EditAdminModal";
import useGetAdmins from "@/hooks/useGetAdmins";
import { AddAdminService } from "@/services/AddAdminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditUserPasswordService } from "@/services/EditUserPasswordService";
import { DeleteAdminService } from "@/services/DeleteAdminService";
import { GenericDataTable } from "@/features/adminMenu/newOperation/dataTable/GenericDataTable";

export default function AdminManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const { data, isLoading, error: serverError } = useGetAdmins();
  const queryClient = useQueryClient();
  const deleteAdminMutate = useMutation({
    mutationFn: async ({ id }: { id: number }) => DeleteAdminService(id),
    onSuccess: (res) => {
      console.log("res", res);
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      console.log("error", error);
      setLoading(false);
    },
  });

  useEffect(() => {
    const handleEditAdmin = (event: CustomEvent) => {
      setSelectedAdmin(event.detail);
      setIsEditModalOpen(true);
    };
    const handleDeleteAdmin = (event: CustomEvent) => {
      console.log("delete");
      if (loading) {
        return;
      }
      setLoading(true);
      deleteAdminMutate.mutate(event.detail);
    };
    window.addEventListener(
      "open-edit-dialog",
      handleEditAdmin as EventListener
    );
    window.addEventListener(
      "open-delete-dialog",
      handleDeleteAdmin as EventListener
    );
    return () => {
      window.removeEventListener(
        "open-edit-dialog",
        handleEditAdmin as EventListener
      );
      // window.removeEventListener(
      //   "open-delete-dialog",
      //   handleDeleteAdmin as EventListener
      // );
    };
  }, []);

  const addAdminMutate = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) =>
      AddAdminService({
        username: username,
        password: password,
      }),
    onSuccess: (res) => {
      console.log("res", res);
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      console.log("error", error);
      setLoading(false);
    },
  });
  const editAdminMutate = useMutation({
    mutationFn: async ({
      id,
      password,
      username,
    }: {
      id: number;
      password?: string;
      username: string;
    }) =>
      EditUserPasswordService(
        id,
        {
          new_password: password,
          username: username,
        },
        "admin"
      ),
    onSuccess: (res) => {
      console.log("res", res);
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      console.log("error", error);
      setLoading(false);
    },
  });
  const handleAddAdmin = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    if (loading) {
      return;
    }
    setLoading(true);
    addAdminMutate.mutate({
      username,
      password,
    });
  };

  const handleEditAdmin = async ({
    id,
    password,
    username,
  }: {
    id: number;
    password?: string;
    username: string;
  }) => {
    if (loading) {
      return;
    }
    if (password && password.trim() == "") {
      password = undefined;
    }
    setLoading(true);
    editAdminMutate.mutate({
      id,
      password,
      username,
    });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAdmin(null);
  };

  return (
    <div className="flex flex-col min-h-screen mx-auto bg-background text-foreground py-4">
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
            isLoading={isLoading}
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
