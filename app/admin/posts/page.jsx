import { CirclePlus } from "lucide-react";
import Link from "next/link";
import PostListView from "./components/PostListView";

export default function Page() {
  return (
    <main className="flex flex-col w-full min-h-screen overflow-hidden dark:bg-black">
      <div className="flex flex-col items-start justify-between flex-shrink-0 gap-4 p-4 border-b sm:p-6 sm:flex-row sm:items-center sm:gap-0 dark:border-gray-700">
        <h1 className="font-bold dark:text-white">Posts</h1>
        <Link href={"/admin/posts/form"}>
          <button className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-blue-500 rounded-full">
            <CirclePlus />
          </button>
        </Link>
      </div>
      <PostListView />
    </main>
  );
}
