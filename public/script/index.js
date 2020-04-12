class Page{
    constructor(){
        this.time = new Time();
    }

    async init(){
        this.weather = new Weather('/weather');
        await this.weather.init();
        console.log(await this.weather.data);
        this.rain = new Rain((await this.weather.data).end.hourly.data);
        console.log(this.rain)
    }

    render(){
        this.time.render();
        this.weather.render();
        this.rain.render();
    }
}

class Time{
    constructor(){
        this.set();
    }

    set(){
        this.date_time = new Date();
        this.date_str = Time.parseDate(this.date_time);
        this.time_str = Time.parseTime(this.date_time);
    }

    update(){
        this.set();
        this.render();
    }

    static parseTime(timestamp){
        return timestamp.toLocaleString().split(', ')[1]
    }

    static parseDate(timestamp){
        return timestamp.toLocaleString().split(', ')[0]
    }

    render(){
        document.getElementById('date').textContent = this.date_str;
        document.getElementById('time').textContent = this.time_str;
    }
}
class API{
    constructor(route){
        this.route = route;
        this.data = null;
    }

    async init(){
        //call after class instantiation - data cannot be fetched in constructor
        await this.get();
    }

    async get(){
        const response = await fetch(this.route);
        this.data = await response.json();
    }
}

class Weather extends API{

    render(){
        const start = this.data.start;
        const end = this.data.end;
        const end_high_time = Time.parseTime(new Date(end.daily.data[0].temperatureHighTime * 1000));

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

        //Fill precip-type classes
        let precip_type_classes = document.querySelectorAll('.end-precip-type')
        precip_type_classes.forEach(element => {
            element.textContent = end.daily.data[0].precipType;
        });
    }
}

class Rain{
    constructor(hourly_data, hours=12){
        this.hourly_data = hourly_data.slice(0, hours-1);
        this.rain_hourly_data = this.getRain();
        this.max_intensity = this.getMaxIntensity().intensity;
        this.max_intensity_time = this.getMaxIntensity().time;
        this.max_prob = this.getProbability().max;
        this.max_prob_time = this.getProbability().time;
        this.total_prob = this.getProbability().total
    }

    getRain(){
        //Could use this.hourly_data instead of building this data structure.
        //Using this data structure makes it much easier to debug max intensity/prob & times
        let rain_each_hour = [];
        this.hourly_data.forEach((hour) => {
            rain_each_hour.push({time: hour.time, no_rain_prob: 1 - hour.precipProbability, intensity: hour.precipIntensity});
        });
        return rain_each_hour
    }

    getMaxIntensity(){
        let intensity = 0;
        let time;
        this.rain_hourly_data.forEach(hour =>{
            if(hour.intensity > intensity){
                intensity = hour.intensity;
                time = hour.time;
            }
        })
        return {intensity: intensity, time: time}
    }

    getProbability(){
        let max_prob_no_rain = 1;
        let time;
        let product = 1;
        // find the max probability of NO RAIN out of all hours
        this.rain_hourly_data.forEach(hour =>{
            if(hour.no_rain_prob < max_prob_no_rain){
                max_prob_no_rain = hour.no_rain_prob;
                time = hour.time;
            }
            product = product * hour.no_rain_prob
        })
        // subtract no rain probability from 1 for probability that it DOES rain
        return {total: 1- product, max: 1 - max_prob_no_rain, time: time}
    }

    render(){
        document.getElementById('end-precip-prob-total').textContent = Math.round(this.total_prob * 100);
        //Hides if chance of rain is insignificant
        if(this.total_prob <= 0.01){
            document.getElementById('precip-conditional').style.display = 'none';
        } else {
        document.getElementById('end-precip-prob-high').textContent = Math.round(this.max_prob * 100);
        document.getElementById('end-precip-prob-time').textContent = Time.parseTime(new Date(this.max_prob_time * 1000));
        document.getElementById('end-precip-intensity-high').textContent = this.max_intensity;
        document.getElementById('end-precip-intensity-time').textContent = Time.parseTime(new Date(this.max_intensity_time * 1000));
        }
    }
}

document.addEventListener("DOMContentLoaded", async function(event) { 
    page = new Page();
    await page.init()
    await page.render()
    setInterval(function(){page.time.update();}, 1000);
  });