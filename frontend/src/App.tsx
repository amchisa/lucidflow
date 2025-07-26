import { Navigate, Route, Routes } from "react-router-dom";
import Posts from "./pages/Posts";

export default function App() {
  return (
    <div className="h-screen w-screen antialiased scroll-smooth">
      <Routes>
        <Route path={"/"} element={<Navigate to="/posts" replace />} />
        <Route path={"posts"} element={<Posts />}></Route>
      </Routes>
    </div>
  );
}
