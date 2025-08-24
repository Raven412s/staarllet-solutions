// service/[slug]/page.tsx
import Copy from '@/components/text-reveal/Copy';
import SectionWrapper from '@/components/wrapper/SectionWrapper';
import { servicesData } from '@/data/servicesData';
import type { Metadata } from "next";
import dynamic from 'next/dynamic';

const serviceComponents = {
    'outsourcing-solutions': dynamic(() => import('../_components/outsourcing-services'), {
        ssr: true,
        loading: () => <p>Loading outsourcing services...</p>
    }),
    'end-to-end-hiring-services': dynamic(() => import('../_components/end-to-end-hiring-services'), {
        ssr: true,
        loading: () => <p>Loading end-to-end hiring services...</p>
    }),
    'hr-certification-courses': dynamic(() => import('../_components/hr-certification-courses'), {
        ssr: true,
        loading: () => <p>Loading HR certification courses...</p>
    }),
    'resume-career-guidance': dynamic(() => import('../_components/resume-and-career-guidance'), {
        ssr: true,
        loading: () => <p>Loading resume and career guidance...</p>
    }),
    'skill-development-training': dynamic(() => import('../_components/skill-development-training'), {
        ssr: true,
        loading: () => <p>Loading skill development training...</p>
    }),
    'talent-workforce-optimization': dynamic(() => import('../_components/talent-workforce-optimization'), {
        ssr: true,
        loading: () => <p>Loading talent workforce optimization...</p>
    }),
    // Add other service components here as needed
    // 'another-service': dynamic(() => import('../_components/another-service')),
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const awaitedParams = await params;
    const service = servicesData.services.find(service => service.slug === awaitedParams.slug);
    if (!service) return {};
    return {
        title: `${service.title} | Services | Staarllet Solutions`,
        description: service.description || `Learn more about ${service.title} at Staarllet Solutions.`
    };
}

const SingleServicePage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const awaitedParams = await params;
    const { slug } = awaitedParams;
    const pageData = servicesData.services.find(service => service.slug === slug);
    
    if (!pageData) return null;
    
    const ServiceComponent = serviceComponents[slug as keyof typeof serviceComponents];
    
    return (
        <SectionWrapper
            navbarSpacing="loose"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center justify-center h-full w-full gap-2 flex-col pointer-events-auto"
        >
            {ServiceComponent ? (
                <ServiceComponent />
            ) : (
                <div className="min-h-screen flex flex-col items-start justify-start">
                    <Copy className=''>
                        <h1 className='text-5xl text-[#101d16] font-bold leading-relaxed'>{pageData.title}</h1>
                    </Copy>
                    {/* You can add more default service content here using pageData */}
                    <p className="text-lg mt-4">{pageData.description}</p>
                    
                    {pageData.features && pageData.features.length > 0 && (
                      <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                        <ul className="list-disc pl-5">
                          {pageData.features.map((feature, index) => (
                            <li key={index} className="mb-2">{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
            )}
        </SectionWrapper>
    );
}

export default SingleServicePage;