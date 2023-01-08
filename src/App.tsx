import { Route, Routes, BrowserRouter } from "react-router-dom";
import Alert from "./components/Alert";
import Footer from "./components/Footer";
import Model from "./components/Model";
import NavBar from "./components/NavBar";
import { GlobalContextProvider } from "./Contexts/GlobalContext";
import "./css/App.css";
import Contact from "./pages/Contact";
import Editor from "./pages/Editor";
import Documents from "./pages/Editor/Documents";
import Settings from "./pages/Settings";
import Home from "./pages/Home";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <GlobalContextProvider>
                    <NavBar />
                    <Alert />
                    <Model />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route
                            path="/settings/:settingsTab"
                            element={<Settings />}
                        />
                        <Route path="/editor" element={<Editor />} />
                        <Route
                            path="/editor/documents"
                            element={<Documents />}
                        />
                        <Route
                            path="/editor/documents/:nameid"
                            element={<Editor />}
                        />
                    </Routes>
                    <Footer />
                </GlobalContextProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
