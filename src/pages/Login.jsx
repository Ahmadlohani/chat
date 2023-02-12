import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

const Login = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const email = e.target[0].value;
		const password = e.target[1].value;
		try {
			await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			navigate("/");
		} catch (error) {
			setLoading(false);
			toast.error("Wrong credentials");
			console.log(error);
		}
	};
	return (
		<div className="formContainer">
			<div className="formWrapper">
				<span className="logo">React Chat</span>
				<span className="title">Sign In</span>
				<form onSubmit={handleSubmit}>
					<input type="email" placeholder="email" />
					<input type="password" placeholder="password" />
					<button>
						{loading ? "Authenticating..." : "Sign In"}
					</button>
				</form>
				<p>
					You don't have an account?{" "}
					<Link to={"/register"}> Register</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
