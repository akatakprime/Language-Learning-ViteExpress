//VITE
import { useState, useEffect } from 'react'

//ROUTING
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

//PAGES 
import Layout from './Pages/Layout.jsx' //the navbar
import CredentialsInput from './Pages/CredentialsInput.jsx'
import Home from './Pages/Home.jsx'
import Home_nouser from './Pages/Home_nouser.jsx'
import PageNotFound from './Pages/PageNotFound.jsx'

import NewFlashcards from './Pages/NewFlashcards.jsx'
import ReviewSets from './Pages/ReviewSets.jsx'

//FETCH
//import comms from './server_comms.jsx'
import axios from "axios";

import './App.css'

import { get_cookies } from './server_comms.jsx'

function App() {
  //keep track of cookies
  const [username, setUsername] = useState("");

  async function fetchCookies() {
      let user = await get_cookies()
      console.log("FetchCookies: ", user);
      if (user == undefined || user == "") {
          setUsername(undefined);
      } else {
          setUsername(user.username);
      }
  }
  //cookies end

  //track which page the user is on
  const user_location = useLocation().pathname;

  //keep track of whether the user is still logged in (updates every page the user visits)
  useEffect(() => {
    console.log('Location changed: ', user_location);
    fetchCookies();
  }, [user_location]);
  //not logged in
  if (username == undefined || username == "") {
    return (
      <div id="all">
      <Routes>
        <Route path="/" element={<Layout logged_in={false} setUsername={setUsername} />}>
          <Route index element={<Home_nouser />} />
          <Route path="new" element={<CredentialsInput path="new" text="Create a new account!" />} />
          <Route path="login" element={<CredentialsInput path="login" text="Log in" />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
      </div>
    )
  }
  //pages available once you are logged in
  /*
    <Route index element={<ReviewSets location={user_location} />} />
    <Route path="review" element={<ReviewSets location={user_location} />} />
  */
  return (
    <div id="all">
      <Routes>
        <Route path="/" element={<Layout logged_in={true} setUsername={setUsername} />}>
          <Route index element={<Home username={username} location={user_location} />} />
          <Route path="/dashboard" element={<Home username={username} location={user_location} />} >
            <Route index element={<Home username={username} location={user_location} />} />
            <Route path="new_flashcards" element={<NewFlashcards />} />

            <Route path="review_sets" element={<ReviewSets location={user_location} current_set={{}} />}>
              <Route index element={<ReviewSets location={user_location} />} />
              <Route path="review" element={<ReviewSets location={user_location} />} />
            </Route>

            <Route path="practice_sentences" element={<NewFlashcards />} />
            <Route path="settings" element={<NewFlashcards />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App