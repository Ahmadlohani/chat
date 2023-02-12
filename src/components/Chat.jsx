import React from "react";
import camera from "../images/camera.png";
import user from "../images/adduser.png";
import more from "../images/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
	const { data } = useContext(ChatContext);
	return (
		<div className="chat">
			<div className="chatInfo">
				<span>{data.user?.displayName}</span>
				<div className="chatIcons">
					<img src={camera} alt="" />
					<img src={user} alt="" />
					<img src={more} alt="" />
				</div>
			</div>
			<Messages />
			<Input />
		</div>
	);
};

export default Chat;
