var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

var weather = require('weather');

var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/a5ca6ab9-c5b4-4cb9-a58f-206809f03f68?subscription-key=52fe63709bd845d689be815f04f143d3';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog)
console.log("We are now in a bot");
console.log("Try something like \"Will it rain in Jakarta?\"")

dialog.matches('GetWeather',[
	function(session, args, next)
	{
		console.log("Inside weather intent")
		var location = builder.EntityRecognizer.findEntity(args.entities, 'Location');
		console.log(session.dialogData);
		var weatherQuery = session.dialogData.weatherQuery =
		{
			location:location ? location.entity : null
		}
		console.log(weatherQuery);
		if(!location)
		{
			builder.Prompts.text(session, 'Which location?');
     		} 
		else 
		{
		    
		    next();
		} 
	}
	,
	function(session,results,next)
	{
		if(results.response)
		{
			var weatherResult;
			var weatherQuery = session.dialogData.weatherQuery;
			weatherQuery.location = capitalizeFirstLetter(results.response);
			console.log("Capitalizing first letter: ")
			console.log(weatherQuery.location);
			var tempLocation = weatherQuery.location;
			weather({location: tempLocation}), function(data)
			{
				console.log(data.temp);
				weatherResult = displayWeather(data.temp, data.high, data.low);
				console.log(weatherResult);
			}

		}
		else																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																							
		{
			next();
		}
	}
	,
	function(session)
	{
		console.log("We have a location, trying to ping Yahoo")
		var weatherQuery = session.dialogData.weatherQuery;
		var tempLocation = weatherQuery.location;
		console.log(tempLocation);
		weather({location: 'Melbourne'}, function(data)
		{
			console.log(data);
			weatherResult = displayWeather(data.temp, data.high, data.low);
			console.log("weatherResult");
		});
	}
	]);

dialog.matches('None',[
	function(session,args)
	{
	console.log("Inside none");
	}
	]);

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayWeather(currentTemp, highTemp, lowTemp)
{
	var weatherResult = "The current temperature is " + currentTemp;
	return weatherResult;
}
