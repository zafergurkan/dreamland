/**
 * Firebase function kullanarak http istekleri yakalayarak
 * firebse cloud store üzerinde işlemler yapmaya yarayan
 * nodejs express uygulaması
 * @author Zafer-Bilal-Gürkan <zafergurkan@outlook.com>
 * @createDate 09.05.2020
 *
 */

"use strict";

//nodejs and firebase stuff
const functions = require("firebase-functions");
const express = require("express");
const app = express();

//CORS stuff
const cors = require("cors");
app.use(cors({ origin: true }));

//import dream services
const { getAllDreams, addDream } = require("./services/dreams/main");

//import dream services
const {signup} = require('./services/users/main');

//dream stuff
app.get("/dreams", getAllDreams);
app.post("/dream", addDream);

//auth stuff
app.post("/signup",signup);


exports.api = functions.region("europe-west1").https.onRequest(app);
