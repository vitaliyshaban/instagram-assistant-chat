import Link from "next/link";
import {Logo} from "@/components/images/images";
import Social from "./Social";

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <Link href="https://flowbite.com/" className="flex items-center">
                            <Logo />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Обо мне</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Стаж</Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">Обучение</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Услуги</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline ">Фитнес</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Стретчинк</Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">Нутпициология</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Что-то еще</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">button</Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">button</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <Link href="/" className="hover:underline">alesia.fitness™</Link>. All Rights Reserved.
                    </span>
                    <div className="mt-4 sm:mt-0">
                        <Social />
                    </div>
                </div>
            </div>
        </footer>



    )
}