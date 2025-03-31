import Link from "next/link";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
const features = [
    {
        name: 'Стретчинг 2',
        description:
            'ключевая часть тренировок. Регулярные растяжки улучшают гибкость, снижают напряжение в мышцах и способствуют общему благополучию.',
        imageSrc: '/pexels-marta-wave-6454061.jpg',
        imageAlt: '',
    },
    {
        name: 'Нутрициология',
        description:
            'Нутрициология исследует влияние питания на здоровье. Нутрициологи помогают разрабатывать индивидуальные диеты, оптимизируя питание для поддержания оптимального состояния организма. Это ключевой аспект приверженности здоровому образу жизни.',
        imageSrc: '/pexels-destiawan-nur-agustra-1034940.jpg',
        imageAlt: '',
    },
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Products() {
    return (
        <div className="bg-white">
            <div className="mx-auto pt-4 px-4 max-w-screen-xl">
                <div className="mx-auto max-w-3xl mb-12 text-center">
                    <img className="inline-block my-8 h-28 w-28 rounded-full" src="/avatar.jpeg" alt="" />
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Алеся Шабан</h2>
                    <p className="mt-4 text-gray-500">
                        Здоровое тело - это гармония физического и психического благополучия. Однако оно не является статичным состоянием, а процессом, требующим постоянного внимания. Регулярная физическая активность поддерживает силу и гибкость мышц, укрепляет сердечно-сосудистую систему. Правильное питание обеспечивает организм необходимыми питательными веществами. Важен также психологический аспект: стресс меняет химический баланс, влияя на общее состояние. Работа над здоровьем - это усилия по улучшению образа жизни, включая сбалансированный рацион, активность и психоэмоциональное равновесие. Этот процесс индивидуален, требует терпения, но приводит к невероятным результатам в долгосрочной перспективе.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 grid-cols-1 text-center">
                    <div className="relative">
                        <img className="object-fill" src="/pexels-marta-wave-6454061.jpg" />
                        <div className="absolute left-0 right-0 top-0 bottom-0 bg-black hover:bg-black bg-opacity-50 hover:bg-opacity-70 flex flex-col justify-center items-center text-white hover:text-white p-2">
                            <div className="flex-1 flex items-center">
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight my-4 drop-shadow">Стретчинг</h3>
                                    <p className="text-sm drop-shadow">ключевая часть тренировок. Регулярные растяжки улучшают гибкость, снижают напряжение в мышцах и способствуют общему благополучию.</p>
                                </div>
                            </div>
                            <div className="py-4">
                                <Link href="/" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-gray-300 hover:bg-gray-800 hover:bg-opacity-50 focus:ring-0 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-800">Подробнее</Link>
                            </div>

                        </div>
                    </div>
                    <div className="relative">
                        <img className="object-fill" src="/pexels-destiawan-nur-agustra-1034940.jpg" />
                        <div className="absolute left-0 right-0 top-0 bottom-0 bg-black hover:bg-black bg-opacity-50 hover:bg-opacity-70 flex flex-col justify-center items-center text-white hover:text-white p-2">
                            <div className="flex-1 flex items-center">
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight my-4 drop-shadow">Нутрициология</h3>
                                    <p className="text-sm drop-shadow">Нутрициология исследует влияние питания на здоровье. Нутрициологи помогают разрабатывать индивидуальные диеты, оптимизируя питание для поддержания оптимального состояния организма. Это ключевой аспект приверженности здоровому образу жизни.</p>
                                </div>
                            </div>
                            <div className="py-4">
                                <Link href="/" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-gray-300 hover:bg-gray-800 hover:bg-opacity-50 focus:ring-0 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-800">Подробнее</Link>
                            </div>
                       </div>
                    </div>
                    <div>
                        <img className="object-fill" src="/pexels-marta-wave-6454061.jpg" />
                    </div>
                    <div>
                        <img className="object-fill" src="/pexels-destiawan-nur-agustra-1034940.jpg" />
                    </div>
                </div>

                {/* <div className="mt-16 space-y-16">
                    {features.map((feature, featureIdx) => (
                        <div
                            key={feature.name}
                            className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8"
                        >
                            <div
                                className={classNames(
                                    featureIdx % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-8 xl:col-start-9',
                                    'mt-6 lg:col-span-5 lg:row-start-1 lg:mt-0 xl:col-span-4'
                                )}
                            >
                                <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                                <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
                            </div>
                            <div
                                className={classNames(
                                    featureIdx % 2 === 0 ? 'lg:col-start-6 xl:col-start-5' : 'lg:col-start-1',
                                    'flex-auto lg:col-span-7 lg:row-start-1 xl:col-span-8'
                                )}
                            >
                                <div className="aspect-h-2 aspect-w-5 overflow-hidden rounded-lg bg-gray-100">
                                    <img src={feature.imageSrc} alt={feature.imageAlt} className="object-cover object-center" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    )
}
