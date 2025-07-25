import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Posts from "./pages/PostsPage";

export default function App() {
  return (
    <div className="h-screen w-screen antialiased scroll-smooth">
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Navigate to="/posts" replace />} />
          <Route path={"posts"} element={<Posts />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
