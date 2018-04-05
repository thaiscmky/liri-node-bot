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

var commands = {
    movieThis: function(movie) {
        var results = [];
        //Setup a default in case of null
        if (typeof movie === null)
            movie = "Mr. Nobody";

        var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&imdbRating=&tomatoRating=&country=&language=&plot=short&actors=&apikey=trilogy";

        request(queryURL, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var dataObj = JSON.parse(body);
                loopThroughResults([
                    `Title: ${dataObj.Title}`,
                    `Year: ${dataObj.Year}`,
                    `IMDB Rating: ${dataObj.imdbRating}`,
                    `Rotten Tomatoes Rating: ${dataObj.Ratings[1].Value}`,
                    `Country: ${dataObj.Country}`,
                    `Language: ${dataObj.Language}`,
                    `Actors: ${dataObj.Actors}`,
                    `Plot: ${dataObj.Plot}`
                ]);
            } else {
                console.log('Something went wrong and we could not retrieve the information from the server...');
                if (error) throw error;
            }
        });
    },
};

testCommands();

function testCommands(){

    console.log("#####################");
    console.log("Running initial tests");

    //User input should have at least one argument
    console.assert(userInputArr.length > 0, `You forgot to enter a command. Here are your options:\n
    - liri.js my-tweets //shows last 20 tweets\n
    - liri.js movie-this "Movie you want to search for" //gets information about movie\n
    - liri.js spotify-this-song "Song you want to search for" //gets information about the song\n
    - liri.js do-what-it-says //runs a list of commands based on chores.txt\n`);
    //User input should have no more than 2 arguments
    console.assert(userInputArr.length < 3, `Too many arguments; are you entering 'node liri.js [what-to-do] "what to search"'?`);
    //User asks to search for movie "Black Panther"
    console.log('The following should return an array with information on movie Black Panther. It returns:');
    issueCommand(['movie-this', 'Black Panther']);
    /*//User asks to search for song "Money Trees" on spotify
    console.log('The following should return an array with information on song "Money Trees". It returns:');
    issueCommand(['spotify-this-song', 'Money Trees']);
    //User asks to run chores.txt
    console.log('The following should return at least the results for a search in Spotify for "Hakuna Matata". It returns:');
    issueCommand(['do-what-it-says']);
    //User asks to see user tweets for app
    console.log('The following should return Liri\'s last 20 tweets. It returns:');
    issueCommand(['my-tweets']);*/

    console.log("End of initial tests");
    console.log("#####################");
}

function issueCommand(args){
    //convert lower-case-and-dashes to camelCasing
    args[0] = args[0].replace(/(-.)/g, function(match){
        return match[1].toUpperCase()
    });
    responseArray = commands[args[0]];
    if(typeof responseArray !== 'function'){
        console.log(`That's not a valid command. Here are your options:\n
            - liri.js my-tweets //shows last 20 tweets\n
            - liri.js movie-this "Movie you want to search for" //gets information about movie\n
            - liri.js spotify-this-song "Song you want to search for" //gets information about the song\n
            - liri.js do-what-it-says //runs a list of commands based on chores.txt\n`);
        return;
    }
        if(args.length > 1) responseArray.call(this, args[1])
        else responseArray.call(this);
}

function loopThroughResults(arr){
    arr.forEach(function(item){
        console.log(`${item}`);
    });
    console.log(`\n`);
}
