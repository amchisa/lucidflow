import { Navigate, Route, Routes } from "react-router-dom";
import Posts from "./pages/Posts";

export default function App() {
  return (
    <div className="min-h-screen min-w-screen antialiased scroll-smooth font-inter font-normal flex flex-col">
      <Routes>
        <Route path={"/"} element={<Navigate to="/posts" replace />} />
        <Route path={"posts"} element={<Posts />}></Route>
      </Routes>
    </div>
  );
}
