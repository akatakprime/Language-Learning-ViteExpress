import React, { useState, useEffect } from 'react';

import { Outlet, useNavigate } from "react-router-dom";

import './Home.css'

//components
import Button from '../Components/Button.jsx'

function Home(props) {
    //logged in
    console.log("Loading home: ", props.location)
    const navigate = useNavigate();

    const [flex_dummy, setflex_dummy] = useState(false);
    const [flex_content, setflex_content] = useState(false);

    useEffect(() => {
        if (props.location == "/") {
            setflex_content(false);
            setflex_dummy(false);
        } else {
            setflex_content(true);
            setflex_dummy(false);
        }
    }, [props.location]) //will only happen when location changes    

    const Animate = (event) => {
        setflex_dummy(true);
        setflex_content(false);
    }

    const endAnimate = (event) => {
        setflex_dummy(false);
        setflex_content(true);
    }

    const onButtonPressed = (params) => {
        if (params.origin != "/") {
            navigate(params.path);
            return;
        }
        Animate();
        //execute after animation is over
        setTimeout(function(){
            endAnimate();
            navigate(params.path);
        }, 500);
    }

    return (
        <div className="main">
            <h1>
                Welcome, {props.username}!
            </h1>
            <div className="container">
                <div className="content">
                    <div id="flexbox">
                        <Button onPressed={onButtonPressed} origin={props.location} title="New Flashcards" color="#f0f0f0" text_color="black" path="/dashboard/new_flashcards" />
                        <Button onPressed={onButtonPressed} origin={props.location} title="Review Sets" color="#c5d5c5" text_color="white" path="/dashboard/review_sets" />
                        <Button onPressed={onButtonPressed} origin={props.location} title="Practice Sentences" color="#9fa9a3" text_color="white" path="/dashboard/practice_sentences" />
                        <Button onPressed={onButtonPressed} origin={props.location} title="Settings" color="#e3e0cc" text_color="black" path="/dashboard/settings" />
                    </div>
                </div>
                <div className={flex_dummy ? 'dummy FlexAuto':'dummy'}></div>
                <div className={flex_content ? 'FlexAuto rightmargin':'dummy'}>
                    <Outlet  />
                </div>
            </div>
        </div>
    )
    
}

export default Home