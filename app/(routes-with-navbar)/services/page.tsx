import ServiceSection from '@/components/ServiceSection'
import SectionWrapper from '@/components/wrapper/SectionWrapper'
import React from 'react'

const ServicesPage = () => {
  return (
      <SectionWrapper
            navbarSpacing="loose"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center min-h-screen justify-center h-full w-full gap-2 flex-col pointer-events-auto"
        >
            <ServiceSection/>
        </SectionWrapper>
  )
}

export default ServicesPage
