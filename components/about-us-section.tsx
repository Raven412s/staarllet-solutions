import { Briefcase, Database, Users, Award, CheckCircle } from 'lucide-react';
import SectionWrapper from './wrapper/SectionWrapper';
import Copy from './text-reveal/Copy';
import { cn } from '@/lib/utils';

export const AboutUsSection = () => {
  return (
    <SectionWrapper
      navbarSpacing="none"
      padding="sm"
      background="transparent"
      maxWidth="full"
      className="flex items-center justify-center h-full w-full gap-2 flex-col"
    >
      <div id='about' className="w-full flex flex-col items-center justify-start border-3 border-[#101c1650] rounded-[1.2rem] py-12 px-6">
        <Copy>
          <span
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide",
              "bg-primary/10 text-primary border border-primary/20 shadow-sm",
              "hover:bg-primary/20 transition-colors duration-200",
            )}
          >
            About Us
          </span>
        </Copy>
        <div className="w-full space-y-6">
          {/* Header Section */}
          <div className="lg:w-4xl w-full space-y-7 pt-6 pb-10">
            <Copy><h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.38] text-[#101c16] tracking-tight font-bold ">About Staarllet Staffing Solution</h1></Copy>
            <Copy><p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 tracking-normal font-medium">Bridging the gap between top talent and leading organizations across industries</p></Copy>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6 ">
              <Copy><p className="text-lg text-gray-700">Staarllet Staffing Solution is a trusted talent partner, committed to bridging the gap between top talent and leading organizations across IT and non-IT sectors. Since our inception, we&apos;ve been helping businesses scale with the right people and empowering candidates to become job-ready through skill development and career support.</p></Copy>
              <br />
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <div className="flex items-start space-x-4">
                  <Database className="h-8 w-8 text-green-700 mt-1 flex-shrink-0" />
                  <div className='flex flex-col gap-2'>
                    <Copy><h3 className="text-xl font-semibold text-gray-900">Our Talent Network</h3></Copy>
                    <Copy><p className="text-gray-700">With a growing database of over <span className="font-bold text-green-700">20,000+ active candidates</span>, categorized by year of hiring and skill sets, we ensure quick and accurate talent matching tailored to every client&apos;s needs.</p></Copy>
                  </div>
                </div>
              </div>
              <Copy><p className="text-lg text-gray-700">Our deep industry insight and personalized approach have earned us the continued trust of <span className="font-semibold">45+ companies</span> that rely on us for smart, scalable hiring and workforce solutions.</p></Copy>
            </div>

            {/* Right Column - Image or Stats */}

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <Copy>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="h-8 w-8 text-green-700 mr-3" />
                  What Sets Us Apart
                </h3>
              </Copy>
              <ul className="space-y-5">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <Copy>
                    <span className="text-gray-700">
                      <strong>End-to-End Hiring</strong> across all sectors — IT, Engineering, Finance, Healthcare, Retail, and more
                    </span>
                  </Copy>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <Copy>
                    <span className="text-gray-700">
                      <strong>Customized Outsourcing Solutions</strong> to save time, cost, and resources
                    </span>
                  </Copy>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <Copy>
                    <span className="text-gray-700">
                      <strong>Career Skill Development</strong> to make candidates industry-ready
                    </span>
                  </Copy>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <Copy>
                    <span className="text-gray-700">
                      <strong>Resume and Interview Guidance</strong> from experts for faster job placements
                    </span>
                  </Copy>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <Copy>
                    <span className="text-gray-700">
                      <strong>Long-Term Partnerships</strong> with companies seeking quality talent and strategic growth
                    </span>
                  </Copy>
                </li>
              </ul>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-16 text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <Briefcase className="h-12 w-12 text-green-700 mx-auto mb-4" />
            <Copy><h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3></Copy>
            <Copy>
              <p className="text-xl text-gray-700 italic">
                &quot;At Staarllet, we don&apos;t just fill vacancies — we build careers, strengthen teams, and create lasting value for both our clients and candidates.&quot;
              </p>
            </Copy>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <Copy>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Users className="h-10 w-10 text-green-700 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">20,000+</p>
                <p className="text-gray-600">Active Candidates</p>
              </div>
            </Copy>
            <Copy>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Briefcase className="h-10 w-10 text-green-700 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">45+</p>
                <p className="text-gray-600">Trusted Companies</p>
              </div>
            </Copy>
            <Copy>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-3xl font-bold text-gray-900">100%</p>
                <p className="text-gray-600">Customized Solutions</p>
              </div>
            </Copy>
            <Copy>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-3xl font-bold text-gray-900">Multi-Sector</p>
                <p className="text-gray-600">Expertise</p>
              </div>
            </Copy>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};