import React from 'react'
import Logo from './Logo'
import { Link, useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Features",
      slug: "/features",
      active: true,
    },
    {
      name: "Downloads",
      slug: "/downloads",
      active: true,
    },
    {
      name: "Plan & Pricing",
      slug: "/plus",
      active: true,
    }

  ]
  return (
    <header className='h-[6.5rem] w-full'>
      <nav className='flex items-center h-full justify-between'>

        <div className='ml-8 px-5'>
          <Link to='/'>
            <Logo />
          </Link>
        </div>

        <ul className='flex'>
          {
            navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button onClick={() => navigate(item.slug)} className='inline-block px-6 py-2 font-semibold text-black cursor-pointer'>
                  {item.name}
                </button>
              </li>
            ) : null
          )
          }
        </ul>

        <div className='mr-8 px-5'>
          <button onClick={() => navigate('/signup')} className='px-9 py-3 text-blue-700 font-semibold bg-white border-2 rounded-full border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition-all'>SignUp</button>
          <button onClick={() => navigate('/login')} className='ml-3 px-9 py-3 bg-blue-500 border-2 border-blue-500 rounded-full font-semibold text-white hover:bg-white hover:text-blue-700 transition-all cursor-pointer'>Login</button>
        </div>
      </nav>
    </header>
  )
}

export default Header