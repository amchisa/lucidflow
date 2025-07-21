import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h2 className="text-xl mt-5 mb-2">Links</h2>
      <ul className="pl-2">
        <li>
          <Link to="/posts">Posts</Link>
        </li>
      </ul>
    </>
  );
};

export default Home;
