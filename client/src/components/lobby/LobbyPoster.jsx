import React from 'react'

function LobbyPoster() {
  return (
    <section className="bg-[#1a2430] w-full mx-10 h-72 rounded-lg bg-[center] bg-no-repeat bg-[url('../../../public/images/hero-background.png')] text-white">
      <div className='px-10 w-[28rem] h-full flex flex-col justify-center items-start '>
        <div className='bg-white h-10 w-80 py-3 relative px-5 rounded-md font-semibold opacity-25 mb-5'>
            Upcomin meeting at 12:30 PM
        </div>
        <div className=''>
          <h4 className='text-7xl font-[900] py-3'>
            11:15 AM
          </h4>
          <h5 className='font-semibold text-2xl text-blue-50'>
            Tuesday, March 26, 2024
          </h5>
        </div>
      </div>
    </section>
  )
}

export default LobbyPoster