import Link from 'next/link'
import React from 'react'

const AdminOnlyPage = () => {
  return (
    <div>
      this page is protected by the ADMINONLY authorization needed
      <Link href={'/admin/blogs'}>blogs</Link>
    </div>
  )
}

export default AdminOnlyPage
