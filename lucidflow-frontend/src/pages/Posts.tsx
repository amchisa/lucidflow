import { useState, useEffect } from "react";
import { getPosts } from "../services/api.ts";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      setPosts(await getPosts());
    };

    loadPosts();
  }, []);

  return (
    <table className="mt-5 table-auto">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Body</th>
          <th>Time Created</th>
          <th>Time Modified</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => {
          const { id, title, body, timeCreated, timeModified } = post; // Object destructuring to extract fields

          return (
            <tr key={id}>
              <td>{id}</td>
              <td>{title}</td>
              <td>{body}</td>
              <td>{timeCreated}</td>
              <td>{timeModified}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Posts;
