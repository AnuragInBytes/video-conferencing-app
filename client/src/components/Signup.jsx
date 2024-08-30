import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

function Signup() {
  return (
    <div className='w-full h-screen flex justify-center items-center bg-gray-100'>
      <div className='bg-white'>
        <div className='bg-red-50 px-10 pt-10 w-full h-full'>
          <Link><Logo /></Link>
          <h3 className='text-5xl font-bold'>Sign up</h3>
        </div>
        <p className='px-10 py-2 text-gray-600 pb-5'>Enter your details below to create account and get started.</p>
        <div className='px-10 pb-10 w-full h-full'>
          <form className='flex justify-start h-full w-full'>
            <div className='bg-green-50 w-1/2'>
              </div>
            <div className='bg-blue-50 w-1/2'>right</div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup