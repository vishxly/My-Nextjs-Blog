import { getAuthor } from "@/lib/firebase/author/read_server";
import { getCategory } from "@/lib/firebase/category/read_server";
import { getPost } from "@/lib/firebase/post/read_server";
import PostContent from "./PostContent";

export async function generateMetadata({ params }) {
  const { postId } = params;
  const post = await getPost(postId);

  return {
    title: post?.title,
    openGraph: {
      images: [post?.imageURL],
    },
  };
}

export default async function Page({ params }) {
  const { postId } = params;
  const post = await getPost(postId);

  return (
    <main className="flex justify-center dark:bg-black">
      <section className="flex flex-col gap-5 px-4 sm:px-8 md:px-16 py-6 sm:py-8 md:py-10 w-full max-w-[800px] dark:text-white">
        <CategoryCard categoryId={post?.categoryId} />
        <h1 className="text-xl font-bold sm:text-2xl dark:text-white">
          {post?.title}
        </h1>
        <img
          className="object-cover w-full rounded-lg"
          src={post?.imageURL}
          alt=""
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center sm:gap-0">
          <AuthorCard authorId={post?.authorId} />
          <h5 className="text-xs text-gray-500 dark:text-gray-400">
            {post?.timestamp?.toDate()?.toLocaleDateString()}
          </h5>
        </div>
        <PostContent post={post} />
      </section>
    </main>
  );
}

async function AuthorCard({ authorId }) {
  const author = await getAuthor(authorId);
  return (
    <div className="flex items-center gap-2">
      <img
        className="object-cover w-6 h-6 rounded-full"
        src={author?.photoURL}
        alt=""
      />
      <h4 className="text-sm text-gray-500 dark:text-gray-400">
        {author?.name}
      </h4>
    </div>
  );
}

async function CategoryCard({ categoryId }) {
  const category = await getCategory(categoryId);
  return (
    <div className="flex">
      <div className="flex items-center gap-2 px-2 py-1 bg-white border rounded-full bg-opacity-60 dark:bg-black dark:bg-opacity-60 dark:border-gray-700">
        <img
          className="object-cover w-4 h-4 rounded-full"
          src={category?.iconURL}
          alt=""
        />
        <h4 className="text-xs text-gray-500 dark:text-gray-400">
          {category?.name}
        </h4>
      </div>
    </div>
  );
}
