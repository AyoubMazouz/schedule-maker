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
import { User } from "../../helpers/types";

const Signin = () => {
  const { setModel, setAlert } = useGlobalContext();
  const { currUser } = useAuth();
  const { signUp } = useUser();

  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async () => {
    try {
      const user: any = await signUp(username, email, password);
      setAlert(
        "success",
        `user "${user.displayName}" has been created successfully`
      );
      setModel(null);
      navigate("/documents");
      window.location.reload();
    } catch (e: any) {
      if (e.message === "name_taken")
        setAlert(
          "warn",
          `the username ${username} is already taken, try another one!`
        );
      else setAlert("danger", "something went wrong, please try again");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-xl text-primary">SignIn</div>
          <div>Create Your Account Now By Filling The Form Below</div>
        </div>
        <Input
          type="text"
          placeholder="username..."
          label="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="email"
          placeholder="email..."
          label="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="password..."
          label="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="model-btn-container">
        <Button
          text="Sign In"
          type="success"
          onClick={handleSubmit}
          Icon={IcLogin}
        />
        <Button text="Cancel" onClick={() => setModel(null)} Icon={IcCancel} />
      </div>
    </>
  );
};

export default Signin;
