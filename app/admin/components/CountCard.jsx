"use client"

import useCollectionCount from "@/lib/firebase/count"

export default function CountCard({ path, name, icon }) {
    const { data, isLoading, error } = useCollectionCount({ path: path })

    if (isLoading) {
        return <h2 className="text-center p-4 dark:text-white">Loading ...</h2>
    }

    if (error) {
        return <p className="text-center p-4 text-red-500 dark:text-red-400">{error}</p>
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 bg-gray-50 rounded-lg px-4 py-5 sm:px-6 sm:py-4 dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="text-blue-500 dark:text-blue-400">
                {icon}
            </div>
            <div className="text-center sm:text-left">
                <h1 className="font-bold text-gray-700 dark:text-white text-sm sm:text-base">{name}</h1>
                <h2 className="text-2xl sm:text-xl font-bold text-gray-900 dark:text-gray-100">{data}</h2>
            </div>
        </div>
    )
}