
import Copy from '@/components/text-reveal/Copy';
import SectionWrapper from '@/components/wrapper/SectionWrapper';
import { servicesData } from '@/data/servicesData';
import type { Metadata } from "next";

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
        return (
                <SectionWrapper
                        navbarSpacing="loose"
                        padding="sm"
                        background="transparent"
                        maxWidth="full"
                        className="flex items-center justify-center h-full w-full gap-2 flex-col pointer-events-auto"
                >
                        <div className="min-h-screen flex flex-col items-start justify-start">
                                <Copy><h1 className='text-5xl text-[#101d16] font-bold'>{pageData.title}</h1></Copy>
                        </div>
                </SectionWrapper>
        );
}

export default SingleServicePage
