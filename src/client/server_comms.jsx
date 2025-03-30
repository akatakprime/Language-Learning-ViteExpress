import axios from "axios";

import { useNavigate } from "react-router-dom";

//vite doesn't use dotenv
//.env variable used by vite must be prefixed with VITE_
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

var proxyURL = import.meta.env.VITE_PROXY_URL;

console.log("Making requests with: ", SERVER_URL, proxyURL)

//FORM DATA
export async function send_creds(page) {
  /*
    3 possible returns:
    "OK" - login/new account successful
    "BLANK" - username or password left blank
    other error message - error occured

  */
  const u_input = document.getElementById("username_input")
  const p_input = document.getElementById("password_input")
  const username_ = u_input.value;
  const password_ = p_input.value;

  console.log("Sending credentials: Username: ", username_, " | Password: ", password_);

  if (username_ == ""){
    u_input.classList.add("required")
  } else if (u_input.classList.contains("required")) {
    u_input.classList.remove("required")
  }

  if (password_ == "") {
    p_input.classList.add("required")
  } else if (p_input.classList.contains("required")) {
    p_input.classList.remove("required")
  }

  if (username_ == "" || password_ == "") {
    return "BLANK";
  }

  let return_str = "";
  await axios.post(""+SERVER_URL+proxyURL+page, {
    username: username_,
    password: password_
  }, 
  {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(function (response) {
    //if it gets here with no errors, it means response.data = "OK"
    u_input.value = "";
    p_input.value = "";
    return_str = "OK";
  })
  .catch(function (error) {
    return_str = error;
  });

  return return_str;

}

export async function logout() {
  try {
    console.log("Logging out");
    axios.get(SERVER_URL+proxyURL+"logout", { withCredentials: true });
  } catch(error) {
    console.log("Error logging out: ", error);
  }
  
}

//COOKIES & FETCHING/SENDING DATA
function checkIfValidOutput(response) {
  if (response.data == undefined || (response.data instanceof String)) { //handles cases with error messages/not logged in
    return undefined;
  }
  return response.data;
}

export async function get_cookies() {
  const response = await axios.get(SERVER_URL+proxyURL+"cookies", { withCredentials: true });
  console.log("Cookies: ", response);
  return checkIfValidOutput(response);
}

export async function get_sets() {
  const response = await axios.get(SERVER_URL+proxyURL+"get_sets", { withCredentials: true });
  return checkIfValidOutput(response);
}

export async function get_set(set_id) {
  const response = await axios.post(SERVER_URL+proxyURL+"load_set", {set_id:set_id}, { 
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    } 
  });
  return checkIfValidOutput(response);
}

//SAVING TO SERVER
export async function saveToServer(setObj) {
  //where cardList = [ {word: "", definition: ""} ]
  console.log("Saving to server: ", setObj);
  const response = await axios.post(SERVER_URL+proxyURL+"save_set", setObj, 
  {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response;
}