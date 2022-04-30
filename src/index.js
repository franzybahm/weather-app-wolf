//Always display the current time and day
function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Thuesday",
    "Wendsday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = time.getDay();
  let nameofDay = days[day];

  let hour = time.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minute = time.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  let formattedDate = `${nameofDay} ${hour}:${minute}`;
  return formattedDate;
}

let time = new Date();
let currentTime = formatDate(time);
let displayedTime = document.querySelector("#current-time");
displayedTime.innerHTML = currentTime;

//Display forecast
function displayForecast(response){
  let forecast = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon"];

  days.forEach(function(day){

  forecastHTML = forecastHTML + 
            `<div class="col-4 zoom">
              <h4>${day}</h4>
              <img src="http://openweathermap.org/img/wn/50d@2x.png" alt="" id="weather-icon-forecast"></i>
              <div class="forecast-temp">
                <span class="forecast-max">7°</span>
                <span class="forecast-min">4°</span>
              </div>
            </div>
  `;
   });
  forecastHTML = forecastHTML + `</div>`;

  forecast.innerHTML = forecastHTML;
console.log(response.data.daily);
  
  
}

//Display the city name someone searched for after submitting and change Temp
function getCoordinates(coordinates){
  let apiKey = "cf1b1343a7207aa60910085fc2251ee5";
  console.log(coordinates);
  let apiURL=`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiURL);
  axios.get(apiURL).then(displayForecast);
}

function getWeather(response){
  let temperatureElement = document.querySelector("#current-temp");
  let weatherIcon = document.querySelector("#weather-icon");
  let descriptionElement = document.querySelector("#description");
  let windElement = document.querySelector("#wind");
  let humidityElement = document.querySelector("#humidity");
  let temp = Math.round(response.data.main.temp);
  let city = document.querySelector("#current-city");
  city.innerHTML = response.data.name;
  temperatureElement.innerHTML = `${temp}°C`;
  weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`);
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  descriptionElement.innerHTML = response.data.weather[0].description;
  windElement.innerHTML = `Wind: ${response.data.wind.speed}km/h`;
  humidityElement.innerHTML = `Precipitation: ${response.data.main.humidity}%`;
  getCoordinates(response.data.coord);
}

function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-city-input");
  let apiKey = "cf1b1343a7207aa60910085fc2251ee5";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getWeather);
}

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchCity);

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchCity);

//Display the Temp after clicking the Location Button
function getLoc(position){
  let cityName = document.querySelector("#current-city");
  cityName.innerHTML = "Current Position";
  let apiKey = "cf1b1343a7207aa60910085fc2251ee5";
  let units = "metric";
  let long = position.coords.longitude;
  let lat = position.coords.latitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getWeather);
}

function getPos(event){
  navigator.geolocation.getCurrentPosition(getLoc)
}

let locButton = document.querySelector("#location-button");
locButton.addEventListener("click", getPos);

//Change °C to °F and viceversa by clicking it
function getF(celcius) {
  let fahrenheit = Math.round(celcius * 1.8 + 32);
  return fahrenheit;
}

function getC(fahrenheit) {
  let celcius = Math.round((fahrenheit - 32) / 1.8);
  return celcius;
}

function convertTemp() {
  let currentTemp = document.querySelector("#current-temp");
  let newTemp = 0;
  const temp = currentTemp.textContent.split(`°`);
  let number = temp[0];
  let unit = temp[1];
  let button = document.querySelector("#convert");
  if (unit === "C") {
    unit = "F";
    newTemp = getF(number);
    button.innerHTML = "Convert to Celcius";
  } else {
    unit = "C";
    newTemp = getC(number);
    button.innerHTML = "Convert to Fahrenheit";
  }
  currentTemp.innerHTML = `${newTemp}°${unit}`;
}
let currentTemp = document.querySelector("#current-temp");
let button = document.querySelector("#convert");
const temp = currentTemp.textContent.split(`°`);
let unit = temp[1];
if (unit === "C") {
  button.innerHTML = "Convert to Fahrenheit";
} else {
  button.innerHTML = "Convert to Celcius";
}

button.addEventListener("click", convertTemp);
