import React from 'react'
import { Link } from 'react-router-dom'
import MobileNav from './MobileNav'
import LogoutBtn from '../LogoutBtn'

function NavBar() {
  return (
    <nav className='fixed flex items-center justify-between z-50 w-full bg-[#1c1f2e] px-6 py-4 lg:px-10 '>
      <Link to='/' className='flex items-center gap-1'>
        <img src="/icons/logo.svg" width={32} height={32} alt="LOGO" className='max-sm:size-10' />
        <p className='text-[26px] font-extrabold text-white max-sm:hidden'>StreamSync</p>
      </Link>

      <div className='flex justify-between items-center gap-5 '>
        {/* user managment */}
        <div className=''>
          <LogoutBtn />
        </div>
        <MobileNav />
      </div>
    </nav>
  )
}

export default NavBar