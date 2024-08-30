import React from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  return (
    <div>
      <nav>
        <Header />
      </nav>
      <div className='w-full h-[90vh] bg-white flex justify-start items-stretch'>
        {/* left side */}
        <div className='bg-white w-1/2 h-full flex justify-center items-center flex-col'>
          <div className='ml-7'>
            <h2 className='text-7xl px-5 py-6 font-bold ml-8'>Supercharge your meetings and made it effective</h2>
            <p className='text-lg px-7 pt-6 pb-12 ml-8 text-gray-600'>Experience the future of the vertual communication today. <br /> Say hello to a whole new way of connecting</p>
            <button className='ml-14 px-10 bg-blue-500 py-5 rounded-full text-white font-bold text-xl cursor-pointer hover:bg-blue-600 transition-all' onClick={() => navigate('/signup')}>Start Meeting now</button>
          </div>
        </div>
        {/* right side */}
        <div className='bg-green-50 w-1/2 h-full '>right side</div>
      </div>
    </div>
  )
}

export default Home