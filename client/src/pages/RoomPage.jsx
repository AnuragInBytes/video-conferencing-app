import { Room } from '@/components'
import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom'

function RoomPage() {

  const { roomId } = useParams();
  const { currentRoom } = useSelector((state) => state.room);

  if (!currentRoom) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className='w-full h-screen bg-[#1c1f2e] px-5 py-3 '>
      <Room roomId={roomId} />
    </div>
  )
}

export default RoomPage