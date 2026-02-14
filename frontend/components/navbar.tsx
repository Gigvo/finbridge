import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'

export default function Navbar() {
    return (
        <div className='flex flex-row justify-between items-center px-8 py-3.5 border-b-2'>
            <div className='flex flex-row items-center gap-2.5'>
                <Image
                    src='/finbridge-logo.webp'
                    alt='Logo'
                    width={52}
                    height={40}
                />
                <Link href={'/'} className='font-bold'>
                    <span className='text-blue-500'>Fin</span>Bridge
                </Link>
            </div>
            <div className='flex flex-row gap-5 items-center'>
                <Link
                    href={'/'}
                    className='hover:bg-blue-400 hover:text-white py-2 px-4 rounded-lg transition duration-150'
                >
                    Dashboard
                </Link>
                <Link
                    className='hover:bg-blue-400 hover:text-white py-2 px-4 rounded-lg transition duration-150'
                    href={'/fitur'}
                >
                    Hubungkan Data
                </Link>
                <Link
                    className='hover:bg-blue-400 hover:text-white py-2 px-4 rounded-lg transition duration-150'
                    href={'/cara-kerja'}
                >
                    pembiayaan
                </Link>
            </div>
        </div>
    )
}
