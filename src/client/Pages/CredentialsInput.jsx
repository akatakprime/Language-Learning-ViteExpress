import React from 'react'

import './CredentialsInput.css'

import { send_creds } from '../server_comms.jsx'

import { useNavigate } from "react-router-dom";

async function onSubmit({path, goHome}) {
	event.preventDefault(); //onSubmit automatically provides the "event" argument. It is specifically called "event"
	console.log("onSubmit event: ", event);
	send_creds(path).then(response => {
    	console.log("Response:,,", response);
		if (response == "OK") {
			goHome();
		}
    })
}

function CredentialsInput(props) {
	const navigate = useNavigate();
	function goHome() {
		navigate("/");
	}

	return (

		<>
			<form id="credentials_input" onSubmit={(fields) => onSubmit({path:props.path, goHome:goHome})}>
				<h1>{props.text}</h1>
				<h2>Username:</h2>
				<input id="username_input" />
				<h2>Password:</h2>
				<input type="password" id="password_input" />
				<button type="submit">Ready</button>
			</form>
		</>

	)

}

export default CredentialsInput