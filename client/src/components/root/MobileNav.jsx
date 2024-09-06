import React from 'react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Link, NavLink } from 'react-router-dom'

const sideBarContent = [
  {
    active: true,
    label: 'Home',
    slug: '/',
    imgUrl: '/icons/Home.svg',
  },
  {
    label: 'Upcoming',
    active: true,
    slug: '/upcoming',
    imgUrl: '/icons/upcoming.svg',
  },
  {
    active: true,
    label: 'Previous',
    slug: '/previous',
    imgUrl: '/icons/previous.svg',
  },
  {
    active: true,
    label: 'Recordings',
    slug: '/recordings',
    imgUrl: '/icons/Video.svg',
  },
  {
    active: true,
    label: "Personal Room",
    slug: "/personal-room",
    imgUrl: "/icons/add-personal.svg",
  }
]


function MobileNav() {
  return (
    <section className='w-full max-w-[264px]'>
      <Sheet>
        <SheetTrigger asChild >
          <img src="/icons/hamburger.svg" width={36} height={36} alt="hamburgerIcon" className='cursor-pointer sm:hidden' />
        </SheetTrigger>
        <SheetContent side='left' className='border-none bg-[#1c1f2e]' >
          <SheetTitle>
          <Link to='/' className='flex items-center gap-1'>
            <img src="/icons/logo.svg" width={32} height={32} alt="LOGO" className='max-sm:size-10' />
            <p className='text-[26px] font-extrabold text-white '>StreamSync</p>
          </Link>

          <div className='flex h-[calc(100vh-72px)] flex-col justify-between  overflow-y-auto'>
            <SheetClose asChild>
              <section className='flex h-full flex-col gap-6 pt-16 text-white'>
                <ul className='flex flex-col gap-6'>
                {
                  sideBarContent.map((item) =>
                  item.active ? (
                    <li key={item.label}>
                      <NavLink to={item.slug} className={({isActive}) => `flex items-center gap-4 p-4 rounded-lg w-full max-w-60 ${isActive ? 'bg-blue-500' : 'bg-[#1c1f2e]'}`}>
                        <SheetClose className='w-full'>
                          <div className='w-full flex items-center h-full p-1'>
                            <img src={item.imgUrl} alt={item.label} width={20} height={20} />
                            <p className='font-semibold px-3'>
                              {item.label}
                            </p>
                          </div>
                        </SheetClose>
                      </NavLink>
                    </li>
                  ) : null
                )
              }
                </ul>
              </section>
            </SheetClose>
          </div>
          </SheetTitle>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav