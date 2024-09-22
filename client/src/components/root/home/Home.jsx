import React from 'react'
import MeetinModelList from './MeetinModelList';

function Home() {
  
  const now = new Date();
  const time = now.toLocaleTimeString('en-in', { hour: '2-digit', minute: '2-digit' })
  const date = (new Intl.DateTimeFormat('en-in', {dateStyle: 'full'})).format(now);


  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-[url("/images/hero-background.png")] bg-cover'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          <h2 className='bg-[#ffffff40] backdrop-blur-[4px] max-w-[270px] rounded py-2 text-center text-base font-semibold'>
            Upcoming meeting at: 12:30 PM
          </h2>
          <div className='flex flex-col gap-2 '>
            <h1 className='text-4xl font-extrabold lg:text-7xl'>
              {time}
            </h1>
            <p className='text-lg font-bold text-[#c9ddff] lg:text-2xl '>{date}</p>
          </div>
        </div>
      </div>

      <MeetinModelList />
    </section>
  )
}

export default Home