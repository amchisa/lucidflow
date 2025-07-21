const getPosts = async () => {
  const response = await fetch("/api/posts"); // Raw response data (contains additional information)
  return await response.json(); // Response data formatted to json
};

export { getPosts };
