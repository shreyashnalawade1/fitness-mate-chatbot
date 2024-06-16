import React, { useEffect, useState } from "react"
import Container from "../features/chat/Contianer";
import ChatInput from "../features/chat/Input";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
let socket;

const Chat = (props) => {
  const [messages,setMessages]=useState([]);
  const navigate=useNavigate();
  const setNewMsg=(val)=>{
    const newMsg={
      msg:val,
      user:"user",
      id:"new-user",
      to:2,
      frm:1,
    };
    socket.emit('new_msg_user',newMsg)
    setMessages(state=>[...state,newMsg]);
  }

  useEffect(()=>{

    const token=localStorage.getItem('token');
    if(!token){
      navigate('/login');
    }
    navigator.geolocation.getCurrentPosition(async function(position) {
      console.log('Latitude:', position.coords.latitude);
      console.log('Longitude:', position.coords.longitude);
    
    async function postLocationData() {

      const url = 'https://fitness-mate-backend.onrender.com/health/location';
      const data = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toUTCString()
      };
  
      const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // If you are using JWT or similar
          },
          body: JSON.stringify(data)
      };
  
      try {
          const response = await fetch(url, options);
          const result = await response.json();
          console.log('Response:', result);
      } catch (error) {
          console.error('Error:', error);
      }
  }
  await postLocationData();
}, function(error) {
  console.error('Error occurred. Error code:', error.code);
});

  socket=io('https://compatible-carie-fitness-mate-bf091987.koyeb.app?token='+token);
  socket.on('connect',()=>{
  console.log('Socket Connected!');
})
socket.emit('join_room',1);
    socket.on('new_msg',(data)=>{
    setMessages(state=>[...state,data]);
    })
  },[])

  return (
    <>
    <div className="h-[calc(100dvh)] m-auto bg-main w-screen font-mono text-txt text-2xl p-3 flex flex-col lg:w-11/12" >
        <h1 className="text-center">Mate</h1>
        <Container messages={messages} />
        <ChatInput setNewMsg={setNewMsg}/>
    </div>
    </>
  )
};

export default Chat;
