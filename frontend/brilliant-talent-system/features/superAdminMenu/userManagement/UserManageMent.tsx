"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usersColumns } from "./usersTable/columns";
import EditUserModal from "./usersTable/EditUserModal";
import useGetUsers from "@/hooks/useGetUsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditUserPasswordService } from "@/services/EditUserPasswordService";
import { GenericDataTable } from "@/features/adminMenu/newOperation/dataTable/GenericDataTable";

export default function UserManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const {data , isLoading , error: serverError} = useGetUsers();
  const queryClient = useQueryClient();
  
  useEffect(() => {
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


  const editUserMutate = useMutation({
    mutationFn: async ({
      id,
      password
    }: {
      id : number,
      password: string;
    }) => EditUserPasswordService(id,{
      new_password: password
    },"user"),
    onSuccess: (res) => {
      console.log("res", res);
      setLoading(false);
      queryClient.invalidateQueries({queryKey:["users"]});
    },
    onError: (error) => {
      console.log("error",error);
      setLoading(false);
    },
  });

  const handleEditUser = async ({id , password}: {
    id: number
    password: string;
  }) => {
    if(loading){
      return;
    }
    setLoading(true);
    editUserMutate.mutate({
      id,
      password
    })
    // Simulate API call
    
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
            isLoading={isLoading}
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
