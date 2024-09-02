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
      <table className="w-full dark:bg-black">
        <thead>
          <tr>
            <th className="px-2 py-2 border bg-blue-50 dark:bg-black dark:text-white dark:border-gray-700">
              Sr.
            </th>
            <th className="px-2 py-2 border bg-blue-50 dark:bg-black dark:text-white dark:border-gray-700">
              Photo
            </th>
            <th className="px-2 py-2 border bg-blue-50 dark:bg-black dark:text-white dark:border-gray-700">
              Name
            </th>
            <th className="px-2 py-2 border bg-blue-50 dark:bg-black dark:text-white dark:border-gray-700">
              Email
            </th>
            <th className="px-2 py-2 border bg-blue-50 dark:bg-black dark:text-white dark:border-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, key) => {
            return (
              <tr className="dark:text-white">
                <td className="px-4 py-2 border">{key + 1}</td>
                <td className="px-4 py-2 border">
                  {" "}
                  <img className="h-10" src={item?.photoURL} alt="" />{" "}
                </td>
                <td className="px-4 py-2 border">{item?.name}</td>
                <td className="px-4 py-2 border">{item?.email}</td>
                <td className="px-4 py-2 border">
                  <Link href={`/admin/authors/form?id=${item?.id}`}>
                    <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded-full">
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
