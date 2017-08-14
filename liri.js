// This file contains over 300 lines of codes.
// for your convenience, please collapse all functions at first then expand one at a time.

// globlas

var keys1 = require("./keys.js").twitter;
var twitter = require("twitter");
var keys = new twitter({
	consumer_key: keys1.consumer_key,
	consumer_secret: keys1.consumer_secret,
	access_token_key: keys1.access_token_key,
	access_token_secret: keys1.access_token_secret
});

var keys2 = require("./keys.js").spotify;
var spotify1 = require("node-spotify-api");
var spotify = new spotify1 ({
	id: keys2.id,
	secret: keys2.secret
});

var inquirer = require("inquirer");
var request = require("request");
var fs = require("fs");
var moment = require("moment");

var greetingwords = ["Hey, this is Liri, your personal assistant.\nI am actually a node.js version of siri, which sounds funny, but that's not my fault.",
	"Liri, your best personal assistant. Hao, Liri's owner, the growing coder.\nToday is a nice day! Hope I Liri can make today even better.",
	"Hey Paige (I wish that were you, if not, then hey Josh), Hao assigned me Liri to help you grade this assignment.\nHao said this assignment was more difficult than she thought,\nbut I have no idea, at least I look good, right?",
	"This is Liri, your personal assistant.\nThe girl designed me has been exhausted and is having rest, I'll help you instead.",
	"Hi there, this is Liri, your personal assistant.\nI was supposed to help you according to whatever you'll input to command line,\nbut Hao doesn't love this way. She said this way is not user-friendly, inquirer might be better.\nI agree. Please don't deduct her grade because of this.",
	"Good morning/noon/afternoon/evening there, this is Liri, a node.js version of Siri.\nUsing slash is not because of my owner's laziness,\njust because my potential users can come from anywhere of the world."
	];
var options = ["Tweet something via my owner's account", "View my owner's tweets", "Spotify a song", "Movie this", "Do what it says", "See how many greetings do I have", "Quit"];

// functions

// user interfaces
function greeting() {
	var index = Math.floor(Math.random() * greetingwords.length);
	console.log("\n-------------------------------------------------");
	console.log("\n" + greetingwords[index]);
	console.log("\n-------------------------------------------------");
	// console.log("\n" + "What can I do for you today?\n");
	inquirer.prompt([
		{
			type: "list",
			message: "What can I do for you today?\n",
			choices: options,
			name: "choice"
		}
		]).then(function(res) {
			switch(res.choice) {
				case options[0]:
					tweet();
					break;

				case options[1]:
					tweets();
					break;

				case options[2]:
					spotifyasong();
					break;

				case options[3]:
					moviethis();
					break;

				case options[4]:
					dowhat();
					break;

				case options[5]:
					randomgreet();
					break;

				case options[6]:
					console.log("\n-------------------------------------------------");
					console.log("\nThanks for using. See you next time.");
					console.log("\n-------------------------------------------------");
					process.exit();
					break;

				default:
					console.log("Oops, that is beyound my power.");
			}
		})
};

function whatelse() {
	console.log("\n-------------------------------------------------\n");
	inquirer.prompt([
		{
			type: "list",
			message: "What else can I do for you today?\n",
			choices: options,
			name: "choice"
		}
		]).then(function(res) {
			switch(res.choice) {
				case options[0]:
					tweet();
					break;

				case options[1]:
					tweets();
					break;

				case options[2]:
					spotifyasong();
					break;

				case options[3]:
					moviethis();
					break;

				case options[4]:
					dowhat();
					break;

				case options[5]:
					randomgreet();
					break;

				case options[6]:
					console.log("\n-------------------------------------------------");
					console.log("\nThanks for using. See you next time.");
					console.log("\n-------------------------------------------------");
					process.exit();
					break;

				default:
					console.log("Oops, that is beyound my power.");
			}
		})
};

// features

