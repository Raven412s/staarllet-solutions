import React from 'react'
import SectionWrapper from './wrapper/SectionWrapper';
import Copy from './text-reveal/Copy';
import { cn } from '@/lib/utils';
import { servicesData } from '@/data/servicesData';
import ServiceShowcase from './ServiceShowcase';

const ServiceSection = () => {
    return (
        <SectionWrapper
            navbarSpacing="none"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center justify-center h-full w-full gap-2 flex-col"
        >
            <section id="services" className="w-full flex flex-col items-center justify-start border-3 border-[#101c1650] rounded-[1.2rem] py-12 px-6">
                <Copy>
                    <span
                        className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide",
                            "bg-primary/10 text-primary border border-primary/20 shadow-sm",
                            "hover:bg-primary/20 transition-colors duration-200",
                        )}
                    >
                        {servicesData.heroSection.tagline}
                    </span>
                </Copy>
                <div className="w-full">
                    <div className="lg:w-4xl w-full space-y-7 pt-6">
                        <Copy>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] text-[#101c16] tracking-tight font-bold ">
                                {servicesData.heroSection.title}
                            </h1>
                        </Copy>
                        <Copy>
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 tracking-normal font-medium">
                                {servicesData.heroSection.description}
                            </p>
                        </Copy>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-10 lg:gap-x-14 py-15 mb-24">
                        {servicesData.categories.map((category) => {
                            if (!category.image) return null;
                            return (
                                <div key={category.title} className="flex w-full flex-col gap-6 items-start justify-center">
                                    <Copy><h1 className="text-2xl font-semibold capitalize w-max">{category.title}</h1></Copy>
                                    <Copy>
                                        <div className="overflow-hidden relative rounded-4xl border border-green-950/20 h-fit w-full shadow">
                                            <img
                                                src={category.image}
                                                alt={`${category.title} category image`}
                                                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    </Copy>
                                    <Copy><p className="text-lg text-gray-700/90 ">{category.description}</p></Copy>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <div className="max-w-4xl space-y-8">
                            <Copy><h2 className="text-4xl leading-[1.3] text-[#101c16] tracking-tight font-bold ">Our Services</h2></Copy>
                            <Copy><p className="text-2xl leading-[1.1] text-gray-600 tracking-normal font-medium">Discover how we can help your business <br /> thrive with our tailored HR and talent solutions.</p></Copy>
                        </div>
                        <ServiceShowcase />
                    </div>
                </div>
            </section>
        </SectionWrapper>
    )
}

export default ServiceSection
