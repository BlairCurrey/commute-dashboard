async function getWeather(){
    const response = await fetch('/weather');
    const json = await response.json();
    console.log(json);
    const start_data = json.start.currently;
    const end_data = json.end.currently;

    document.getElementById('start-temp').textContent = start_data.temperature;
    document.getElementById('start-precip-chance').textContent = start_data.precipProbability * 100;
    
    document.getElementById('end-temp').textContent = end_data.temperature;
    document.getElementById('end-precip-chance').textContent = end_data.precipProbability * 100;
};

function getTime(){
    let time = new Date();
    document.getElementById('time').textContent = time;
}

getWeather();
getTime();
setInterval(getTime, 1000);