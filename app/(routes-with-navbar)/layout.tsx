import Footer from '@/components/Footer'
import {Nav} from '@/components/Nav'
import { SectionThemeProvider } from '@/context/SectionThemeContext'
import { links } from '@/data/nav'
import React, { PropsWithChildren, Suspense } from 'react'
import { Toaster } from 'sonner'

const layout = ({ children }: PropsWithChildren) => {
    return (
        <Suspense>
            <Nav links={links} />
            <SectionThemeProvider>
                {children}
            </SectionThemeProvider>
            <Footer />
            <Toaster richColors />
        </Suspense>
    )
}

export default layout
