import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import { SectionThemeProvider } from '@/context/SectionThemeContext'
import { links, tags, topLinks } from '@/data/nav'
import React, { PropsWithChildren, Suspense } from 'react'

const layout = ({ children }: PropsWithChildren) => {
    return (
        <Suspense>
            <Nav links={links} tags={tags} topLinks={topLinks}>
                <SectionThemeProvider>
                    {children}
                </SectionThemeProvider>
                <Footer />
            </Nav>
        </Suspense>
    )
}

export default layout
