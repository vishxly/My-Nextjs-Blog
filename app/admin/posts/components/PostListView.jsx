"use client";

import { usePosts } from "@/lib/firebase/post/read";
import Link from "next/link";
import "@/public/styles.css";
export default function PostListView() {
  const { data, error, isLoading } = usePosts();

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
    <section className="dark:bg-black min-h-screen">
      <table className="w-full post-table">
        <thead>
          <tr>
            <th className="border px-2 py-2 bg-blue-50 dark:bg-black dark:text-white">
              Sr.
            </th>
            <th className="border px-2 py-2 bg-blue-50 dark:bg-black dark:text-white">
              Image
            </th>
            <th className="border px-2 py-2 bg-blue-50 dark:bg-black dark:text-white">
              Title
            </th>
            <th className="border px-2 py-2 bg-blue-50 dark:bg-black dark:text-white">
              Slug
            </th>
            <th className="border px-2 py-2 bg-blue-50 dark:bg-black dark:text-white">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, key) => {
            return (
              <tr key={item.id} className="dark:bg-black dark:text-white">
                <td className="border px-4 py-2 dark:border-gray-700">
                  {key + 1}
                </td>
                <td className="border px-4 py-2 dark:border-gray-700">
                  <img className="h-10" src={item?.imageURL} alt="" />
                </td>
                <td className="border px-4 py-2 dark:border-gray-700">
                  {item?.title}
                </td>
                <td className="border px-4 py-2 dark:border-gray-700">
                  {item?.slug}
                </td>
                <td className="border px-4 py-2 dark:border-gray-700">
                  <Link href={`/admin/posts/form?id=${item?.id}`}>
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
