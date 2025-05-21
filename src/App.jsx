import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import CollectToken from "./pages/CollectToken";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<CollectToken />} path="/collectToken" />
    </Routes>
  );
}

export default App;
