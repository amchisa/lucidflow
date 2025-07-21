import { Link } from "react-router-dom";

const Home = () => {
  return (
    <ul className="mt-5">
      <li>
        <Link to="/posts">Posts</Link>
      </li>
    </ul>
  );
};

export default Home;
