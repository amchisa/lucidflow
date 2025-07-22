import { type Post } from "../types/post";
import usePosts from "../hooks/usePosts";

export default function Posts() {
  const {
    posts,
    loading,
    error,
    loadPosts,
    createPost,
    updatePost,
    deletePost,
  } = usePosts();

  if (loading) {
    return <span>Loading posts...</span>;
  }

  if (error) {
    return <span>{error}</span>;
  }

  return (
    <>
      <div id="content">
        {posts.length === 0 ? (
          <span>No posts available.</span>
        ) : (
          posts.map((post: Post) => {
            const { id, title, body, timeCreated, timeModified } = post;

            return (
              <div key={id} className="my-5 p-2 border">
                <h2 className="text-xl">{title}</h2>
                <div>
                  <span>
                    Created: {timeCreated.toLocaleDateString()} at{" "}
                    {timeCreated.toLocaleTimeString()}
                  </span>
                  <span className="ml-2">
                    Last Modified: {timeModified.toLocaleDateString()} at{" "}
                    {timeModified.toLocaleTimeString()}
                  </span>
                </div>
                <p>{body}</p>
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-red-500 border px-2 py-0.5 hover:bg-red-500 hover:text-white mt-2"
                >
                  Delete Post
                </button>
              </div>
            );
          })
        )}
      </div>
      <button className="text-blue-500 border px-2 py-0.5 hover:bg-blue-500 hover:text-white">
        Create Post
      </button>
    </>
  );
}
