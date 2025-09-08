import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, User, User2 } from "lucide-react";
import { useUser } from "@/hooks";
import AccountManagementModal from "../AccountManagementModal/AccountManagementModal";

const UserDropDown = () => {
  const { user } = useUser();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <>
      <div className="w-full">
        <div className=" focus:border-none rounded-full flex justify-between items-center gap-2 w-full">
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10 border border-dashed border-border">
                <AvatarImage src="" alt={user?.username ?? String(user?.id)} />
                <AvatarFallback>
                <User2 />
                </AvatarFallback>
            </Avatar>
            <div className="flex justify-center w-full">
                <div className="text-right ">
                <p className="text-sm font-medium text-foreground truncate max-w-24">
                    {user?.firstname ? `${user?.firstname} ${user?.lastname}` : `${user?.username}`} 
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {user?.role}
                </p>
                </div>
            </div>
          </div>
          <AccountManagementModal
              role={user?.role ?? 'user'}
              isOpen={isAccountModalOpen}
              onOpen={setIsAccountModalOpen}
          />
        </div>
      </div>

    </>
  );
};

export default UserDropDown;
