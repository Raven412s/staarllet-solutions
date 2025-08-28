import Footer from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { SectionThemeProvider } from '@/context/SectionThemeContext'
import { links } from '@/data/nav'
import { PropsWithChildren, Suspense } from 'react'

const layout = ({ children }: PropsWithChildren) => {
    return (
        <Suspense>
            <Nav links={links} />
            <SectionThemeProvider>
                {children}
            </SectionThemeProvider>
            <Footer />
        </Suspense>
    )
}

export default layout