// tweet in terminal
function tweet() {
	inquirer.prompt([
		{
			type: "input",
			message: "What do you want to tweet via Hao's account?\nFor your own safety, please don't put anything strange, or she will kick you..I promise.\n",
			name: "post"
		}
	]).then(function(res) {
		keys.post('statuses/update', {status: res.post + "    ---sent from Liri"}, function(error, tweets, response) {
			if (error) {
				console.log(error);
			}
			console.log("\n-------------------------------------------------\n");
			console.log("Tweet \"" + res.post + "\" has been posted by @Huaiyin_xie already!");
			console.log("Go to https://twitter.com/Huaiyin_xie or choose \"View my owner\'s tweets\" below to check it.\n")
			whatelse();
		})
	})
};

// print my tweets
function tweets() {
	keys.get("statuses/user_timeline", {screen_name: 'huaiyin_xie'}, function(error, tweets, response) {
		if (!error) {
			for (i = tweets.length - 1; i >= tweets.length - 21; i--){
				if (i < 0) {
					break; // in case that the number of this account's tweets is less than 20
				}
				// use moment.js to standardize the creat_at passed by api. It is originally 7 hours later than PST for no reason
				// and moment.js here is not as smart as in the browser, so I have to pass a formated time to moment() function
				// lines below and before if statement are for this purpose

				var month = moment().format("YYYYMM");
				var a = tweets[i].created_at.substring(0, tweets[i].created_at.indexOf("+")).trim();
				var array = a.split(" ");
				var format = month.substring(0, 4) + "-" + month.substring(4) + "-" + array[2] + "T" + array[3] + ".000";
				var realtime = moment(format).subtract(7, "hours").format("MMMM Do YYYY, HH:mm:ss");
			
				if (tweets[i].retweeted) {
					console.log("\n-------------------------------------------------");
					console.log("\n" + realtime);
					console.log("**This tweet is a retweeted one.**\n");
					console.log(tweets[i].text);
				}
				else {
					console.log("\n-------------------------------------------------");
					console.log("\n" + realtime);
					console.log(tweets[i].text + "\n");
				}
			}
		}
		whatelse();
	})
};

function spotifyasong() {
	inquirer.prompt([
		{
			type: "input",
			message: "Please enter the title of the song you want me to spotify.\n",
			name: "song"
		}
	]).then(function(res) {
		spotify.search({type: "track", query: res.song}, function(err, data) {
			if (err) {
				return console.log(err);
			}
			
			if (data.tracks.items[0] === undefined) {
				spotify.search({type: "track", query: "The Sign"}, function(err, data) {
					console.log("\n-------------------------------------------------\n");
					console.log("I've done my best, but found nothing..wish you can enjoy this song.")
					console.log("\n-------------------------------------------------\n");
					console.log("Artist(s): " + data.tracks.items[5].artists[0].name);
					console.log("Title: " + data.tracks.items[5].name);
					console.log("Preview link: " + data.tracks.items[5].preview_url);
					console.log("Album: " + data.tracks.items[5].album.name);
				})
			}
			else {
					var random = Math.floor(Math.random() * 20);
					console.log("\n-------------------------------------------------\n");
					console.log("Dear user, this is the song you want to spotify.")
					console.log("\n-------------------------------------------------\n");
					console.log("Artist(s): " + data.tracks.items[random].artists[0].name);
					console.log("Title: " + data.tracks.items[random].name);
					if (data.tracks.items[random].preview_url !== null) {
						console.log("Preview link: " + data.tracks.items[random].preview_url);
					}
					else {
						console.log("Preview link: not available");
					}
					console.log("Album: " + data.tracks.items[random].album.name);
			}
			whatelse();
		})
	})
};

