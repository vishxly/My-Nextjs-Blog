"use client";

import { useAuthors } from "@/lib/firebase/author/read";
import Link from "next/link";

export default function AuthorsListView() {
  const { data, error, isLoading } = useAuthors();
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
    <section>
      <table className="w-full dark:bg-gray-900">
        <thead>
          <tr>
            <th className="border px-2 py-2 bg-blue-50 dark:bg-blue-900 dark:text-white dark:border-gray-700">
              Sr.
            </th>
            <th className="border px-2 py-2 bg-blue-50 dark:bg-blue-900 dark:text-white dark:border-gray-700">
              Photo
            </th>
            <th className="border px-2 py-2 bg-blue-50 dark:bg-blue-900 dark:text-white dark:border-gray-700">
              Name
            </th>
            <th className="border px-2 py-2 bg-blue-50 dark:bg-blue-900 dark:text-white dark:border-gray-700">
              Email
            </th>
            <th className="border px-2 py-2 bg-blue-50 dark:bg-blue-900 dark:text-white dark:border-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, key) => {
            return (
              <tr className="dark:text-white">
                <td className="border px-4 py-2">{key + 1}</td>
                <td className="border px-4 py-2">
                  {" "}
                  <img className="h-10" src={item?.photoURL} alt="" />{" "}
                </td>
                <td className="border px-4 py-2">{item?.name}</td>
                <td className="border px-4 py-2">{item?.email}</td>
                <td className="border px-4 py-2">
                  <Link href={`/admin/authors/form?id=${item?.id}`}>
                    <button className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm">
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
