import { CirclePlus } from "lucide-react";
import Link from "next/link";
import PostListView from "./components/PostListView";

export default function Page() {
  return (
    <main className="flex flex-col w-full gap-6 overflow-hidden lg:p-6 dark:bg-black dark:text-white">
      <div className="flex items-center justify-between">
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
