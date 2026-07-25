"use client"

import { DocsHeader, DocsSidebar } from "@/lib/docs"

export function DocsShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='min-h-screen bg-gray-50'>
            <DocsHeader title='Chitthi Docs' />
            <div className='container mx-auto px-4 py-8 flex gap-8'>
                <DocsSidebar />
                <div className=''>{children}</div>
            </div>
        </div>
    )
}
