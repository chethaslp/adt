"use client"

import { Pixelify_Sans } from 'next/font/google'

const font = Pixelify_Sans({ subsets: ['latin'], weight: ['400']})
export function Logo({size} : {size:string}){
    return <div className={`${font.className} text-${size}`}>Adt.</div>
}
