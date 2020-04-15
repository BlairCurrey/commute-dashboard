# commute-dashboard
A simple web app to display useful information for commuting. The goal for this app was to pull in information for a particular user's reference while they get ready for work. The app pulls weather information from Darksky and train times from NJ Transit. I analyzed the weather data to come up with more relevant forecasts. In particular, the chance of rain for the day provided by Darksky is the chance of rain from 4AM on the current day to 4AM the next day. This means the chance of rain would include the hours that have already passed as well as many after the user will have returned. Instead, the app calculates the chance of rain within the next 12 hours as well as finding the hours with the highest probability and intensity.

## Demo
![Demo](https://i.imgur.com/UEuGwKF.gif)

## Notes
- To use the app, '.env_example' should be renamed to '.env' and the values in the file need to be defined. 
- The animated SVG's are from https://www.amcharts.com/free-animated-svg-weather-icons/
