import React from 'react'
import SignIn from '../components/SignIn';
import { Logo } from '../components';
import { useNavigate } from 'react-router-dom';

function SignInPage() {
  const navigate = useNavigate();

  return (
    <section className='w-full h-screen flex justify-center items-center bg-white sm:bg-blue-300 md:bg-green-300 lg:bg-slate-500'>
      <div className="card bg-white w-full h-screen sm:w-[35rem] sm:h-[40rem] shadow-2xl rounded-lg flex flex-col justify-center ">
        <div className='w-full flex justify-center items-center flex-col text-center'>
          <Logo />
          <h3 className='text-4xl font-bold pb-2'>Welcome Back</h3>
          <p className='text-gray-500 text-sm'>Glad to see you again 👋 <br /> Login to your account below  </p>
        </div>
        <div className='w-full flex justify-center items-center flex-col'>
          <SignIn />
        </div>

        <p className='w-full flex justify-center items-center mt-8 text-sm'>Don't have an account? <span className='text-blue-700 pl-2 cursor-pointer hover:font-semibold' onClick={() => {navigate('/signup')}}>Signup for free</span></p>
      </div>
    </section>
  )
}

export default SignInPage