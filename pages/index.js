import { useState, useEffect } from 'react';
import Plyr from "plyr-react";

export default function Home() {

  return (
    <div
      style={{ padding: '24px' }}
    >
      <h1 className='jumbotron text-center'>
        Hello, this is homepsge of eLearning
      </h1>
      <div
        style={{ width: '480px' }}
      >
        <Plyr
        source={{
          type: 'video',
          sources: [
            {
              src: 'https://nextgoal-bucket.s3.us-east-2.amazonaws.com/9k4QH6Eh_xLn_Ywt8dZii.mp4',
              provider: 'html5'
            }
          ]
        }}
      />
      </div>
      
    </div>
  )
}
