var env = require("dotenv");
//initiate environment variables
env.config();

//load required packages
var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify  = require("node-spotify-api");
var userInputArr = process.argv;
userInputArr.splice(0,2);

var commands = {
    movieThis: function(movie, msg) {
        //Setup a default in case of null
        if (movie === null)
            movie = "Mr. Nobody";

        var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&imdbRating=&tomatoRating=&country=&language=&plot=short&actors=&apikey=trilogy";

        request(queryURL, function (error, response, body) {
            if(msg !== null && typeof msg !== 'undefined') console.log(msg);
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
    myTweets: function(msg) {
        var twitterClient = new Twitter(keys.twitter);
        twitterClient.get('statuses/user_timeline', function (error, tweets, response) {
            if(msg !== null  && typeof msg !== 'undefined') console.log(msg);
            if(!error && response.statusCode === 200) {
                console.log(`Liri's last 20 tweets:`);
                tweets.forEach(function(tweet, i){
                   if(i > 20)
                       return;
                   console.log(`Author: ${tweet.user.name} | Date: ${tweet.created_at}`);
                   console.log('-----------------------');
                   console.log(typeof tweet.retweeted_status === null ? tweet.text : tweet.retweeted_status.text + "\n");
                    console.log('-----------------------');
                });
            } else {
                console.log('Something went wrong and we could not retrieve the information from the server...');
                if (error) throw error;
            }
        })
    },
    spotifyThisSong: function(song, msg){
        //Setup a default in case of null
        if (song === null)
            song = "The Sign";
        var spotifyAPI = new Spotify(keys.spotify);
        spotifyAPI.search({ type: 'track', query: song, limit: 1 }, function (error, data) {
            if(msg !== null && typeof msg !== 'undefined') console.log(msg);
            if(!error) {
                loopThroughResults([
                    `Artist: ${data.tracks.items[0].album.artists[0].name}`,
                    `Track: ${data.tracks.items[0].name}`,
                    `Preview: ${data.tracks.items[0].preview_url === null ? data.tracks.items[0].href : data.tracks.items[0].preview_url}`,
                    `Album: ${data.tracks.items[0].album.artists[0].name}`
                ]);
            } else {
                console.log('Something went wrong and we could not retrieve the information from the server...');
                if (error) throw error;
            }
        });
    },
    doWhatItSays: function(msg){

        fs.readFile(`./chores.txt`, "utf8", function(error, data) {
            if(!error){
                var list = data.split('\n');
                list.forEach(function(command){
                    var args = command.trim().split(',');
                    if(msg !== null && typeof msg !== 'undefined') issueCommand(args, msg);
                    else issueCommand(args);
                });

            } else {
                console.log('Something went wrong and we could not retrieve the information from the server...');
                if (error) throw error;
            }
        });
    }
};

testCommands();

function testCommands(){

    console.log("Running initial tests:\n##########################");

    //User input should have at least one argument
    console.assert(userInputArr.length > 0, `You forgot to enter a command. Here are your options:
    - liri.js my-tweets //shows last 20 tweets
    - liri.js movie-this "Movie you want to search for" //gets information about movie
    - liri.js spotify-this-song "Song you want to search for" //gets information about the song
    - liri.js do-what-it-says //runs a list of commands based on chores.txt\n##########################`);
    //User input should have no more than 2 arguments
    console.assert(userInputArr.length < 3, `Too many arguments; are you entering 'node liri.js [what-to-do] "what to search"'?\n##########################`);
    //User asks to search for movie "Black Panther"
    issueCommand(['movie-this', 'Black Panther'], 'The following should return an array with information on movie Black Panther.\n##########################');
    //User asks to search for song "Money Trees" on spotify
    issueCommand(['spotify-this-song', 'Money Trees'], 'The following should return an array with information on song "Money Trees"\n##########################');
    //User asks to run chores.txt
    issueCommand(['do-what-it-says'],'The following should return at least the results for a search in Spotify for "Hakuna Matata".\n##########################');
    //User asks to see user tweets for app
    issueCommand(['my-tweets'], 'The following should return Liri\'s last 20 tweets.\n##########################');
}

function issueCommand(args, msg){
    //convert lower-case-and-dashes to camelCasing
    args[0] = args[0].replace(/(-.)/g, function(match){
        return match[1].toUpperCase()
    });
    responseArray = commands[args[0]];
    if(typeof responseArray !== 'function'){
        console.log(`That's not a valid command. Here are your options:
            - liri.js my-tweets //shows last 20 tweets
            - liri.js movie-this "Movie you want to search for" //gets information about movie
            - liri.js spotify-this-song "Song you want to search for" //gets information about the song
            - liri.js do-what-it-says //runs a list of commands based on chores.txt
            `);
        return;
    }
        if(args.length > 1) responseArray.call(this, args[1], msg);
        else responseArray.call(this, msg);

}

function performRequestedCommand(command){
    if(command.length > 0){
        switch(command[0]){
            case 'my-tweets':
                break;
            case 'movie-this':
                break;
            case 'spotify-this-song':
                break;
            case 'do-what-it-says':
                break;
        }
    } else {
        console.log(`You forgot to enter a command. Here are your options:
    - liri.js my-tweets //shows last 20 tweets
    - liri.js movie-this "Movie you want to search for" //gets information about movie
    - liri.js spotify-this-song "Song you want to search for" //gets information about the song
    - liri.js do-what-it-says //runs a list of commands based on chores.txt`);
    }
}

function loopThroughResults(arr){
    arr.forEach(function(item){
        console.log(`${item}`);
    });
    console.log(`\n`);
}
