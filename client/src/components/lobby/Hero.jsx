import React from 'react'
import LobbyPoster from './LobbyPoster'
import LobyCard from './LobyCard'

function Hero() {
  return (
    <div className='bg-red-500 w-full flex justify-center items-start py-5'>
      <div className='w-full'>
        <LobbyPoster />
      </div>

    </div>
  )
}

export default Hero