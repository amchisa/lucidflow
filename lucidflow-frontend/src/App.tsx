import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Posts from "./pages/Posts";

const App = () => {
  return (
    <div id="App" className="p-4">
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="posts" element={<Posts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
