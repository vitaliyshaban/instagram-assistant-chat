"use client"

import Link from 'next/link';
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function VideoMain() {
    const { ref, inView, entry }: any = useInView();
    const [vh, setVh] = useState<any>(0);

    useEffect(() => {
        if (inView) entry?.target.play()
        resizeVh()
        function resizeVh() {
            setVh(window.innerHeight * 0.01);
        }
        window.addEventListener('resize', resizeVh);
        return () => {
            window.removeEventListener('resize', resizeVh);
        }
    });

    useEffect(() => {
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, [vh])
    return (
        <div className="relative after:absolute after:left-0 after:right-0 after:top-0 after:bottom-0 after:bg-gradient-to-b after:from-black after:to-transparent bg-black w-full overflow-hidden flex justify-center md:min-h-[320px]" style={{ height: 'calc((var(--vh, 1vh) * 100) - 80px)' }}>
            <div className="relative max-w-full after:absolute after:left-0 after:bottom-0 after:top-0 md:after:right-[80%] after:bg-gradient-to-r after:from-black after:to-transparent before:absolute md:before:left-[80%] before:bottom-0 before:top-0 before:right-0 before:bg-gradient-to-l before:from-black before:to-transparent before:z-10 h-full">
                <video className=" min-h-full" ref={ref} playsInline muted loop style={{ maxWidth: 'none', minWidth: '100%', height: 'calc((var(--vh, 1vh) * 100) - 80px)', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
                    <source src="/fitness.mp4" />
                </video>
                
            </div>
            <div className="absolute flex items-center justify-center text-center left-5 right-5 top-0 p-10 text-white h-full z-10">
                    <div className="py-8 px-4 mx-auto max-w-screen-md text-center lg:py-16">
                        <div>
                          <img className="inline-block mb-8 h-32 w-32 sm:h-44 sm:w-44 rounded-full" src="/avatar.jpeg" alt="" />
                        </div>
                        <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-100 sm:text-4xl lg:text-5xl dark:text-white">Здоровье через тренировки</h1>
                        <p className="mb-8 text-sm font-normal text-gray-300 sm:text-lg lg:text-xl dark:text-gray-400">Персонализированные тренировки и экспертная поддержка для достижения ваших фитнес-целей.</p>
                        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                            <Link href="#fitness-plan" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white bg-[#8860D0] rounded-lg border border-gray-700 hover:bg-opacity-70">
                              Ваш фитнес-план
                            </Link>
                        </div>
                    </div>
                </div>
        </div>
    )
}