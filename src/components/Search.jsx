import React from "react";
import { useState } from "react";
import {
	collection,
	query,
	where,
	getDocs,
	getDoc,
	doc,
	setDoc,
	updateDoc,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
const Search = () => {
	const [search, setSearch] = useState("");
	const [user, setUser] = useState(null);
	const [err, setErr] = useState(false);
	const { currentUser } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);
	const handleSearch = async () => {
		try {
			const q = query(
				collection(db, "users"),
				where("displayName", "==", search)
			);
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				setUser(doc.data());
			});
		} catch (error) {
			console.log(error);
		}
	};
	const handleKey = async (e) => {
		e.code === "Enter" && handleSearch();
	};
	const handleSelect = async () => {
		const combinedId =
			currentUser.uid > user.uid
				? currentUser.uid + user.uid
				: user.uid + currentUser.uid;
		try {
			const res = await getDoc(
				doc(db, "chats", combinedId)
			);
			if (!res.exists()) {
				await setDoc(doc(db, "chats", combinedId), {
					messages: [],
				});
				await updateDoc(
					doc(db, "userChats", currentUser.uid),
					{
						[combinedId + ".userInfo"]: {
							uid: user.uid,
							displayName: user.displayName,
							photoURL: user.photoURL,
						},
						[combinedId + ".date"]: serverTimestamp(),
					}
				);
				await updateDoc(doc(db, "userChats", user.uid), {
					[combinedId + ".userInfo"]: {
						uid: currentUser.uid,
						displayName: currentUser.displayName,
						photoURL: currentUser.photoURL,
					},
					[combinedId + ".date"]: serverTimestamp(),
				});
			}
		} catch (error) {
			console.log(error);
		}
		dispatch({ type: "CHANGE_USER", payload: user });
		setUser(null);
		setSearch("");
	};
	return (
		<div className="search">
			<div className="searchForm">
				<input
					type="text"
					placeholder="Find a user"
					onKeyDown={handleKey}
					onChange={(e) => setSearch(e.target.value)}
					value={search}
				/>
			</div>
			{err && <span>Found no user</span>}
			{user && (
				<div className="userChat" onClick={handleSelect}>
					<img src={user.photoURL} alt="avt" />
					<div className="userChatInfo">
						<span>{user.displayName}</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default Search;
