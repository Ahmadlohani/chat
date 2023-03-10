import React from "react";
import { useContext } from "react";
import clip from "../images/clip.png";
import image from "../images/image.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useState } from "react";
import {
	arrayUnion,
	doc,
	serverTimestamp,
	Timestamp,
	updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import {
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { storage, db } from "../firebase";
const Input = () => {
	const { currentUser } = useContext(AuthContext);
	const { data } = useContext(ChatContext);
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const handleSend = async () => {
		if (img) {
			const storageRef = ref(
				storage,
				`${currentUser.displayName}/messages/${uuid()}`
			);
			const uploadTask = uploadBytesResumable(
				storageRef,
				img
			);
			uploadTask.on(
				(error) => {
					console.log(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(
						async (downloadURL) => {
							await updateDoc(
								doc(db, "chats", data.chatId),
								{
									messages: arrayUnion({
										id: uuid(),
										text,
										senderId: currentUser.uid,
										img: downloadURL,
										date: Timestamp.now(),
									}),
								}
							);
						}
					);
				}
			);
		} else {
			await updateDoc(doc(db, "chats", data.chatId), {
				messages: arrayUnion({
					id: uuid(),
					text,
					senderId: currentUser.uid,
					date: Timestamp.now(),
				}),
			});
		}
		await updateDoc(doc(db, "userChats", currentUser.uid), {
			[data.chatId + ".lastMessage"]: {
				text,
			},
			[data.chatId + ".date"]: serverTimestamp(),
		});
		await updateDoc(doc(db, "userChats", data.user.uid), {
			[data.chatId + ".lastMessage"]: {
				text,
			},
			[data.chatId + ".date"]: serverTimestamp(),
		});
		setText("");
		setImg(null);
	};
	return (
		<div className="input">
			<input
				type="text"
				placeholder="Type something"
				onChange={(e) => setText(e.target.value)}
				value={text}
			/>
			<div className="send">
				<img src={clip} alt="clip" />
				<input
					type="file"
					id="file"
					style={{ display: "none" }}
					onChange={(e) => setImg(e.target.files[0])}
				/>
				<label htmlFor="file">
					<img src={image} alt="img" />
				</label>
				<button onClick={handleSend}>Send</button>
			</div>
		</div>
	);
};

export default Input;
