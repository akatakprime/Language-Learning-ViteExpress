import { Outlet, Link } from "react-router-dom";

import './Button.css'

export default function Button(props) {
	if (props.onPressed != undefined) {
		return (
				<div>
					<div onClick={()=>props.onPressed(props)} id="button" style={{backgroundColor:props.color, color:props.text_color}}>
						<div id="title">{props.title}</div>
					</div>
				</div>
			)
	}
	return (
			<div>
				<Link to={props.path} id="button" style={{backgroundColor:props.color, color:props.text_color}}>
					<div id="title">{props.title}</div>
				</Link>
			</div>
		)
}