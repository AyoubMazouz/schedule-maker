import React from "react";
// Contexts.
import { useGlobalContext } from "../../Contexts/GlobalContext";
// Hooks.
import { useUser } from "../../hooks/useUser";
// Components.
import { Button } from "../Button";
import { IcCancel, IcLogin, IcMail, IcPwd } from "../../helpers/icons";
import { useAuth } from "../../Contexts/AuthContext";
import { Input } from "../Input";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setModel, setAlert } = useGlobalContext();
  const { currUser } = useAuth();
  const { signIn } = useUser();

  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const submitHandler = async () => {
    const res = await signIn(email, password);

    if (res) setAlert("success", `Welcome back "${currUser.username}!"`);
    else
      setAlert(
        "danger",
        "Email or Password is wrong, make sure you have the correct credentials and try again."
      );

    navigate("/documents");
    setModel(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-xl text-primary">LogIn</div>
          <div>Log Into Your Account.</div>
        </div>
        <Input
          type="email"
          label="email"
          Icon={IcMail}
          placeholder="Email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          label="password"
          Icon={IcPwd}
          placeholder="password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="model-btn-container">
        <Button
          text="Log In"
          type="success"
          onClick={submitHandler}
          Icon={IcLogin}
        />
        <Button text="Cancel" onClick={() => setModel(null)} Icon={IcCancel} />
      </div>
    </>
  );
};

export default Login;
