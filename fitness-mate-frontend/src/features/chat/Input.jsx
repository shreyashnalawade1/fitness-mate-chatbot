import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import sendIcon from '../../assets/icons8-send-50.png'
const ChatInput = ({setNewMsg}) => {
const [newUserMsg,setnewUserMsg]=useState(null);
const setNewUserMsgHandler=(e)=>{
  setnewUserMsg(e.target.value);
}
const handleClick=()=>{
  setNewMsg(newUserMsg)
}
  return (
    <div className="flex items-center bg-main-faint px-2 rounded-xl">
      <Input placeholder="Chat with fitness-mate"  className='bg-main-faint outline-none border-none text-txtfocus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0' onChange={setNewUserMsgHandler}/>
    <button  className=" bg-main-faint h-full" onClick={handleClick}>
    <img src={sendIcon} className="h-2/3" />
    </button>
    </div>
  )
};

export default ChatInput;
