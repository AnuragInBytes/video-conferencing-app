import React from 'react'
import LobbyHeader from './LobbyHeader'
import SideBar from './SideBar'
import Hero from './Hero'

function Lobby() {
  return (
    <div className='bg-white w-full h-screen'>
      <LobbyHeader />
      <div className="lower bg-green-200 flex w-full h-[88vh]">
        <SideBar />
        <Hero />
      </div>
    </div>
  )
}

export default Lobby