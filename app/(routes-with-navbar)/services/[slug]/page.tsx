import Copy from '@/components/text-reveal/Copy';
import SectionWrapper from '@/components/wrapper/SectionWrapper';
import { servicesData } from '@/data/servicesData';
import type { Metadata } from "next";
import ServiceRenderer from "../_components/service-rendered/ServiceRenderer";
import { serviceComponents } from '../_components/service-rendered/ServiceComponents';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const service = servicesData.services.find(s => s.slug === slug);
    if (!service) return {};
    return {
        title: `${service.title} | Services | Staarllet Solutions`,
        description: service.description ?? `Learn more about ${service.title} at Staarllet Solutions.`,
    };
}

export default async function SingleServicePage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const pageData = servicesData.services.find(s => s.slug === slug);

    if (!pageData) return null;

    const hasComponent = slug in serviceComponents;
    console.log("Slug param:", slug);
    console.log("Service keys:", Object.keys(serviceComponents));


    return (
        <SectionWrapper
            navbarSpacing="loose"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center justify-center h-full w-full gap-2 flex-col pointer-events-auto"
        >
            {hasComponent ? (
                <ServiceRenderer slug={slug as keyof typeof serviceComponents} />
            ) : (
                <div className="min-h-screen flex flex-col items-start justify-start">
                    <Copy>
                        <h1 className="text-5xl text-[#101d16] font-bold leading-relaxed">
                            {pageData.title}
                        </h1>
                    </Copy>
                    <p className="text-lg mt-4">{pageData.description}</p>

                    {pageData.features?.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                            <ul className="list-disc pl-5">
                                {pageData.features.map((feature, idx) => (
                                    <li key={idx} className="mb-2">{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </SectionWrapper>
    );
}
