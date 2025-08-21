"use client"
import Copy from '@/components/text-reveal/Copy'
import SectionWrapper from '@/components/wrapper/SectionWrapper'
import { servicesData } from '@/data/servicesData'
import { useParams } from 'next/navigation'

const SingleServicePage = () => {
    const { slug } = useParams()
    const pageData = servicesData.services.find(service => service.slug === slug)
    return (
        <SectionWrapper
            navbarSpacing="loose"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center justify-center h-full w-full gap-2 flex-col pointer-events-auto"
        >
            <div className="min-h-screen flex flex-col items-start justify-start">
            <Copy><h1 className='text-5xl text-[#101d16] font-bold'>{pageData?.title}</h1></Copy>
            
            </div>
        </SectionWrapper>
    )
}

export default SingleServicePage
