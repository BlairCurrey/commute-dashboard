class Weather{
    constructor(route){
        this.route = route;
        this.data = null;
        this.hour_forecast = {};
        this.rain = {
            total_prob: null,
            max_prob: null,
            max_prob_time: null,
            max_intensity: null,
            max_intensity_time: null
        };
    }

    async init(){
        await this.get();
        this.predictRain();
        this.render();
    }
    
    async get(){
        const response = await fetch(this.route);
        this.data = await response.json();
        this.hourly_forecast = this.data.end.hourly.data.slice(0, 11); //gets next 12 hours
        console.log(this.data);
    }

    predictRain() {
        let hrs = []
        this.hourly_forecast.forEach((hour) => {
            hrs.push({time: hour.time, probability: 1 - hour.precipProbability, intensity: hour.precipIntensity})
        });
        console.log(hrs)

        let max_intensity = 0;
        let max_intensity_time;
        let max_prob_no_rain = 1;
        let max_prob_time;
        let product = 1;

        for(var i = 0; i < hrs.length; i++){
            //find max intensity out of all hours
            if(hrs[i].intensity > max_intensity){
                max_intensity = hrs[i].intensity;
                max_intensity_time = hrs[i].time;
            }
            //find the max probability of no rain out of all hours
            if(hrs[i].probability < max_prob_no_rain){
                max_prob_no_rain = hrs[i].probability;
                max_prob_time = hrs[i].time;
            }
            //find the total probability of no rain
            product = product * hrs[i].probability
        }
        this.rain.max_intensity = max_intensity;
        this.rain.max_intensity_time = this.parse(max_intensity_time);
        this.rain.max_prob = Number((1 - max_prob_no_rain).toFixed(2)); // (1 - probability of no rain) = probability of rain
        this.rain.max_prob_time = this.parse(max_prob_time);
        this.rain.total_prob = Number((1 - product).toFixed(2))
        console.log(this.rain)
    }

    parse(timestamp){
        const conv_timestamp = new Date(timestamp * 1000)
        const time_str = conv_timestamp.toLocaleString().split(', ')[1];
        return time_str
    }
    render(){
        const start = this.data.start;
        const end = this.data.end;
        const end_high_time = this.parse(end.daily.data[0].temperatureHighTime);

        //Current weather in start location
        document.getElementById('start-now-temp').textContent = start.currently.temperature;
        document.getElementById('start-now-precip-chance').textContent = start.currently.precipProbability * 100;
        document.getElementById('start-now-summary').textContent = start.currently.summary;
        document.getElementById('start-minutely-summary').textContent = start.minutely.summary;
        document.getElementById('start-precip-type').textContent = start.daily.data[0].precipType;

        //Day's weather in end location
        document.getElementById('end-hourly-summary').textContent = end.hourly.summary;
        document.getElementById('end-high').textContent = end.daily.data[0].temperatureHigh;
        document.getElementById('end-high-time').textContent = end_high_time;

        //Rain
        document.getElementById('end-precip-prob-total').textContent = Math.round(this.rain.total_prob * 100);
        document.getElementById('end-precip-prob-high').textContent = Math.round(this.rain.max_prob * 100);
        document.getElementById('end-precip-prob-time').textContent = this.rain.max_prob_time;
        document.getElementById('end-precip-intensity-high').textContent = this.rain.max_intensity;
        document.getElementById('end-precip-intensity-time').textContent = this.rain.max_intensity_time;
        let precip_type_classes = document.querySelectorAll('.end-precip-type')
        precip_type_classes.forEach(element => {
            element.textContent = end.daily.data[0].precipType;
        });
        //Hide if chance of rain is insignificant
        if(this.rain.total_prob <= 0.15){
            document.getElementById('precip-conditional').style.display = 'none';
        }
    }
}

class Time{
    constructor(date_id, time_id){
        this.date_id = date_id;
        this.time_id = time_id;
    }

    init(){
        const date_time = new Date();
        const parsed = this.parse(date_time);
        this.render(parsed.date, parsed.time)
    }

    parse(timestamp){
        const date_str = timestamp.toLocaleString().split(', ')[0];
        const time_str = timestamp.toLocaleString().split(', ')[1];
        return{date: date_str, time: time_str}
    }

    render(parsed_date, parsed_time){
        document.getElementById(this.date_id).textContent = parsed_date;
        document.getElementById(this.time_id).textContent = parsed_time;
    }
}

document.addEventListener("DOMContentLoaded", function(event) { 
    time = new Time('date', 'time');
    setInterval(function(){time.init();}, 1000);
    weather = new Weather('/weather');
    weather.init();
  });