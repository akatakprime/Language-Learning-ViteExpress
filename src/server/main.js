console.log("MAIN.JS ----------------------------------------------------")

import express from "express";
import ViteExpress from "vite-express";

//parsers
import bodyParser from 'body-parser'
var jsonParser = bodyParser.json()

//COOKIES
import cookieParser from 'cookie-parser';

//AUTH FUNCTIONS
import {new_acc, login_attempt, send_cookies, logout, save_set, send_sets, load_set} from './auth.js';

//CORS configuration -- accepting requests from client
import cors from 'cors';
const corsOptions = {
    //make sure you delete the extra slash at the end:
    origin: ["http://localhost:3000","http://localhost:5173", "https://language-learning-two.vercel.app"],
    credentials: true //be able to send cookies
};

const app = express();

app.use(cookieParser());

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

//ROUTING
app.post('/new', jsonParser, new_acc);
app.post('/login', jsonParser, login_attempt);
app.post('/save_set', jsonParser, save_set);
app.post('/load_set', jsonParser, load_set);

app.get('/cookies', send_cookies);
app.get('/logout', logout);
app.get('/get_sets', send_sets);

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);

//export default app;