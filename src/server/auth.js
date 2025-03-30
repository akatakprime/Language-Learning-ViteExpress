//HASHING
import bcrypt from 'bcrypt';
const saltRounds = 10;

//DATABASE CONNECTION
import 'dotenv/config';
import {neon} from "@neondatabase/serverless";
const DATABASE_URL = process.env.DATABASE_URL; //stored secretly
const sql = neon(`${DATABASE_URL}`);

//ENCRYPTION
import jwt from 'jsonwebtoken';
const PRIVATE_KEY = process.env.PRIVATE_KEY; //stored secretly

//COOKIES
import cookieParser from 'cookie-parser';

const TOKEN_EXPIRY_TIME = (24*60*60)*3; //3 DAYS

//UTILITY
async function doesAccountExist(username, password) {
    let original_account = await sql`SELECT * FROM credentials WHERE username=${username}`;
    if (original_account.length == 0) {
        return undefined;
    } else {
        const acc = original_account[0]
        if (password != undefined) {
            const salt = acc.salt
            const hash = bcrypt.hashSync(password, salt);
            if (hash != acc.password) {
                return 0;
            }
        }
        return acc;
    }
}

async function returnActiveSession(id) {
    const database_id = await sql`SELECT * FROM sessions WHERE id=${id}`;
    console.log("Database id: ", database_id);
    return database_id;
}

async function deleteSession(id) {
    await sql`DELETE FROM sessions WHERE id=${id}`;
}

async function getUserID(req) {
    const token = req.cookies.token;
    if (token == undefined) {
        //user not logged in
        throw new Error("User not logged in.")
    }
    const decoded = jwt.verify(token, PRIVATE_KEY);
    if (decoded == undefined) {
        //token has expired
        //remove user from active sessions
        deleteSession(req.cookies.user_data.id);
    }
    //check if there is a matching token in the active sessions table that matches the one in the request
    let database_id = await returnActiveSession(decoded.id);
    //throws error if there is no user with that session
    if (database_id.length == 1) { //someone is currently signed in with that ID
        return decoded.id;
    }
    throw new Error("Could not verify request integrity.");
}
//END UTILITY

//LOGIN/NEW ACCOUNT
export async function new_acc(req,res) {
    const username = req.body.username
    const password = req.body.password
    try {
        if (await doesAccountExist(username) != undefined) {
            //account with that username (and any password) already exists
            throw new Error("Account with that username already exists.");
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        await sql`INSERT INTO credentials (username, password, salt) VALUES (${username},${hash},${salt})`
        res.sendStatus(200)
        
    } catch(error) {
        res.send(error.message)
    }
}

export async function login_attempt(req,res) {
    console.log("Login attempt: ", req.body);
    const username_ = req.body.username;
    const password_ = req.body.password;
    try {
        const user_acc = await doesAccountExist(username_, password_)
        if (user_acc != undefined) {
            let user = {id: user_acc.id, username: user_acc.username};
            //console.log("PRIVATE key: ", PRIVATE_KEY);
            var login_token = jwt.sign(user, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: TOKEN_EXPIRY_TIME });
            console.log("Login token: ", login_token);
            
            //check if there already is a session for user (this will be due to a mistake)
            let current_sessions = await returnActiveSession(user.id);
            if (current_sessions.length > 0) {
                await deleteSession(current_sessions[0].id); //will delete ALL of them with that ID
            }

            //store user token & user ID in sessions table
            await sql`INSERT INTO sessions (id) VALUES (${user.id})`;

            //add cookie to user's session
            res.cookie("user_data", user,
            {
                httpOnly: true,
                sameSite: 'None',
                secure: true
            });

            res.cookie("token", login_token,
            {
                httpOnly: true,
                sameSite: 'None',
                secure: true
            });

            //send OK status
            res.sendStatus(200)
        } else {
            throw new Error("Invalid username/password combination.");
        }
    } catch(error) {
        console.log("Error inserting: ", error.message);
        res.send(error.message);
    }
}

export async function logout(req, res) {
    try {
        const cookies = req.cookies.user_data;
        console.log("Logout request: ", cookies);
        await deleteSession(cookies.id);
        res.clearCookie("user_data");
        res.sendStatus(200);
    } catch(error) {
        res.send(error.message);
    }
    
}
//END LOGIN

//COOKIES
export async function send_cookies(req, res) {
    try {
        //two cookies: user_data and token
        //we send back user data
        console.log("Cookies request! ", req.cookies)
        const user_data = req.cookies.user_data;
        const user_id = await getUserID(req); //will throw an error if no valid user IDs are found
        res.send(user_data);
    } catch(error) {
        //errors include TokenExpired, etc
        res.send(error.message);
    }
    
}
//END COOKIES

//FLASHCARD SETS
export async function save_set(req, res) {
    console.log("Received save_set: ", req.body);
    try {
        const user_id = await getUserID(req);
        const set_name = req.body.set_name;
        //set-id is automatically generated
        await sql`INSERT INTO users_to_sets (user_id, set_name) VALUES (${user_id},${set_name});`;
        var set_id = await sql`SELECT LASTVAL()`; //set ID format: [ { lastval: '2' } ]
        set_id = Number(set_id[0].lastval);
        //for some reason the cards are only accessible by index (not a for...in loop)
        for (let i = 0; i < req.body.cards.length; i++) {
            const card = req.body.cards[i];
            console.log("Setting card: ", card, " | word: ", card.word, " | definition: ", card.definition);
            const word = card.word;
            const def = card.definition;
            await sql`INSERT INTO sets_to_cards (set_id, word, definition) VALUES (${set_id},${word},${def})`;
        }
    } 
    catch(error) {
        console.log("Error saving set: ", error.message);
        res.send(error.message);
    }

}

export async function send_sets(req, res) {
    console.log("Sets request: ", req.cookies.user_data);
    try {
        const user_id = await getUserID(req);
        console.log("user_ID : ", user_id)
        const response = await sql`SELECT set_id, set_name FROM users_to_sets WHERE user_id=${user_id}`;
        console.log("Sets selected: ", response);
        res.send(response);
    }
    catch(error) {
        res.send(error.message);
    }
}

export async function load_set(req, res) {
    console.log("Set request: ", req.body);
    try {
        const user_id = await getUserID(req);
        const set_id = req.body.set_id;
        const response = await sql`SELECT word, definition, card_id FROM sets_to_cards WHERE set_id=${set_id}`;
        res.send(response);
    }
    catch(error) {
        res.send(error.message);
    }
}
//END FLASHCARDS