import React from 'react'
import { NavLink } from 'react-router-dom'
const sideBarContent = [
  {
    active: true,
    label: 'Home',
    slug: '/lobby',
    imgUrl: '/icons/Home.svg',
  },
  {
    label: 'Upcoming',
    active: true,
    slug: '/lobby/upcoming',
    imgUrl: '/icons/upcoming.svg',
  },
  {
    active: true,
    label: 'Previous',
    slug: '/lobby/previous',
    imgUrl: '/icons/previous.svg',
  },
  {
    active: true,
    label: 'Recordings',
    slug: '/lobby/recordings',
    imgUrl: '/icons/Video.svg',
  },
  {
    active: true,
    label: "Personal Room",
    slug: "/lobby/personal-room",
    imgUrl: "/icons/add-personal.svg",
  }
]

function SideBar() {
  return (
    <section className='sticky left-0 top-0 flex h-screen w-fit p-6 pt-28  flex-col justify-between bg-[#1c1f2e] text-white max-sm:hidden lg:w-[264px]'>
      <ul className='flex flex-col gap-6'>
      {
        sideBarContent.map((item) =>
        item.active ? (
          <li key={item.label}>
            <NavLink to={item.slug} className={({isActive}) => `flex gap-4 items-center p-4 rounded-lg justify-start ${isActive ? 'bg-blue-500' : 'bg-[#1c1f2e]'}`}>
              <img src={item.imgUrl} alt={item.label} width={24} height={24} />
              <p className='text-lg pl-3 font-semibold max-lg:hidden'>
                {item.label}
              </p>
            </NavLink>
          </li>
        ) : null
        )
      }
      </ul>
    </section>
  )
}

export default SideBar