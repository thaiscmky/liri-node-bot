var env = require("dotenv");
//initiate environment variables
env.config();

//load required packages
var fs = require("fs");
var request = require("request");
var twitter = require("twitter");
var spotify = require("node-spotify-api");