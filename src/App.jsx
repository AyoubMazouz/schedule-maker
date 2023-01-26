import { Route, Routes, BrowserRouter } from "react-router-dom";
import Alert from "./components/Alert";
import Footer from "./components/Footer";
import Model from "./components/Model";
import NavBar from "./components/NavBar";
import { GlobalContextProvider } from "./Contexts/GlobalContext";
import "./css/App.css";
import Contact from "./pages/Contact";
import Editor from "./pages/Editor";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import { AuthProvider } from "./Contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <GlobalContextProvider>
                        <NavBar />
                        <Alert />
                        <Model />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/contact" element={<Contact />} />
                            {/* PrivateRoutes */}
                            <Route element={<PrivateRoute />}>
                                <Route
                                    path="/settings"
                                    element={<Settings />}
                                />
                                <Route
                                    path="/settings/:settingsTab"
                                    element={<Settings />}
                                />
                                <Route
                                    path="/editor/:docId"
                                    element={<Editor />}
                                />
                                <Route
                                    path="/documents"
                                    element={<Documents />}
                                />
                            </Route>
                        </Routes>

                        <Footer />
                    </GlobalContextProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
