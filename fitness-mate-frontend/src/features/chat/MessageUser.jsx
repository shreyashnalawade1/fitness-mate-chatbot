import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const MessageUser = ({msg,id}) => {
  return (
    <div className=" text-xs mb-3 bg-main-faint flex gap-2 self-end justify-end max-w-[calc(65vw)] p-4 rounded-lg" >
        {msg}
  
    </div>
  )
};

export default MessageUser;
