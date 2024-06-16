// YouTubeWidget.js
import React from 'react';
function convertToEmbedUrl(youtubeUrl) {
  const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)|youtu\.be\/([a-zA-Z0-9_-]+)/;
  const match = youtubeUrl.match(regex);

  if (match) {
    const videoId = match[1] || match[2];
    return `https://www.youtube.com/embed/${videoId}`;
  } else {
    return null; // or handle the case where the URL is not valid
  }
}

const YouTubeWidget = ({ videoIds }) => {
return (
  <>
  {videoIds?.map(ele=>{
      return <div className="aspect-w-9 aspect-h-16 pb-4">
    <iframe src={convertToEmbedUrl(ele)}  frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
  </div>  
  })}
  </>
)
};

export default YouTubeWidget;
