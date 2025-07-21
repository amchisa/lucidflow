import { useState, useEffect } from "react";

interface PostResponse {
  id: number;
  title: string;
  body: string;
  timeCreated: string;
  timeModified: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  timeCreated: Date;
  timeModified: Date;
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPosts = async () => {
      const response = await fetch("/api/posts");
      const parsedData = await response.json();
      const fetchedPosts: Post[] = parsedData.content.map(
        (rawPostData: PostResponse) => ({
          ...rawPostData,
          timeCreated: new Date(rawPostData.timeCreated),
          timeModified: new Date(rawPostData.timeModified),
        })
      );

      setPosts(fetchedPosts);
      setLoading(false);
    };

    loadPosts();
  }, []);

  if (loading) {
    return <span>Loading posts...</span>;
  }

  return (
    <>
      <div id="content">
        {posts.map((post: Post) => {
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
              <button className="text-red-500 border px-2 py-0.5 hover:bg-red-500 hover:text-white mt-2">
                Delete Post
              </button>
            </div>
          );
        })}
      </div>
      <button className="text-blue-500 border px-2 py-0.5 hover:bg-blue-500 hover:text-white">
        Create Post
      </button>
    </>
  );
};

export default Posts;
