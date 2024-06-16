// src/components/GifEmbed.js
import React from 'react';

const GifEmbed = ({src}) => {

  console.log(src)
  return (
    <div className="relative  w-5/6 ">
      <img
        src={src}
      className='w-5/6'
></img>
    </div>
  );
};

export default GifEmbed;
