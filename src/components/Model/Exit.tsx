import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useDocument from "../../hooks/useDocument";
import { Button } from "../Button";
import { IcCancel, IcEx, IcTrue } from "../../helpers/icons";

const Exit = () => {
	const { model, setModel, docInfo, data, setAlert } = useGlobalContext();
	const { updateDocument } = useDocument();
	const { currUser } = useAuth();

	const navigate = useNavigate();

	return (
		<>
			<div>Do you want to save before exiting?</div>
			<div className="model-btn-container">
				<Button
					text="Yes"
					type="success"
					onClick={async () => {
						setModel(null);
						navigate(model.to);
						await updateDocument(data, docInfo);
						setAlert("success", "Document has been saved!");
					}}
					Icon={IcTrue}
				/>
				<Button
					text="No"
					onClick={() => {
						setModel(null);
						navigate(model.to);
					}}
					Icon={IcEx}
				/>
				<Button text="Cancel" onClick={() => setModel(null)} Icon={IcCancel} />
			</div>
		</>
	);
};

export default Exit;
