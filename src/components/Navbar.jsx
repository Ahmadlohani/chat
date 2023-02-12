import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const Navbar = () => {
	const { currentUser } = useContext(AuthContext);
	return (
		<div className="navbar">
			<span className="logo">Chat</span>
			<div className="user">
				<img src={currentUser.photoURL} alt="prf" />
				<span>{currentUser.displayName}</span>
				<button onClick={() => signOut(auth)}>
					Sign Out
				</button>
			</div>
		</div>
	);
};

export default Navbar;
