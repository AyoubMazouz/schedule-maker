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
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Publish from "./pages/Publish";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Alert />
      <Model />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/download/:userId" element={<Publish />} />
        {/* PrivateRoutes */}
        <Route element={<PrivateRoute />}>
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/:settingsTab" element={<Settings />} />
          <Route path="/editor/:docId" element={<Editor />} />
          <Route path="/documents" element={<Documents />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
