import React, { useEffect, useRef } from 'react'

function VideoPlayer({ stream, isMutes = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if(videoRef.current && stream){
      videoRef.current.srcObject = stream;
    }
  }, [stream]);


  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={isMutes}
      style={{width: '500px', height:'300px', margin: '10px', border: '2px solid black', display: 'block', backgroundColor: 'black'}}
    />
  );
};

export default VideoPlayer