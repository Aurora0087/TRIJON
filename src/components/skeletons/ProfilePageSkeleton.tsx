import React from 'react'

function ProfilePageSkeleton() {
    return (
        <div className='py-8 flex flex-col gap-4 items-center'>
            <div className='w-20 h-20 bg-gray-300 rounded-full animate-pulse'></div>
            <div className='rounded-lg bg-gray-200 p-4 w-full animate-pulse'>
                <div className='flex flex-col md:flex-row justify-between gap-4 items-center'>
                    <div className='w-1/3 h-4 bg-gray-300 rounded animate-pulse'></div>
                    <div className='w-1/3 h-4 bg-gray-300 rounded animate-pulse'></div>
                </div>
                <div className='grid md:grid-cols-2 w-full my-4 gap-4'>
                    <div className='h-10 bg-gray-300 rounded-lg animate-pulse'></div>
                    <div className='h-10 bg-gray-300 rounded-lg animate-pulse'></div>
                </div>
                <div className='flex flex-col gap-2 p-2'>
                    <div className='w-1/2 h-4 bg-gray-300 rounded animate-pulse'></div>
                    <div className='w-1/4 h-4 bg-gray-300 rounded animate-pulse'></div>
                    <div className='w-1/3 h-4 bg-gray-300 rounded animate-pulse'></div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePageSkeleton