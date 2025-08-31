import { cn } from '@/lib/utils'
import JobCategoryMasonry from './JobCategoryMasonry'
import { ScrollMarquee } from './scroll-marquee'
import Copy from './text-reveal/Copy'
import SectionWrapper from './wrapper/SectionWrapper'
import { getUser } from '@/lib/getUser'

const HeroSection = async () => {
    const user = await getUser()
    return (
        <SectionWrapper
            navbarSpacing="loose"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center justify-center h-full w-full gap-2 flex-col "
        >
            {/* Hero Section */}
            <section id="hero" className="w-full min-h-screen flex flex-col items-center justify-center pt-20  bg-[#101c16] rounded-[1.2rem] rounded-b-none">
                <div className="max-w-6xl mx-auto text-center mb-12 px-4">
                    <Copy>
                        <h1 className="text-4xl md:text-7xl font-bold text-green-50 mb-6 md:leading-[1.39]">
                            Empowering Talent, <br />Elevating Businesses
                        </h1>
                        <p className="text-lg md:text-2xl text-white/60 mb-8">
                            Your trusted partner in IT & Non-IT Recruitment, Training & HR Solutions
                        </p>
                        <p className="text-lg md:text-xl text-white/70 mb-8 max-w-4xl mx-auto">
                            Welcome to Staarllet Staffing Solution… where talent meets opportunity. We specialize in providing top-tier recruitment services, expert-led training programs, and strategic HR solutions across IT and Non-IT sectors. Whether you&apos;re a company seeking skilled professionals or an individual ready to level up your career, we&apos;re here to bridge the gap and deliver excellence.
                        </p>
                    </Copy>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto duration-200 mt-10">
                        <button className="px-8 py-4 rounded-lg bg-green-200 text-[#101c16] font-semibold shadow hover:bg-green-300/80 transition pointer-events-auto duration-200 text-lg">
                            Find a Job
                        </button>
                        <button className="px-8 py-4 rounded-lg bg-transparent border-2 border-white text-white font-semibold shadow hover:border-green-200 hover:bg-green-200/20 hover:text-white transition pointer-events-auto duration-200 text-lg">
                            Find Talent
                        </button>
                    </div>
                </div>
                <ScrollMarquee
                    baseSpeed={120}
                    className="text-3xl text-white sm:text-5xl lg:text-7xl font-bold italic !h-[100px] sm:!h-[140px] lg:!h-[180px] w-full"
                >
                    <span className="text-green-200">5000+ Placements</span>
                    <span>•</span>
                    <span className="text-white">IT Recruitment</span>
                    <span>•</span>
                    <span className="text-green-200">100+ Partner Companies</span>
                    <span>•</span>
                    <span className="text-white">HR Solutions</span>
                    <span>•</span>
                    <span className="text-green-200">Expert Training</span>
                    <span>•</span>
                    <span className="text-white">Career Guidance</span>
                    <span>•</span>
                    <span className="text-green-200">Resume Building</span>
                    <span>•</span>
                    <span className="text-white">Skill Development</span>
                    <span>•</span>
                </ScrollMarquee>
            </section>

            {/* Job Openings Section */}
            <section id="job-openings" className="w-full min-h-screen flex flex-col items-start justify-center pt-20 px-4 bg-[#101c16] rounded-[1.2rem] rounded-t-none">
                <div className="py-10 w-full space-y-12 flex justify-start items-center flex-col">
                    <Copy>
                        <span
                            className={cn(
                                "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium tracking-wide",
                                "bg-green-50/80 text-green-700 border border-green-100/20 shadow-sm",
                                "hover:bg-primary/20 transition-colors duration-200",
                            )}
                        >
                            📢 Current Job Openings
                        </span>
                    </Copy>
                    <div className="w-full flex items-start justify-start">
                        <Copy >
                            <h1 className='text-4xl md:text-6xl leading-[1.38] font-semibold text-left text-green-50 mb-6'>
                                Explore exciting opportunities <br />with top companies
                            </h1>
                        </Copy>
                    </div>
                    <JobCategoryMasonry user={user ? true : false} />
                </div>
            </section>
        </SectionWrapper>
    )
}

export default HeroSection