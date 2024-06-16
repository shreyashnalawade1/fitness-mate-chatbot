import React from 'react';
const options = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
};

function getWeekday(date) {
  const day = date.getDay(); // Get the day of the week (0-6)
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return weekdays[day];
}
function getSVG(data){
  if(data.rain>0){
    data['state']='Rainy'
    return <svg className="w-32 h-32"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"  d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317m3 0a.5.5 0 0 1 .316.633l-1 3a.5.5 0 0 1-.948-.316l1-3a.5.5 0 0 1 .632-.317m3 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317m3 0a.5.5 0 0 1 .316.633l-1 3a.5.5 0 1 1-.948-.316l1-3a.5.5 0 0 1 .632-.317m.247-6.998a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973M8.5 2a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4 4 0 0 1 8.5 2"/>
  </svg>
  }else if(data.precipitation>0){
    data['state']='Cloudy'
      return <svg className="w-32 h-32"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round"
              strokeLinejoin="round" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383"/>
    </svg>
  }else{
    data['state']='Clear'
    return <svg className="w-32 h-32"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
<path strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
</svg> 
  }
}
const WeatherCard = ({
  location="India",
  weather={temperature_2m:39,precipitation_probability:0,rain:0, showers:0}
}) => {
const date=new Date();
const day = getWeekday(date);


return (
  <div className='w-5/6'>
    <div className="min-h-[50vh] flex items-center justify-center border-2 border-white lg:border-0 lg:justify-start lg:min-h-[25vh]">
      <div className="flex flex-col bg-main rounded p-4 w-full max-w-xs">
        <div className="font-bold text-xl">{location}</div>
        <div className="text-sm text-gray-500">{day+" "+new Intl.DateTimeFormat('en-US', ).format(date)}</div>
        <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-rare h-24 w-24">
        {getSVG(weather)}
        </div>
        <div className="flex flex-row items-center justify-center mt-6">
          <div className="font-medium text-6xl">{weather?.temperature_2m}°</div>
          <div className="flex flex-col items-center ml-6">
            <div>{weather?.state}</div>
           
          </div>
        </div>
        <div className="flex flex-row justify-between mt-6">
          <div className="flex flex-col items-center">
            <div className="font-medium text-sm">precipitation </div>
            <div className="text-sm text-gray-500">{weather?.precipitation} mm(inch)</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-medium text-sm">Rain</div>
            <div className="text-sm text-gray-500">{weather?.rain} mm(inch)</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-medium text-sm">Showers</div>
            <div className="text-sm text-gray-500">{weather?.showers} mm(inch)</div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default WeatherCard;
