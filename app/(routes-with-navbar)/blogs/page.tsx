import SectionWrapper from '@/components/wrapper/SectionWrapper'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Blog = () => {
    return (
        <SectionWrapper
            navbarSpacing="loose"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center min-h-screen justify-center h-full w-full gap-2 flex-col pointer-events-auto"
        >
            <h1 className='text-4xl mb-5'>Blogs Page</h1>

            <div className="grid grid-cols-4">
                <Link href={'/blogs/finding-jobs-are-now-easier'}>
                    <div className="rounded-md p-6 flex flex-col gap-4 items-start justify-around bg-[#101c16] text-green-100">
                        <h3 className='text-2xl font-semibold'>Finding Jobs are now easier 😃</h3>
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden">
                            <Image
                                fill
                                src={'/backgrounds/background-1.png'}
                                alt='image-finding-jobs-are-now-easier'
                                className='object-cover h-full w-full'
                            />
                        </div>
                        <p className='text-sm text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, reiciendis.</p>
                    </div>
                </Link>
            </div>
        </SectionWrapper>
    )
}

export default Blog
