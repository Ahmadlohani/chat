import {
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import React from "react";
import { auth, storage, db } from "../firebase";
import {
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import imgUpload from "../images/imgupload.png";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const displayName = e.target[0].value;
		const email = e.target[1].value;
		const password = e.target[2].value;
		const file = e.target[3].files[0];
		try {
			const resp = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const storageRef = ref(
				storage,
				`users/${displayName}`
			);
			const uploadTask = uploadBytesResumable(
				storageRef,
				file
			);
			uploadTask.on(
				(error) => {
					setLoading(false);
					toast.error(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(
						async (downloadURL) => {
							await updateProfile(resp.user, {
								displayName,
								photoURL: downloadURL,
							});
							await setDoc(
								doc(db, "users", resp.user.uid),
								{
									uid: resp.user.uid,
									displayName,
									email,
									photoURL: downloadURL,
								}
							);
							await setDoc(
								doc(db, "userChats", resp.user.uid),
								{}
							);
							setLoading(false);
							toast.success("Success");
							navigate("/");
						}
					);
				}
			);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className="formContainer">
			<div className="formWrapper">
				<span className="logo">React Chat</span>
				<span className="title">Register</span>
				<form onSubmit={handleSubmit}>
					<input type="text" placeholder="display name" />
					<input type="email" placeholder="email" />
					<input type="password" placeholder="password" />
					<input
						style={{ display: "none" }}
						type="file"
						id="file"
					/>
					<label htmlFor="file">
						<img src={imgUpload} alt="upload" />
						<span>Add an Avatar</span>
					</label>
					<button>
						{loading ? "Adding..." : "Sign Up"}
					</button>
				</form>
				<p>
					You do have an account?{" "}
					<Link to={"/login"}> Login</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
