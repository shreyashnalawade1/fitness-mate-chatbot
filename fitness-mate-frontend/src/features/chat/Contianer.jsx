import React, { useEffect, useRef, useState } from "react"
import MessageBot from "./MessageBot";
import MessageUser from "./MessageUser";
import WeatherCard from "../action/weather";
import YouTubeWidget from "../action/youtube";
import ConfirmForm from "../action/comfirmData";
import LineGraph from "../action/lineGraph";
import TableComponent from "../action/table";
// remove this FIXME: 
const xValues = ['January', 'February', 'March', 'April', 'May'];
const yValues = [65, 59, 80, 81, 56];
const xAxisLabel = 'Months';
const yAxisLabel = 'Values';

const data = [
  ['Header 1', 'Header 2', 'Header 3'],
  ['Row 1 Cell 1', 'Row 1 Cell 2', 'Row 1 Cell 3'],
  ['Row 2 Cell 1', 'Row 2 Cell 2', 'Row 2 Cell 3'],
  ['Row 3 Cell 1', 'Row 3 Cell 2', 'Row 3 Cell 3'],
];
const Container = ({messages}) => {
    const endOfMessagesRef = useRef(null);
    useEffect(()=>{
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    },[messages])
  return (
    <div className="flex-grow no-scrollbar overflow-y-auto py-3 flex flex-col">
        {messages.map(ele=>{
            return <>
            { ele.user==='user' ? <MessageUser msg={ele.msg} key={ele.id} id={ele.id} latestMsgId={messages[messages.length-1]?.id}/>:<MessageBot msg={ele.Message} key={ele.id} id={ele.id} latestMsgId={messages[messages.length-1]?.id} data={ele}/>}
            </>
        })}

<div ref={endOfMessagesRef} />
    </div>
  )
};
export default Container;
