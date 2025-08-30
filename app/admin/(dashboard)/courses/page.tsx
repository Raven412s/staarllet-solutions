import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
   <div>
      <h2>
        this is courses page
        <Link className={buttonVariants()} href={"/admin/courses/add"}>Add Your First Course</Link>
      </h2>
    </div>
  )
}

export default page
