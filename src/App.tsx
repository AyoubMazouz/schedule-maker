import "./css/App.css";
import { Route, Routes } from "react-router-dom";
// Components.
import PrivateRoute from "./helpers/PrivateRoute";
import Alert from "./components/Alert";
import Footer from "./components/Footer";
import Model from "./components/Model";
import NavBar from "./components/NavBar";
// Pages.
import Contact from "./pages/Contact";
import Editor from "./pages/Editor";
import Documents from "./pages/Documents";
import Home from "./pages/Home";
import PublicUserPage from "./pages/settings/PublicUserPage";
import Profile from "./pages/settings/Profile";
import About from "./pages/About";
import Users from "./pages/settings/Users";
import Publish from "./pages/settings/Publish";
import Labels from "./pages/settings/Labels";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Alert />
      <Model />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        {/* PrivateRoutes */}
        <Route element={<PrivateRoute />}>
          <Route path="/settings/profile" element={<Profile />} />
          <Route path="/settings/users" element={<Users />} />
          <Route path="/settings/labels" element={<Labels />} />
          <Route path="/settings/publish" element={<Publish />} />
          <Route path="/settings/about" element={<About />} />
          <Route path="/editor/:docId" element={<Editor />} />
          <Route path="/documents" element={<Documents />} />
        </Route>
        <Route path="/publish/:username" element={<PublicUserPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
