import React from 'react'

function Meeting({ className, img, description, title, handleClick }) {
  return (
      <div className={`${className} transition-colors px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer`} onClick={handleClick}>
        <div className='flex justify-between px-3 items-center bg-[#ffffff40] backdrop-blur-[4px] size-12 rounded-[10px] '>
          <img src={img} alt="icons" width={27} height={27} />
        </div>
        <div className='flex flex-col gap-2 '>
          <h1 className='text-2xl font-bold'>{title}</h1>
          <p className='text-lg font-normal'>{description}</p>
        </div>
      </div>
  )
}

export default Meeting