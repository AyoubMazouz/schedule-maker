import { Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import Home from "../pages/Home";

export default function PrivateRoute() {
  const { currUser } = useAuth();
  return currUser ? <Outlet /> : <Home />;
}
