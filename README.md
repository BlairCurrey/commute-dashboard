# commute-dashboard
https://blairc-commute-dash.herokuapp.com/dashboard.html?lat1=40.844972&lon1=-74.079847&lat2=40.815750&lon2=-73.950133&depart_id=WR&destination_str=Hoboken

Alternatively, you can set the location and (in theory) the station from the launcher. https://blairc-commute-dash.herokuapp.com/. However, this only includes the station I was interested in and another as an example. The launcher is more of a prototype.

## Description
This is a simple web app to display useful information for commuting. The goal for this app was to pull in information for a particular user's reference while they get ready for work. The app pulls weather information from Darksky and train times from NJ Transit. I analyzed the weather data to come up with more relevant forecasts. In particular, the chance of rain for the day provided by Darksky is the chance of rain from 4AM on the current day to 4AM the next day. This means the chance of rain would include the hours that have already passed as well as many after the user will have returned. Instead, the app calculates the chance of rain within the next 12 hours as well as finding the hours with the highest probability and intensity.

## Demo
![Demo](https://i.imgur.com/UEuGwKF.gif)
