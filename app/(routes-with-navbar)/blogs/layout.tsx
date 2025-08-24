import { Button } from '@/components/ui/button'
import SectionWrapper from '@/components/wrapper/SectionWrapper'
import { FileText } from 'lucide-react'
import Link from 'next/link'
import React, { PropsWithChildren } from 'react'

const BlogLayout = ({ children }: PropsWithChildren) => {
    return (
        <SectionWrapper
            navbarSpacing="loose"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center justify-center h-full w-full gap-2 flex-col pointer-events-auto"
        >
            <Button asChild>
                <Link href="/blogs/create">
                    <FileText className="mr-2 h-4 w-4" />
                    Write a Blog
                </Link>
            </Button>
            {children}
        </SectionWrapper>
    )
}

export default BlogLayout
