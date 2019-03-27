require("dotenv").config();
var keys=require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios=require("axios");
//var omdb = require('omdb');
//var bandsintown = require('bandsintown')("codingbootcamp");
var moment = require('moment');
var fs = require("fs");


//--- FUNCTIONS --- 

function concertThis(){
    //console.log("You selected concert-this");
    axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp").then(
        function(response){
            console.log(value +" will be playing at...")
            console.log("------------------------");

            for (var i=0; i<5; i++){
                var venue = response.data[i].venue.name;
                var location = response.data[i].venue.country;
                var dateI = response.data[i].datetime;
                var dateF = moment(dateI, "YYYY-MM-DD").format("DD-MM-YYYY");
                
    
                console.log ("Venue: "+venue);
                console.log("Location: "+location);
                console.log("Date: "+dateF);
                console.log("------------------------");
            }
        },
        function(error){
            console.log(error);
        }
    )
}
function spotifyThisSong(){
    //console.log("you selected spotify-this-song");
    if (value === undefined){
        value = "the sign ace of base";
    }
    spotify.search({type:"track", query: value}, function(err, data){
        if (err){
            console.log(err);
        }
        else{
            var artist = data.tracks.items[0].artists[0].name;
            var song = data.tracks.items[0].name;
            var album = data.tracks.items[0].album.name;
            var url = data.tracks.items[0].href;

            console.log("------------------------");
            console.log("Artist: "+artist);
            console.log("Song: "+song);
            console.log("Album: "+ album);
            console.log("Preview the song: "+url);
            console.log("------------------------");
        }
    });
}
function movieThis(){
    //console.log("you selected movie-this");
    if (value === undefined){
        value = "mr.nobody";
    }
    axios.get("https://www.omdbapi.com/?t="+value+"&y=&plot=short&apikey=trilogy").then(
        function(response){
            //console.log(response.data);
            var title=response.data.Title;
            var year=response.data.Year;
            var imdb=response.data.Ratings[0].Value;
            var tomatoes = response.data.Ratings[1].Value;
            var country = response.data.Country;
            var language = response.data.Language;
            var plot= response.data.Plot;
            var actors = response.data.Actors;

            console.log("------------------------");
            console.log("Title: "+title);
            console.log("Year: "+year);
            console.log("IMDB Rating: "+imdb);
            console.log("Rotten Tomatoes Rating: "+tomatoes);
            console.log("Country of Origin: "+country);
            console.log("Language"+language);
            console.log("Plot: "+plot);
            console.log("Actors: "+actors);
            console.log("------------------------");

        },
        function(error){
            if (error.response){
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
            }
            console.log(error.config);
    
        }
    );
}
function doWhatItSays(){
    //console.log("you selected so-what-it-says");
    fs.readFile("random.txt", "utf8", function(err, data){
        if (err){
            console.log(err);
        }
        else{
            //console.log(data);
            dataArr=data.split(",");
            //console.log(dataArr);
            if (dataArr[0]==="spotify-this-song"){
                value = dataArr[1];
                spotifyThisSong();
            }
        }
    });
}

//--- RUNTIME LOGIC ---

var action = process.argv[2];
var value = process.argv[3];

switch (action){
    case "concert-this":
    concertThis();
    break;
    case "spotify-this-song":
    spotifyThisSong();
    break;
    case "movie-this":
    movieThis();
    break;
    case "do-what-it-says":
    doWhatItSays();
    break;
    default: 
    console.log("Invalid Command. Please Try Again");
    break;
}