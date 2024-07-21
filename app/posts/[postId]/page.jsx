// app/posts/[postId]/page.jsx
import { getAuthor } from "@/lib/firebase/author/read_server";
import { getCategory } from "@/lib/firebase/category/read_server";
import { getPost } from "@/lib/firebase/post/read_server";
import PostContent from './PostContent';

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
    <main className="flex justify-center dark:bg-gray-900">
      <section className="flex flex-col gap-5 px-4 sm:px-8 md:px-16 py-6 sm:py-8 md:py-10 w-full max-w-[800px] dark:text-white">
        <CategoryCard categoryId={post?.categoryId} />
        <h1 className="text-xl sm:text-2xl font-bold dark:text-white">{post?.title}</h1>
        <img className="w-full object-cover rounded-lg" src={post?.imageURL} alt="" />
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <AuthorCard authorId={post?.authorId} />
          <h5 className="text-xs text-gray-500 dark:text-gray-400">{post?.timestamp?.toDate()?.toLocaleDateString()}</h5>
        </div>
        <PostContent content={post?.content} />
      </section>
    </main>
  );
}

async function AuthorCard({ authorId }) {
  const author = await getAuthor(authorId);
  return (
    <div className="flex gap-2 items-center">
      <img className="h-6 w-6 rounded-full object-cover" src={author?.photoURL} alt="" />
      <h4 className="text-sm text-gray-500 dark:text-gray-400">{author?.name}</h4>
    </div>
  );
}

async function CategoryCard({ categoryId }) {
  const category = await getCategory(categoryId);
  return (
    <div className="flex">
      <div className="flex gap-2 items-center bg-white bg-opacity-60 dark:bg-gray-800 dark:bg-opacity-60 rounded-full px-2 py-1 border dark:border-gray-700">
        <img className="h-4 w-4 rounded-full object-cover" src={category?.iconURL} alt="" />
        <h4 className="text-xs text-gray-500 dark:text-gray-400">{category?.name}</h4>
      </div>
    </div>
  );
}