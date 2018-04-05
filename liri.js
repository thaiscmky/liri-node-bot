var env = require("dotenv");
//initiate environment variables
env.config();

//load required packages
var fs = require("fs");
var request = require("request");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var userInputArr = process.argv;
userInputArr.splice(0,2);

testCommands();

function testCommands(){

    console.log("#####################");
    console.log("Running initial tests");

    //User input should have at least one argument
    console.assert(userInputArr.length > 0, `You forgot to enter a command. Here are your options:\n
    - liri.js my-tweets //shows last 20 tweets\n
    - liri.js movie-this "Movie you want to search for" //gets information about movie\n
    - liri.js spotify-this-song "Song you want to search for" //gets information about the song\n
    - liri.js do-what-it-says //runs a list of commands based on chores.txt`);
    //User input should have no more than 2 arguments
    console.assert(userInputArr.length < 3, `Too many arguments; are you entering 'node liri.js [what-to-do] "what to search"'?`);
    //User asks to search for movie "Black Panther"
    console.log('The following should return an object with information on movie Black Panther. It returns:');
    console.log(issueCommand(['movie-this', 'Black Panther']));
    //User asks to search for song "Money Trees" on spotify
    console.log('The following should return an object with information on song "Money Trees". It returns:');
    console.log(issueCommand(['spotify-this-song', 'Money Trees']));
    //User asks to run chores.txt
    console.log('The following should return at least the results for a search in Spotify for "Hakuna Matata". It returns:');
    console.log(issueCommand(['do-what-it-says']));
    //User asks to see user tweets for app
    console.log('The following should return Liri\'s last 20 tweets. It returns:');
    console.log(issueCommand(['my-tweets']));

    console.log("End of initial tests");
    console.log("#####################");
}

