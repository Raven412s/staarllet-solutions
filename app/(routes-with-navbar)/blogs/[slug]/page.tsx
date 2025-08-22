import SectionWrapper from '@/components/wrapper/SectionWrapper';
import type { Metadata } from "next";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const awaitedParams = await params
    const title = awaitedParams.slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    return {
        title: `${title} | Blog | Staarllet Solutions`,
        description: `Read about ${title} at Staarllet Solutions. Insights on recruitment, branding, and media.`
    };
}

const SingleBLogPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const awaitedParams = await params
    const { slug } = awaitedParams
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
