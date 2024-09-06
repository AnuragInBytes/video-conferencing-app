import React from 'react'
import { NavBar, SideBar,  } from '../components'
import { Outlet } from 'react-router-dom'

function HomePage() {
  return (
    <main className='relative bg-[#1c1f2e]'>
      <NavBar />
      <div className='flex'>
        <SideBar />
        <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14'>
          <div className='w-full'>
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  )
}

export default HomePage