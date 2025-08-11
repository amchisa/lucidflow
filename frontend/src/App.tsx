import { Navigate, Route, Routes } from "react-router-dom";
import Posts from "./pages/Posts";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Routes>
        <Route path={"/"} element={<Navigate to="/posts" replace />} />
        <Route path={"posts"} element={<Posts />}></Route>
      </Routes>
      <Toaster
        position="bottom-left"
        containerClassName="text-sm"
        toastOptions={{ duration: 5000 }}
      />
    </>
  );
}
