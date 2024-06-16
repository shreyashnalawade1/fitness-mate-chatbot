import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TypeAnimation } from 'react-type-animation';
import boticon from '../../assets/botIcon.png'
import GifEmbed from "../action/gif";
import YouTubeWidget from "../action/youtube";
import LineGraph from "../action/lineGraph";
import { isArray } from "chart.js/helpers";
import ConfirmForm from "../action/comfirmData";
import WeatherCard from "../action/weather";
const MessageBot = ({msg,id,latestMsgId,data
}) => {
  console.log(data);
  return (  
      <>
        <div className="w-5/6 text-xs mb-3 flex gap-2 break-words">
<Avatar className='w-10 h-8 animate-spin-slow'>
  <AvatarImage src={boticon}/>
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
    <p className="break-all">
    {latestMsgId===id ?<TypeAnimation 
    sequence={[
      msg,
    ]}
    wrapper="span"
    speed={50}
    repeat={0}
    />: msg}
    </p>
    </div>

    {data.Action==='GIF'?<GifEmbed src={data.url[0]}/>:""}
    
    
    {data.Action==='YOUTUBE'?<YouTubeWidget videoIds={data.url}/>:""}
    
    {data.Action==='QUERY-SQL' && isArray(data?.data?.xValues) &&isArray(data?.data?.yValues)?<LineGraph xValues={data?.data?.xValues} yValues={data?.data?.yValues} xAxisLabel={"x-axis"} yAxisLabel={'y-axis'} />:" "}
    {data.Action==='RECORD-DATA'&& data.data.columns?<ConfirmForm data={data.data.columns} table={data.data.table_name}/>: ""}
    {data.Action==='WEATHER' && <WeatherCard weather={data.data} location={data.data.Location}/>}
    </>
  )
}

export default MessageBot;
