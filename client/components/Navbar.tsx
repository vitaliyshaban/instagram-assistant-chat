"use client"

import { usePathname } from 'next/navigation'
import Link from "next/link";
import {Logo} from "@/components/images/images";
import { useState } from "react";
import Social from './Social';

interface Menu {
    name: string
    href: string
}

const menu: Menu[] = [
    // {
    //     name: 'Обо мне',
    //     href: '/about'
    // },
    // {
    //     name: 'Услуги',
    //     href: '/services'
    // },
    // {
    //     name: 'Статьи',
    //     href: '/articles'
    // },
]

export default function Navbar() {
    const pathname = usePathname();
    const [open, seOpen] = useState(false);
    return (
        <nav className="relative bg-black border-gray-200 dark:bg-gray-900 p-5 z-20">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                <Link href="/" className="flex items-center">
                    <Logo />
                </Link>
                <button onClick={() => open ? seOpen(false) : seOpen(true)} data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded={open}>
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className={`${open ? '' : 'hidden'} absolute left-0 right-0 z-10 block md:w-auto md:relative top-full md:flex items-center`} id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-0  md:bg-transparent md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-red dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 border-b border-gray-500">
                        {menu.map((link, i) => {
                            return (
                                <li key={i}>
                                    <Link href={link.href} className={`block py-2 pl-3 pr-4 md:bg-transparent  md:p-0 dark:text-white md:dark:text-blue-500 ${pathname === link.href ? "bg-[#2079A1] text-white md:text-[#2079A1]" : "text-white md:text-white"}`}>{link.name}</Link>
                                </li>
                            )
                        })}
                    </ul>
                    <div className="flex justify-center md:ml-5 my-5 md:my-0 md:mb-0">
                        <Social dark />
                    </div>
                </div>
            </div>
        </nav>
    )
}