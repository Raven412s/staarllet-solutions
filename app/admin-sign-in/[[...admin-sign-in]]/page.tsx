import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className='flex items-center justify-center min-h-screen w-full'>
      <SignIn/>
    </div>
  )
}

export default page
