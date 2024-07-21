import { getAuthor } from "@/lib/firebase/author/read_server";
import { getCategory } from "@/lib/firebase/category/read_server";
import { getAllPosts } from "@/lib/firebase/post/read_server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PostListView() {
  const posts = await getAllPosts();
  if (!posts) {
    return (
      <div className="dark:text-white p-4">
        <h3>Posts Not Available!</h3>
      </div>
    );
  }
  return (
    <section className="p-4 sm:p-6 md:p-10 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {posts?.map((post, key) => {
          return <PostCard post={post} key={key} />;
        })}
      </div>
    </section>
  );
}

export function PostCard({ post }) {
  return (
    <Link href={`/posts/${post?.id}`}>
      <div className="flex flex-col gap-3 p-4 sm:p-5 rounded dark:bg-gray-800 dark:text-white">
        <div className="relative">
          <div className="absolute flex justify-end w-full p-2 sm:p-3">
            <CategoryCard categoryId={post?.categoryId} />
          </div>
          <img
            className="h-[150px] sm:h-[200px] w-full object-cover rounded"
            src={post?.imageURL}
            alt=""
          />
        </div>
        <h1 className="font-bold text-sm sm:text-base">{post?.title}</h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <AuthorCard authorId={post?.authorId} />
          <h5 className="text-xs text-gray-500">
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
    <div className="flex gap-2 items-center">
      <img
        className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover"
        src={author?.photoURL}
        alt=""
      />
      <h4 className="text-xs sm:text-sm text-gray-500">{author?.name}</h4>
    </div>
  );
}

async function CategoryCard({ categoryId }) {
  const category = await getCategory(categoryId);
  return (
    <div className="flex gap-1 sm:gap-2 items-center bg-white bg-opacity-60 rounded-full px-1 sm:px-2 py-0.5 sm:py-1">
      <img
        className="h-3 w-3 sm:h-4 sm:w-4 rounded-full object-cover"
        src={category?.iconURL}
        alt=""
      />
      <h4 className="text-[10px] sm:text-xs text-gray-500">{category?.name}</h4>
    </div>
  );
}