import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react'

function WidthWrraper(
    {
        children, className
    }: {
        children: ReactNode,
        className?: string
    }
) {
    return (
        <div className={cn("h-full mx-auto w-full px-2.5 md:px-24", className)}>
            {children}
        </div>
    )
}

export default WidthWrraper