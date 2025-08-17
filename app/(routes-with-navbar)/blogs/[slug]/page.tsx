"use client"
import SectionWrapper from '@/components/wrapper/SectionWrapper'
import { useParams } from 'next/navigation'
import React from 'react'

const SingleBLogPage = () => {
    const { slug } = useParams()

    return (
        <SectionWrapper
            navbarSpacing="loose"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center justify-center h-full w-full gap-2 flex-col pointer-events-auto"
        >
            <div className='w-full'>
                SingleBlogPage for {slug}
            </div>
        </SectionWrapper>
    )
}

export default SingleBLogPage
