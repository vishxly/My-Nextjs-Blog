import { getAuthor } from "@/lib/firebase/author/read_server";
import { getCategory } from "@/lib/firebase/category/read_server";
import { getAllPosts } from "@/lib/firebase/post/read_server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PostListView() {
  const posts = await getAllPosts();
  if (!posts) {
    return (
      <div className="p-4 dark:text-white">
        <h3>Posts Not Available!</h3>
      </div>
    );
  }

  return (
    <section className="min-h-screen dark:bg-black">
      <div className="h-[50rem] w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5">
          {posts?.map((post, key) => {
            return <PostCard post={post} key={key} />;
          })}
        </div>
      </div>
    </section>
  );
}

export function PostCard({ post }) {
  return (
    <Link href={`/posts/${post?.id}`}>
      <div className="flex flex-col gap-3 p-4 rounded sm:p-5 dark:bg-black dark:text-white">
        <div className="relative">
          <div className="absolute flex justify-end w-full p-2 sm:p3">
            <CategoryCard categoryId={post?.categoryId} />
          </div>
          <img
            className="h-[150px] sm:h-[200px] w-full object-cover rounded"
            src={post?.imageURL}
            alt=""
          />
        </div>
        <h1 className="text-xl font-bold lg:text-xl sm:text-xl">
          {post?.title}
        </h1>
        <div className="flex flex-row items-center justify-between">
          <AuthorCard authorId={post?.authorId} />
          <h5 className="text-base text-gray-500">
            {post?.timestamp?.toDate()?.toLocaleDateString()}
          </h5>
        </div>
      </div>
    </Link>
  );
}

async function AuthorCard({ authorId }) {
  const author = await getAuthor(authorId);
  return (
    <div className="flex items-center gap-2">
      <img
        className="object-cover w-5 h-5 rounded-full sm:h-6 sm:w-6"
        src={author?.photoURL}
        alt=""
      />
      <h4 className="text-xs sm:text-sm">{author?.name}</h4>
    </div>
  );
}

async function CategoryCard({ categoryId }) {
  const category = await getCategory(categoryId);
  return (
    <div className="flex gap-1 sm:gap-2 items-center bg-white bg-opacity-60 rounded-full px-1 sm:px-2 py-0.5 sm:py-1">
      <img
        className="object-cover w-3 h-3 rounded-full sm:h-4 sm:w-4"
        src={category?.iconURL}
        alt=""
      />
      <h4 className="text-[10px] sm:text-xs text-gray-500">{category?.name}</h4>
    </div>
  );
}
