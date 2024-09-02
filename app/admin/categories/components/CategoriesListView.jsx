"use client";

import { useCategories } from "@/lib/firebase/category/read";
import Link from "next/link";

export default function CategoriesListView() {
  const { data, error, isLoading } = useCategories();

  if (isLoading) {
    return <h1 className="dark:text-white">Loading...</h1>;
  }
  if (error) {
    return <h1 className="dark:text-white">{error}</h1>;
  }
  if (!data) {
    return <h1 className="dark:text-white">Data not found!</h1>;
  }

  return (
    <section className="dark:bg-black">
      <table className="w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2 bg-blue-50 dark:bg-black dark:text-white dark:border-gray-700">
              Sr.
            </th>
            <th className="border px-4 py-2 bg-blue-50 dark:bg-black dark:text-white dark:border-gray-700">
              Icon
            </th>
            <th className="border px-4 py-2 bg-blue-50 dark:bg-black dark:text-white dark:border-gray-700">
              Name
            </th>
            <th className="border px-4 py-2 bg-blue-50 dark:bg-black dark:text-white dark:border-gray-700">
              Slug
            </th>
            <th className="border px-4 py-2 bg-blue-50 dark:bg-black dark:text-white dark:border-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, key) => {
            return (
              <tr key={item.id} className="dark:bg-black">
                <td className="border px-4 py-2 dark:border-gray-700 dark:text-white">
                  {key + 1}
                </td>
                <td className="border px-4 py-2 dark:border-gray-700">
                  <img className="h-10" src={item?.iconURL} alt="" />
                </td>
                <td className="border px-4 py-2 dark:border-gray-700 dark:text-white">
                  {item?.name}
                </td>
                <td className="border px-4 py-2 dark:border-gray-700 dark:text-white">
                  {item?.slug}
                </td>
                <td className="border px-4 py-2 dark:border-gray-700">
                  <Link href={`/admin/categories/form?id=${item?.id}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-1 text-sm transition-colors duration-200">
                      Action
                    </button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
