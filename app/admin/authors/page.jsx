import { CirclePlus } from 'lucide-react';
import Link from 'next/link'
import AuthorsListView from './components/AuthorsListView';

export default function Page() {
    return (
        <main className="min-h-screen flex flex-col dark:bg-gray-900 w-full">
            <div className='flex-shrink-0 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 border-b dark:border-gray-700'>
                <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Authors</h1>
                <Link href={'/admin/authors/form'}>
                    <button className="w-full sm:w-auto flex justify-center gap-2 items-center bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded-full font-bold transition-colors duration-200">
                        <CirclePlus size={20} />
                        <span>Add</span>
                    </button>
                </Link>
            </div>
            <div className="flex-grow overflow-auto p-4 sm:p-6">
                <AuthorsListView />
            </div>
        </main>
    )
}