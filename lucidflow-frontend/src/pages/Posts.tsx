import usePosts from "../hooks/usePosts";
import PostList from "../components/PostList";

export default function Posts() {
  const { posts, loading, error, loadPosts, deletePost } = usePosts();

  return (
    <div>
      <header className="p-4 fixed w-full bg-white border-gray-300 text-sm border-b flex justify-between">
        <h1 className="text-3xl">LucidFlow</h1>
        <button
          className="py-0.5 px-3 text-white text-md font-bold bg-gray-500 hover:bg-gray-600 rounded-md"
          onClick={loadPosts}
        >
          Refresh Posts
        </button>
      </header>
      <main className="mx-auto w-225 pt-28">
        <PostList
          posts={posts}
          isLoading={loading}
          errorMessage={error}
          onPostDelete={deletePost}
        ></PostList>
      </main>
    </div>
  );
}
