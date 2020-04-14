# commute-dashboard
A simple web app to display useful information for commuting. The goal for this app is to pull in information one would want to know as they are getting ready to leave for work. The app pulls weather information from Darksky and train times from NJ Transit. I analyzed the weather data to come up with more relevant forecasts. In particular, the chance of rain for the day provided by Darksky is the chance of rain from 4AM on the current day to 4AM the next day. So this includes time that has already passed, as well as time very late in the night which makes the chance of rain rather unhelpful. Instead, I found the chance of rain within the next 12 hours as well as finding the hour with the highest probability and intensity. The animated SVG's are from https://www.amcharts.com/free-animated-svg-weather-icons/

![UI](https://i.imgur.com/VctBrz0.jpg)



## Notes
To use the app, '.env_example' should be renamed to '.env' and the values in the file need to be defined. 
