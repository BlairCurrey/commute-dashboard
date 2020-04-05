class Weather{
    constructor(route){
        this.route = route;
        this.data = null;
    }

    async init(){
        await this.get();
        this.render();
    }
    async get(){
        const response = await fetch(this.route);
        this.data = await response.json();
        console.log(this.data);
    }

    parse(timestamp){
        const time_str = timestamp.toLocaleString().split(', ')[1];
        return time_str
    }
    render(){
        const start_now = this.data.start.currently;
        const start_day = this.data.start.daily;
        const start_daily_high_time = this.parse(new Date(start_day.data[0].temperatureHighTime * 1000));
        const start_daily_low_time = this.parse(new Date(start_day.data[0].temperatureLowTime * 1000));
        const end_now = this.data.end.currently;
        const end_day = this.data.end.daily;
        const end_daily_high_time = this.parse(new Date(end_day.data[0].temperatureHighTime * 1000));
        const end_daily_low_time = this.parse(new Date(end_day.data[0].temperatureLowTime * 1000));

        document.getElementById('start-temp').textContent = start_now.temperature;
        document.getElementById('start-precip-chance').textContent = start_now.precipProbability * 100;
        document.getElementById('start-summary').textContent = start_now.summary;
        document.getElementById('start-temp-high').textContent = start_day.data[0].temperatureHigh;
        document.getElementById('start-temp-high-time').textContent = start_daily_high_time;
        document.getElementById('start-temp-low').textContent = start_day.data[0].temperatureLow;
        document.getElementById('start-temp-low-time').textContent = start_daily_low_time;
        
        document.getElementById('end-temp').textContent = end_now.temperature;
        document.getElementById('end-precip-chance').textContent = end_now.precipProbability * 100;
        document.getElementById('end-summary').textContent = end_now.summary;
        document.getElementById('end-temp-high').textContent = end_day.data[0].temperatureHigh;
        document.getElementById('end-temp-high-time').textContent = end_daily_high_time;
        document.getElementById('end-temp-low').textContent = end_day.data[0].temperatureLow;
        document.getElementById('end-temp-low-time').textContent = end_daily_low_time;
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