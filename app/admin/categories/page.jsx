import { CirclePlus } from 'lucide-react';
import Link from 'next/link'
import CategoriesListView from './components/CategoriesListView';

export default function Page() {
    return (
        <main className="flex flex-col w-full min-h-screen dark:bg-black dark:text-white">
            <div className='flex flex-col items-start justify-between flex-shrink-0 gap-4 p-4 border-b sm:p-6 sm:flex-row sm:items-center sm:gap-0 dark:border-gray-700'>
                <h1 className="text-xl font-bold sm:text-2xl dark:text-white">Categories</h1>
                <Link href={'/admin/categories/form'}>
                    <button className="flex items-center justify-center w-full gap-2 px-4 py-2 font-bold text-white transition-colors duration-200 bg-blue-500 rounded-full sm:w-auto hover:bg-blue-600">
                        <CirclePlus size={20} />
                        <span>Add</span>
                    </button>
                </Link>
            </div>
            <div className="flex-grow p-4 overflow-auto sm:p-6">
                <CategoriesListView />
            </div>
        </main>
    )
}
