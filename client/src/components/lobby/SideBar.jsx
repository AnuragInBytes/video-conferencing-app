import React from 'react'

function SideBar() {
  return (
    <section className='hidden md:block md:w-1/4 lg:w-1/6 h-full'>
      <ul className='bg-white h-full flex flex-col justify-start px-3 py-5 items-center'>
        <li className='bg-blue-500 w-full px-5 py-5 mb-3 rounded-lg text-white font-semibold '>Lobby</li>
        <li className='bg-blue-500 w-full px-5 py-5 mb-3 rounded-lg text-white font-semibold '>Upcomming</li>
        <li className='bg-blue-500 w-full px-5 py-5 mb-3 rounded-lg text-white font-semibold '>Previous</li>
        <li className='bg-blue-500 w-full px-5 py-5 mb-3 rounded-lg text-white font-semibold '>Recordings</li>
        <li className='bg-blue-500 w-full px-5 py-5 mb-3 rounded-lg text-white font-semibold '>Personal Room</li>
      </ul>
    </section>
  )
}

export default SideBar