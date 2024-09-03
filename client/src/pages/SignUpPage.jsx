import React from 'react'
import { Signup } from '../components/index';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/index';

function SignUpPage() {
  const navigate = useNavigate();

  return (
      <section className='w-full h-screen flex justify-center items-center bg-white sm:bg-blue-300 md:bg-green-300 lg:bg-slate-500'>
        <div className="card bg-white w-full h-screen sm:w-[35rem] sm:h-[55rem] shadow-2xl rounded-lg flex flex-col justify-center ">
          <div className='w-full flex justify-center items-center flex-col text-center'>
            <Logo />
            <h3 className='text-4xl font-bold pb-2'>Sign Up</h3>
            <p className='text-gray-500 text-sm w-[20rem]'>Enter details below to create your free account and get started.</p>
          </div>
          <div className='w-full flex justify-center items-center flex-col'>
            <Signup />
          </div>

          <p className='w-full flex justify-center items-center mt-8 text-sm'>Already have an account? <span className='text-blue-700 pl-2 cursor-pointer hover:font-semibold' onClick={() => {navigate('/signin')}}>Login</span></p>
        </div>
      </section>
  )
}

export default SignUpPage