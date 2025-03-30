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
    //origin: ["http://localhost:3000","http://localhost:5173", "https://language-learning-two.vercel.app"],
    origin: *,
    credentials: true //be able to send cookies
};

const app = express();
ViteExpress.config({ mode: "production" })

app.use(cookieParser());

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

//ROUTING
app.post('/api/new', jsonParser, new_acc);
app.post('/api/login', jsonParser, login_attempt);
app.post('/api/save_set', jsonParser, save_set);
app.post('/api/load_set', jsonParser, load_set);

app.get('/api/cookies', send_cookies);
app.get('/api/logout', logout);
app.get('/api/get_sets', send_sets);

ViteExpress.listen(app, 443, () =>
  console.log("Server is listening on port 443..."),
);

//export default app;