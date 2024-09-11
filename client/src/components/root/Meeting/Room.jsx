import React from 'react'
import { useParams } from 'react-router-dom'

function Room() {
  const { roomId } = useParams();
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        Room : {roomId}
      </h1>
    </section>
  )
}

export default Room