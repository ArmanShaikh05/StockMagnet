import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='p-10'>
        <div className='flex flex-col items-center max-w-7xl mx-auto justify-between gap-6 sm:flex-row'>
            <Link href={"/"} className='flex items-center gap-3'>
                <Image src={"/logo.png"} alt='logo' height={50} width={50} />
                <span className='text-xl font-bold'>StockMagnet</span>
            </Link>
            <div className='flex items-center gap-5'>
                <p className='text-balance text-[12px] sm:text-sm text-muted-foreground'>© StockMagnet. All rights reserved.</p>
            </div>
        </div>
    </footer>
  )
}

export default Footer