import React from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { Button } from "../../components/Button";
import { IcClock, IcOpenSource, IcPuzzle, IcTrue } from "../../helpers/icons";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

const Home = () => {
	const { setModel } = useGlobalContext();
	const { currUser } = useAuth();
	const navigate = useNavigate();
	if (currUser) navigate("/documents");
	usePageTitle();
	return (
		<div className="">
			<div className="h-[320px] w-full">
				<video
					autoPlay
					loop
					className="object-cover w-full min-h-full"
					src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*uYT7SZwhJnUAAAAAAAAAAAAADgCCAQ"></video>
			</div>

			<div className="mt-32 text-center">
				<span className="relative font-bold text-7xl">
					<span className="absolute top-0 right-[-5%] rounded-lg bg-primary px-3 py-2 text-base text-white opacity-50 shadow-md">
						BETA
					</span>
					Schedule Maker
				</span>
			</div>

			<div className="flex justify-center px-2 mt-8">
				<div className="max-w-[75ch] text-center text-lg font-medium ">
					Effortlessly create polished schedules with our powerful scheduling tool. Say goodbye to
					the hassle of manual scheduling and hello to seamless, professional results.
				</div>
			</div>

			<div className="flex justify-center mt-8">
				<Button
					text="Get Started"
					Icon={IcTrue}
					type="primary"
					onClick={() => setModel({ type: "signin" })}
				/>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-10 px-2 mt-24">
				<div className="w-full max-w-[28rem] rounded-md border border-dark/50 p-6 shadow-md">
					<div className="flex items-center gap-x-4 text-primary">
						<IcPuzzle className="text-4xl" />
						<span className="text-lg font-semibold">Ease of use: </span>
					</div>
					<div className="mt-4 font-semibold indent-4 text-dark/50">
						Our scheduling app is designed with simplicity in mind, making it easy for anyone to
						create schedules quickly and effortlessly.
					</div>
				</div>
				<div className="w-full max-w-[28rem] rounded-md border border-dark/50 p-6 shadow-md">
					<div className="flex items-center gap-x-4 text-primary">
						<IcClock className="text-4xl" />
						<span className="text-lg font-semibold">Speed of creation: </span>
					</div>
					<div className="mt-4 font-semibold indent-4 text-dark/50">
						With our app, you can generate schedules in a fraction of the time it takes to do it
						manually. Our intuitive interface and automation tools streamline the process so you can
						focus on what matters most.
					</div>
				</div>
				<div className="w-full max-w-[28rem] rounded-md border border-dark/50 p-6 shadow-md">
					<div className="flex items-center gap-x-4 text-primary">
						<IcOpenSource className="text-4xl" />
						<span className="text-lg font-semibold">Open source nature: </span>
					</div>
					<div className="mt-4 font-semibold indent-4 text-dark/50">
						Our app is built on open source technology, which means that it's freely available for
						anyone to use, modify, and distribute.
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
