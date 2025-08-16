import React from 'react'
import SectionWrapper from './wrapper/SectionWrapper'
import Copy from './text-reveal/Copy'
import JobCategoryMasonry from './JobCategoryMasonry'

const HeroSection = () => {
  return (
   <SectionWrapper
                navbarSpacing="loose"
                padding="sm"
                background="transparent"
                maxWidth="full"
                className="flex items-center justify-center h-full w-full gap-2 flex-col "
            >
                <section id="hero" className="w-full min-h-screen flex flex-col items-center justify-center pt-20 px-4 bg-[#101c16] rounded-[1.2rem]">
                    <div className="max-w-6xl mx-auto text-center mb-12 ">
                        <Copy>
                            <h1 className="text-4xl md:text-6xl font-bold text-green-50 mb-6 leading-[1.38]">
                                Connecting talents<br />with startups
                            </h1>
                            <p className="text-lg md:text-2xl text-white/60 mb-8">
                                We make it easy to find your dream job – regardless of your location.<br />
                                Browse over 100,000 jobs from top companies to fast-growing startups.
                            </p>
                        </Copy>
                        <div className="flex flex-col sm:flex-row  gap-4 justify-center pointer-events-auto duration-200">
                            <button className="px-6 py-3 rounded-lg bg-green-200 text-[#101c16] font-semibold shadow hover:bg-green-300/60 transition pointer-events-auto duration-200">Find a job</button>
                            <button className="px-6 py-3 rounded-lg bg-transparent border border-white text-white font-semibold shadow hover:border-green-100/80 hover:bg-green-100/60 hover:text-[#101c16] transition pointer-events-auto duration-200">Find a talent</button>
                        </div>
                    </div>
                    <JobCategoryMasonry />
                </section>
            </SectionWrapper>
  )
}

export default HeroSection
