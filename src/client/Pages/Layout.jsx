import { Outlet, Link } from "react-router-dom";

import './Layout.css'

import { logout } from '../server_comms.jsx'

import { useNavigate } from "react-router-dom";


function NavButton({ path, text, available, onclick }) {
  if (!available) {
    return <></>;
  }
  if (onclick) {
    return <Link to={path} onClick={onclick}>{text}</Link>;
  }
  return <Link className="link" to={path}>{text}</Link>;
}

function CustomNavButton({ path, text, available, onclick, App_UpdateFunct, App_NewValue }) {
  if (!available) {
    return <></>;
  }
  const navigate = useNavigate();
  //create new onClick function that executes onclick first and THEN reroutes
  async function new_onclick() {
    console.log("Onclick called")
    await onclick();
    if (App_UpdateFunct) {
      App_UpdateFunct(App_NewValue); //should update item in App.jsx (parent)
    }
    navigate(path);
  }

  return <div className="link" to={path} onClick={new_onclick}>{text}</div>;
}

function Layout(props) {
  //props: logged_in (t/f) setUsername (function)
  //some buttons will display or not display depending on whether the user is logged in
  return (
    <>
      <div id="navbar">
        <NavButton path="/" text="Home" available={true} />
        <NavButton path="/new" text="Create Account" available={!props.logged_in} />
        <NavButton path="/login" text="Log In" available={!props.logged_in} />
        <CustomNavButton path="/" text="Log Out" available={props.logged_in} onclick={logout} App_UpdateFunct={props.setUsername} App_NewValue="" />
      </div>
      <div id="outlet">
        <Outlet />
      </div>
    </>
    //Outlet renders current route selected (e.g. Home, NewAccount)
    //Links are for navigation

    //logout just links back to Home
  )
};

export default Layout;
