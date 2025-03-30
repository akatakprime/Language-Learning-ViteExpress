import { useState, useEffect } from 'react';
import axios from 'axios'

import { useNavigate } from "react-router-dom";

import './ReviewSets.css'

//components

import { get_set, get_sets } from '../server_comms.jsx'

function SetIcon(props) {
    const navigate = useNavigate();

    const set = props.set; 

    const onClick = async() => {
        const response = await get_set(set.set_id);
        let final_set = {set_info: set, cards: response}
        props.setCurrentSet(final_set);
        navigate("review");
    }

    return (
        <div className="set_icon" onClick={onClick}><label>{set.set_name}</label></div>
    )
}

function VocabCard(props) {
    const cards = props.cards;

    const [index, setIndex] = useState(0);

    const word = cards[index].word;
    const def = cards[index].definition;

    const [cardText, setCardText] = useState(word);

    const [flipped, setCardFlipped] = useState(false);

    const flipCard = () => {
        setCardFlipped(!flipped);
    }

    return (
        <>
        <div className="arrow">&lt;</div>
        <div className="view-flashcard" onClick={flipCard}>
            <div className={flipped ? "view-flashcard-inner flip":"view-flashcard-inner"}>
                <div className="front card-style">{word}</div>
                <div className="back card-style">{def}</div>
            </div>
        </div>
        <div className="arrow">&gt;</div>
        </>
    )
}

function ReviewSets(props) {
    const [sets, setSets] = useState([]);

    const [currentSet, setCurrentSet] = useState(props.current_set);

    async function getSets() {
        const sets_ = await get_sets();
        setSets(sets_);
    }

    useEffect(() => {
        console.log("current_set changed: ", props.location);
        if (props.location == "/dashboard/review_sets" || currentSet.set_info == undefined) { //if empty
            //go back to review home page
            getSets();
        }
    }, [props.location]);
    
    if (props.location == "/dashboard/review_sets" || currentSet.set_info == undefined) {
        //display buttons for each of your sets
        return (
            <div className="main">
                <div className="h1">Review Sets</div>
                <div id="all-sets">
                    
                    {sets.map((set, index) => (
                        <SetIcon set={set} key={index} setCurrentSet={setCurrentSet} />
                    ))}
                </div>
            </div>
        )
    }

    // {currentSet.cards.map((card, index) => (
    //                 <div className="view-flashcard" key={index}>{card.word}</div>
    //             ))}
    return (
        <div className="main">
            <div className="h1">{currentSet.set_info.set_name}</div>
            <div id="all-sets">
                <VocabCard cards={currentSet.cards} />
            </div>
        </div>
    )
    
}

export default ReviewSets