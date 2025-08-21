import Link from 'next/link'
import React from 'react'

const ViewBlogs = () => {
  return (
    <div>
      here will be a grid of the created blogs
      <Link href={"/admin/blogs/add"}>Add blog</Link>
    </div>
  )
}

export default ViewBlogs
