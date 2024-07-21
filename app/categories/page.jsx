import { getAllCategories } from "@/lib/firebase/category/read_server"
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const categories = await getAllCategories();

    return (
        <main className="p-4 sm:p-6 md:p-10 dark:bg-gray-900 min-h-screen dark:text-white">
            <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categories?.map((category, key) => {
                    return <CategoryCard category={category} key={key} />
                })}
            </section>
        </main>
    )
}

function CategoryCard({ category }) {
    return (
        <Link href={`/categories/${category?.id}`}>
            <div className="flex flex-col items-center justify-center gap-2 hover:bg-blue-50 rounded-xl p-4 sm:p-6 transition duration-300 ease-in-out transform hover:scale-105">
                <img className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-cover rounded-full" src={category?.iconURL} alt={category?.name} />
                <h1 className="font-bold text-center text-sm sm:text-base">{category?.name}</h1>
            </div>
        </Link>
    )
}