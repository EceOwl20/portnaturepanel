import React from 'react'

const LogoSection = ({images =[]}) => {
  return (
    <div className='flex bg-[#F8F8F8] w-full items-center justify-center h-[22vh] my-10 overflow-x-scroll'>
      <div className='flex w-[90%] items-center justify-between gap-16 xl:gap-[130px] max-h-[250px] pt-[83px] pb-[57px]'>
        
        {images.map((item,index)=>(
          <img src={item.firebaseUrl} alt='logo' height={110} key={index} className='w-auto' loading="lazy" />
        ))}
      </div>
    </div>
  )
}

export default LogoSection
