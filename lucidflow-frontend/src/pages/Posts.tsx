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
          posts.map((post) => {
            const { id, title, body, images, timeCreated, timeModified } = post;

            return (
              <div key={id}>
                <h2>{title}</h2>
                <div>
                  <span>
                    Created: {timeCreated.toLocaleDateString()} at{" "}
                    {timeCreated.toLocaleTimeString()}
                  </span>
                  <span>
                    Last Modified: {timeModified.toLocaleDateString()} at{" "}
                    {timeModified.toLocaleTimeString()}
                  </span>
                </div>
                <p>{body}</p>
                <div id="post-images">
                  {images.map((image) => {
                    const { id, url, displayIndex } = image;

                    return <img key={id} src={url} alt={url} />;
                  })}
                </div>
                <button onClick={() => deletePost(id)}>Delete Post</button>
              </div>
            );
          })
        )}
      </div>
      <button>Create Post</button>
    </>
  );
}
