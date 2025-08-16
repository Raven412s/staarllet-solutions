// app/layout.tsx or app/page.tsx
import { SectionThemeProvider } from '@/context/SectionThemeContext';
import Nav from '@/components/Nav';
import { links, tags, topLinks } from '@/data/nav';
import { PropsWithChildren, Suspense } from 'react';

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Nav links={links} tags={tags} topLinks={topLinks}>
                <Suspense>
                    <SectionThemeProvider>
                        {children}
                    </SectionThemeProvider>
                </Suspense>
            </Nav>
        </>
    );
}
