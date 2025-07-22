import { BrowserRouter, Outlet, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Posts from "./pages/Posts";

export default function App() {
  return (
    <div id="App" className="p-4">
      <BrowserRouter>
        <header>
          <h1>LucidFlow</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/posts">Posts</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path={"/"} element={<Outlet />}>
              <Route index element={<Home />} />
              <Route path="posts" element={<Posts />} />
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
