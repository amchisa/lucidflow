import usePosts from "../hooks/usePosts";
import PostList from "../components/PostList";

export default function Posts() {
  const { posts, loading, errorMessage, fetchPosts, deletePost } = usePosts();

  return (
    <>
      <header className="px-8 py-4 fixed w-full bg-white border-b border-gray-400 flex justify-between">
        <h1 className="text-3xl">LucidFlow</h1>
        <span>
          <button className="mr-5 py-2 px-3 text-white font-bold text-sm bg-blue-500 hover:bg-blue-600 rounded-md">
            Create Post
          </button>
          <button
            className="py-2 px-3 text-white font-bold text-sm bg-gray-500 hover:bg-gray-600 rounded-md"
            onClick={fetchPosts}
          >
            Refresh Posts (Temp)
          </button>
        </span>
      </header>
      <main className="mx-auto w-225 pt-30 pb-8">
        <PostList
          posts={posts}
          isLoading={loading}
          errorMessage={errorMessage}
          onPostDelete={deletePost}
        ></PostList>
      </main>
    </>
  );
}
