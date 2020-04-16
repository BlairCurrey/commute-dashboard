class Page{
    constructor(){
        this.time = new Time();
        // this.start_coords = start_coords;
        // this.end_coords = end_coords;
        // this.depart_id = depart_id;
        // this.destination_str = this.destination_str;
    }

    async init(){
        this.weather = new Weather('/weather/40.844972,-74.079847/40.815750,-73.950133');
        await this.weather.init();
        console.log(await this.weather);
        this.rain = new Rain((await this.weather.data).end.hourly.data);
        console.log(this.rain);
        this.train = new Train('/train/WR', 'Hoboken');
        await this.train.init();
        console.log(await this.train);
    }

    render(){
        this.time.render();
        this.weather.render();
        this.rain.render();
        this.train.render();
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
        document.getElementById("start-weather-icon").setAttribute("data", `icons/${start.currently.icon}.svg`);


        //Day's weather in end location
        document.getElementById('end-hourly-summary').textContent = end.hourly.summary;
        document.getElementById('end-high').textContent = end.daily.data[0].temperatureHigh;
        document.getElementById('end-high-time').textContent = end_high_time;
        document.getElementById("end-weather-icon").setAttribute("data", `icons/${end.daily.icon}.svg`);

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
        if(this.total_prob <= 0.20){
            document.getElementById('precip-conditional').style.display = 'none';
        } else {
        document.getElementById('end-precip-prob-high').textContent = Math.round(this.max_prob * 100);
        document.getElementById('end-precip-prob-time').textContent = Time.parseTime(new Date(this.max_prob_time * 1000));
        document.getElementById('end-precip-intensity-high').textContent = this.max_intensity;
        document.getElementById('end-precip-intensity-time').textContent = Time.parseTime(new Date(this.max_intensity_time * 1000));
        }
    }
}

class Train{
    constructor(route, destination){
        this.route = route;
        this.destination = destination //must match destination string in departute vision
        this.response_string = null;
        this.html = null;
        this.parsed_rows = null;
    }

    async init(){
        //call after class instantiation - data cannot be fetched in constructor
        await this.get();
        this.buildHTML(this.respone_string);
        this.getRows();
    }

    async get(){
        const response = await fetch(this.route);
        this.response_string = await response.text();
    }

    buildHTML(){
        this.html = document.createElement('html');
        this.html.innerHTML = this.response_string;
    }

    makeTableRows(){
        let time_pos = 0;
        let status_pos = 5;
        let table_rows = [];

        this.parsed_rows.forEach(element =>{
            let row = document.createElement('tr');
            let time = document.createElement('td');
            let status = document.createElement('td');
            //Fill html elements with data
            let time_text = element[time_pos].textContent.replace(/\s+/g, "")
            //sets to "-" if status is blank, else sets to status
            let status_text = (element[status_pos].textContent == " ") ? "-" : element[status_pos].textContent
            time.innerText = time_text
            status.textContent = status_text
            //Build row and store in array
            row.appendChild(time)
            row.appendChild(status)
            table_rows.push(row)
        })
        return table_rows
    }

    getRows(limit=3){
        const rows = this.html.querySelectorAll('.table-row');
        let matching_rows = [];
        const destination_pos = 1; // column that destination name is located in
        //find first three rows that have a departure that matches the given destination
        rows.forEach(row => {
            let columns = row.querySelectorAll('td')
            if(columns[destination_pos].innerText.includes(this.destination)){
                matching_rows.push(columns)    
            }
        });
        this.parsed_rows = matching_rows.slice(0, limit)
    }

    render(){
        document.getElementById('depart-from').textContent = this.html.querySelector('#Label1').textContent;
        document.getElementById('destination-station').textContent = this.destination;
        let table_rows = this.makeTableRows()
        table_rows.forEach(row =>{
            document.getElementById('sched-table-body').appendChild(row)
        })
    }
}

document.addEventListener("DOMContentLoaded", async function(event) { 
    page = new Page();
    await page.init();
    await page.render();
    setInterval(function(){page.time.update();}, 1000);
  });