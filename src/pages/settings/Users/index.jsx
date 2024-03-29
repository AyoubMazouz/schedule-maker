import React from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import SettingsLayout from "../SettingsLayout";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import { IcLogin } from "../../../helpers/icons";
import { useUser } from "../../../hooks/useUser";
import usePageTitle from "../../../hooks/usePageTitle";

const Users = () => {
	usePageTitle("Users");

	const { setAlert } = useGlobalContext();
	const { signUp } = useUser();

	const [username, setUsername] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [type, setType] = React.useState("");

	const handleSubmit = async () => {
		try {
			const user = await signUp(username, email, password, type);
			setAlert("success", `user "${user.displayName}" has been created successfully`);
		} catch (e) {
			if (e.message === "name_taken")
				setAlert("warn", `the username ${username} is already taken, try another one!`);
			else setAlert("danger", "something went wrong, please try again");
		}
	};

	return (
		<SettingsLayout>
			<div className="p-2 space-y-2">
				<div className="space-y-3">
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
					<div>
						<label htmlFor="password" className="input-label">
							Type of user:
						</label>
						<div className="space-x-2">
							<input type="radio" name="type" onChange={() => setType("")} />
							<span>None</span>
						</div>
						<div className="space-x-2">
							<input type="radio" name="type" onChange={() => setType("admin")} />
							<span>Admin</span>
						</div>
						<div className="space-x-2">
							<input type="radio" name="type" onChange={() => setType("root")} />
							<span>Root</span>
						</div>
					</div>
					<Button type="success" text="submit" Icon={IcLogin} onClick={handleSubmit} />
				</div>
			</div>
		</SettingsLayout>
	);
};

export default Users;
