import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <header>
        <h1 className="text-3xl">
          <Link to="/">LucidFlow</Link>
        </h1>
      </header>
      <main>
        <Outlet></Outlet>
      </main>
    </>
  );
};

export default Layout;
