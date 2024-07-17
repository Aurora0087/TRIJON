import BackButton from '@/components/BackButton'
import Paragraph from '@/components/Paragraph'
import WidthWrraper from '@/components/WidthWrraper'
import React from 'react'

function AboutPage() {
    /**
     * About Us : 'Refresh your clothing with the awesome collection of Round Neck Tees from TRIJON. These t shirts are made of 100% - Bio wash Cotton and make a comfort wear for all seasons. The feel of the fabric keeps you comfortable even at high humid conditions. Pair it with Cotton Trousers or Denims for a perfect weekend wear.

TRIJON offers quality casual wear in the widest variety which makes it easy to choose. Fall in love with the soft texture of the fabric wearing this plain solid t-shirt, has a collar type & sleeves types slim-fit t-shirt by TRIJON. Hook up with comfort and roll with time as you adorn this t-shirt fashioned using cotton pique. work hard and play harder as you party through the night in this utterly comfortable t-shirt. these t-shirt can be'
     */
    return (
        <WidthWrraper className=' py-8 flex flex-col gap-4 min-h-svh bg-slate-100'>
            <div className=' w-fit'>
                <BackButton />
            </div>
            <div className=' flex flex-col gap-4 text-xl'>
                <div className=' overflow-hidden'>
                    <h1 className=' text-5xl mb-8'>About TRIJON :</h1>
                </div>
                <div className=' pl-2 overflow-hidden mb-10'>
                    <p>
                    Refresh your clothing with the awesome collection of Round Neck Tees from TRIJON. These t shirts are made of 100% - Bio wash Cotton and make a comfort wear for all seasons. The feel of the fabric keeps you comfortable even at high humid conditions. Pair it with Cotton Trousers or Denims for a perfect weekend wear.
                    </p>
                    {/*<Paragraph paragraph='
                    Refresh your clothing with the awesome collection of Round Neck Tees from TRIJON. These t shirts are made of 100% - Bio wash Cotton and make a comfort wear for all seasons. The feel of the fabric keeps you comfortable even at high humid conditions. Pair it with Cotton Trousers or Denims for a perfect weekend wear.
                    '
                    />*/}
                    <p>
                    
                    </p>
                </div>
                <div className=' pl-2 overflow-hidden'>
                    <p>
                    TRIJON offers quality casual wear in the widest variety which makes it easy to choose. Fall in love with the soft texture of the fabric wearing this plain solid t-shirt, has a collar type & sleeves types slim-fit t-shirt by TRIJON. Hook up with comfort and roll with time as you adorn this t-shirt fashioned using cotton pique. work hard and play harder as you party through the night in this utterly comfortable t-shirt. these t-shirt can be
                    </p>
                    {/*<Paragraph paragraph='
                    TRIJON offers quality casual wear in the widest variety which makes it easy to choose. Fall in love with the soft texture of the fabric wearing this plain solid t-shirt, has a collar type & sleeves types slim-fit t-shirt by TRIJON. Hook up with comfort and roll with time as you adorn this t-shirt fashioned using cotton pique. work hard and play harder as you party through the night in this utterly comfortable t-shirt. these t-shirt can be
                    '/>*/}
                </div>
            </div>
        </WidthWrraper>
    )
}

export default AboutPage