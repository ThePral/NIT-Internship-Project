import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { LogOut, User, User2 } from 'lucide-react'
import { useUser } from '@/hooks'
import AccountManagementModal from '../AccountManagementModal/AccountManagementModal'

const UserDropDown = () => {
    const {user} = useUser()
    const [isAccountModalOpen , setIsAccountModalOpen] = useState(false)
    return (
          <DropdownMenu>
            <DropdownMenuTrigger className=" focus:border-none rounded-full flex items-center gap-2 w-full">
              <Avatar className="w-10 h-10 border border-dashed border-border">
                <AvatarImage src="" alt={user?.username} />
                <AvatarFallback><User2/></AvatarFallback>
              </Avatar>
              <div className="flex justify-center w-full">
                <div className="text-right ">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.username}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rtl bg-popover text-popover-foreground"
            >
              <DropdownMenuItem className="flex items-center justify-end gap-2 text-sm text-primary hover:bg-primary/10 hover:text-primary px-4 py-2">
                    <AccountManagementModal
                        role={"user"}
                        isOpen={isAccountModalOpen}
                        onClose={() => setIsAccountModalOpen(false)}
                        trigger={"ویرایش رمز عبور"}
                    />

                <User className="w-4 h-4" />
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-border" />

              <DropdownMenuItem className="flex items-center justify-end gap-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive px-4 py-2">
                خروج از حساب کاربری
                <LogOut className="w-4 h-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
  )
}

export default UserDropDown