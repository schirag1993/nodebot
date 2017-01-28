var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

var weather = require('weather');

var model = '<your models url>';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog)

dialog.matches('GetWeather',[
	function(session, args, next)
	{
		var location = builder.EntityRecognizer.findEntity(args.entities, 'Location');
		var weatherQuery = session.dialogData.weatherQuery =
		{
			location:location ? location.entity : null
		}
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
			weatherQuery.location = capitalizeFirstLetter(results.response);
			var tempLocation = weatherQuery.location;
			weather({location: tempLocation}), function(data)
			{
				weatherResult = displayWeather(data.temp, data.high, data.low);
			}

		}
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