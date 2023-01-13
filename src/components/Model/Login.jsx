import React from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";

const Login = () => {
    const { model, setModel, setAlert } = useGlobalContext();
    const { login } = useAuth();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const snapshot = await login(email, password);
            setAlert({
                type: "success",
                message: `Welcome back "${snapshot.user.email}!"`,
            });
        } catch (e) {
            setAlert({
                type: "danger",
                message:
                    "Something went wrong, make sure you have the correct credentials and try again.",
            });
        }
        setModel(null);
    };

    return (
        <div className="fixed top-[4rem] left-[50%] z-40 w-full max-w-[600px] translate-x-[-50%] px-4">
            <div
                className={`w-full rounded-lg border-2 border-dark/25 bg-light p-4 shadow-lg`}
            >
                <div>{model.message}</div>
                <form className="space-y-4" onSubmit={submitHandler}>
                    <div className="text-center">
                        <div className="text-xl text-primary">LogIn</div>
                        <div>Only Authorized Admins are allowed here</div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <label className="input-label" htmlFor="email">
                            Email:
                        </label>
                        <input
                            className="input max-w-[26rem]"
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <label className="input-label" htmlFor="password">
                            Password:
                        </label>
                        <input
                            className="input max-w-[26rem]"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between">
                        <button className="btn" type="submit">
                            Submit
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={(e) => setModel(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
