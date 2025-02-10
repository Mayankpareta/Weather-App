const notificationElement = document.querySelector('.notification');
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temperature-value p');
const descElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');

let weather = {} ;

weather.temperature = {
    unit : "celsius"
}

let kelvin = 273;

let key = "82005d27a116c2880c8f0fcb866998a0";

//browser support geolocation

if(Geolocation){
    navigator.geolocation.getCurrentPosition(setPosition , showError)
}else{
    notificationElement.computedStyleMap.display = 'block';
    notificationElement.innerHTML = "<p> Browser doesn't Support Geolocation </p>";
}

//access some coordinates

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude)
}

function showError(error) {
    notificationElement.computedStyleMap.display = 'block';
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

//fetch API

function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;   
    
    fetch(api) 
       .then(function(response) {
            let data = response.json();
            return data;  
        })
        .then(function(data) {
            weather.temperature.value = Math.floor(data.main.temp - kelvin);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country
        })
        .then(function() {
            displayWeather();
        })
}

//display the weather

function displayWeather() {
   // notificationElement.innerHTML = ``;
    iconElement.innerHTML = `<img src='icons/${weather.iconId}.png'>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = `${weather.description}`;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`
}

//change celsius to fahrenheit

let celsiusToFahrenheit = (temperature) => {
      return (temperature * 9/5) + 32;
}

tempElement.addEventListener('click', () => {
    if(weather.temperature.value === 'undefined') return;

    if(weather.temperature.unit == 'celsius') {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML =   `${fahrenheit} °<span>F</span>`;
        weather.temperature.unit = 'fahrenheit';
    }
    else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
})
