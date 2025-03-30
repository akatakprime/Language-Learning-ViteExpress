import { useState, useEffect } from 'react';
import axios from 'axios'

import './NewFlashcards.css'

//components

import { get_cookies, saveToServer } from '../server_comms.jsx'

/*
CURRYING:

handleChange = param => e => {
  // param is the argument you passed to the function
  // e is the event object that returned
};

*/

function Flashcard(props) {
    const [closeButtonVisible, setButton] = useState(true);
    const toggleButton = () => {
        setButton(!closeButtonVisible);
    };

    const [word, setWord] = useState("");
    const [definition, setDefinition] = useState("");

    const onChange = component => event => {
        if (component == "word") {
            setWord(event.target.value);
        } else if (component == "definition") {
            setDefinition(event.target.value);
        }
    };

    useEffect(() => { //waits for components to be asynchronously updated
        // state is guaranteed to be what you want
        const card_obj = {id:props.index, word:word, definition:definition}
        props.editCard(card_obj); //edit in parent
    }, [word, definition])

    return (
        <>
        <div className="hovertrigger" onMouseEnter={toggleButton} onMouseLeave={toggleButton}>
            <button className={closeButtonVisible ? 'hidden' : ''} id="remove" onClick={()=>props.removeCard(Number(props.index))} >X</button>
            <div className="flashcard" index={props.index}>
                <div>
                    <input type="text" className="word" onChange={(e)=>onChange("word")(e)} value={word} />
                    <div className="desc">Term</div>
                </div>
                <div>
                    <input type="text" className="definition" onChange={(e)=>onChange("definition")(e)} value={definition} />
                    <div className="desc">Definition</div>
                </div>
            </div>
        </div>
        </>
    )
}


function NewFlashcards(props) {
    const [setName, setSetName] = useState("");

    const [cardsJSON, setCardsJSON] = useState([{}]);

    const changeSetName = (event) => {
        setSetName(event.target.value);
    }

    const addCard = () => {
        let previousID = -1;
        if (cardsJSON.length > 0) {
            previousID = cardsJSON[cardsJSON.length-1].id;
        }
        var new_arr = cardsJSON.slice();
        new_arr.push({id:previousID+1, word:"", definition:""});
        console.log("Added new card: ", new_arr)
        setCardsJSON(new_arr);
    };

    const removeCard = (key_) => {
        console.log("Removing index ", key_)
        setCardsJSON(cardsJSON.toSpliced(key_,1)); //remove from array
    }

    const editCard = (card_obj) => {
        //find index of card with that id
        let index = 0;
        for (let i = 0; i < cardsJSON.length; i++) {
            const card = cardsJSON[i];
            if (card.id == card_obj.id) {
                index = i;
                break;
            }
        }
        var new_arr = cardsJSON.slice(); //make array copy
        new_arr[index] = card_obj; //edit entry
        console.log("Edited cardsJSON: " , new_arr);
        setCardsJSON(new_arr); //commit to cardsJSON
    }
    
    return (
        <>
            <button id="save-set" className="side-button" onClick={() => saveToServer({set_name: setName, cards: cardsJSON})}><label>Save</label></button>
            <button id="new-flashcard" className="side-button" onClick={addCard}><label>+</label></button>
            <div id="all-flashcards">
                <div className="h1">
                    New Set: 
                    <input id="set-title" type="text" onChange={changeSetName} value={setName}/>
                </div>
                <div id="flexbox-flashcards">
                    {cardsJSON.map((card, index) => (

                        <Flashcard key={index} index={index} removeCard={removeCard} editCard={editCard}/>
                      
                    ))}
                </div>
            </div>
        </>
    )
    
}

export default NewFlashcards