function moviethis() {
	inquirer.prompt([
		{
			type: "input",
			message: "Please enter the title of the movie you want me to search for you.\n",
			name: "movie"
		}
	]).then(function(input) {
		request("http://www.omdbapi.com/?t=" + input.movie + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
			var resp = JSON.parse(body);
			if (input.movie === "") {
				request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=40e9cece", function(error, response, body) {
					var res = JSON.parse(body);
					console.log("\n-------------------------------------------------");
					console.log("\nDear user, though you did not input anything valid, I, smart Liri, still have recommendation for you.\nActually neither I or my owner Hao have seen it before, this is Clark's mandatory recommendation.\nHao said if one day she becomes an insturctor,\nshe'll use the same way to recommend whatever she likes to students.")
					console.log("\n-------------------------------------------------\n");
					console.log("Title: " + res.Title);
					console.log("Year: " + res.Year);
					console.log("IMDB Rating: " + res.imdbRating);
					console.log("Rotten Tomatoes Rating: " + res.Ratings[1].Value);
					console.log("Country: " + res.Country);
					console.log("Language: " + res.Language);
					console.log("Plot: " + res.Plot);
					console.log("Actors: " + res.Actors);
					whatelse();
				})
			}

			else {
				console.log("\n-------------------------------------------------");
				console.log("\nDear user, this is what I could find for you.")
				console.log("\n-------------------------------------------------\n");
				console.log("Title: " + resp.Title);
				console.log("Year: " + resp.Year);
				console.log("IMDB Rating: " + resp.imdbRating);
				console.log("Rotten Tomatoes Rating: " + resp.Ratings[1].Value);
				console.log("Country: " + resp.Country);
				console.log("Language: " + resp.Language);
				console.log("Plot: " + resp.Plot);
				console.log("Actors: " + resp.Actors);
				whatelse();
			}
		})
	})
};

function dowhat() {
	fs.readFile("random.txt", "utf8", function(err, text) {
		if (err) {
			return console.log("Oops, something happened..")
		}
		var array0 = text.split("------");
		var randy = Math.floor(Math.random() * 2);
		var array1 = array0[randy].split(",");
		var index = Math.floor(Math.random() * array1.length);

		switch (randy) {
			case 0:
				spotify.search({type: "track", query: array1[index]}, function(err, data) {
					if (err) {
						return console.log(err);
					}
					var random = Math.floor(Math.random() * 20);
					console.log("\n-------------------------------------------------");
					console.log("\nDear user, thanks for trying this new feature.\nWhatever will be popped up are Hao's beloved songs or movies.\nNow spotifying: " + array1[index])
					console.log("\n-------------------------------------------------\n");
					console.log("Artist(s): " + data.tracks.items[random].artists[0].name);
					console.log("Title: " + data.tracks.items[random].name);
					if (data.tracks.items[random].preview_url !== null) {
						console.log("Preview link: " + data.tracks.items[random].preview_url);
					}
					else {
						console.log("Preview link: not available");
					}
					console.log("Album: " + data.tracks.items[random].album.name);
					whatelse();
				})
				break;

			case 1:
				// var title = array1[index].replace(" ", "+");
				request("http://www.omdbapi.com/?t=" + array1[index] + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
					var resp = JSON.parse(body);
					console.log("\n-------------------------------------------------");
					console.log("\nDear user, thanks for trying this new feature.\nWhatever will be popped up are Hao's beloved songs or movies.\nNow movieing: " + array1[index])
					console.log("\n-------------------------------------------------\n");
					console.log("Title: " + resp.Title);
					console.log("Year: " + resp.Year);
					console.log("IMDB Rating: " + resp.imdbRating);
					if (resp.Ratings[1] !== undefined) {
						console.log("Rotten Tomatoes Rating: " + resp.Ratings[1].Value);
					}
					else {
						console.log("Rotten Tomatoes Rating: not available");
					}
					console.log("Country: " + resp.Country);
					console.log("Language: " + resp.Language);
					console.log("Plot: " + resp.Plot);
					console.log("Actors: " + resp.Actors);
					whatelse();
				})
				break;
		}
	})
};

// print a greeting randomly
function randomgreet() {
	var index = Math.floor(Math.random() * greetingwords.length);
	console.log("\n-------------------------------------------------");
	console.log("\n** Lines below are selected randomly from my greeting database **")
	console.log("\n" + greetingwords[index]);
	whatelse();
};

// main
greeting();