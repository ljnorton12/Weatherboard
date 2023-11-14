var autocompleteInput = document.getElementById("cityInput");
var suggestBoxElement = document.getElementById("suggestBoxElement");
var searchHistoryList = document.getElementById("historyList");

var apiKey = "53beb0ec6bd86e3be4a68a7576384878";

autocompleteInput.addEventListener("input", function () {
    var cityName = autocompleteInput.value;

    if (cityName.trim() !== "") {
        fetch(`https://api.openweathermap.org/data/2.5/find?q=${encodeURIComponent(cityName)}&cnt=5&appid=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                updateAutocompleteSuggestions(data.list);
            })
            .catch(error => {
                console.error('Error fetching city suggestions:', error);
            });
    } else {
        closeSuggestBox();
    }
});

function updateAutocompleteSuggestions(cityList) {
    if (cityList && cityList.length > 0) {
        suggestBoxElement.innerHTML = '';
        cityList.forEach(city => {
            const suggestionItem = document.createElement('div');
            suggestionItem.textContent = city.name;
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.addEventListener('click', () => {
                selectAutocomplete(city.name);
            });
            suggestBoxElement.appendChild(suggestionItem);
        });
        suggestBoxElement.style.visibility = 'visible';
    } else {
        closeSuggestBox();
    }
}

function closeSuggestBox() {
    suggestBoxElement.innerHTML = '';
    suggestBoxElement.style.visibility = 'hidden';
}

function selectAutocomplete(selectedCity) {
    autocompleteInput.value = selectedCity;
    closeSuggestBox();
    addToSearchHistory(selectedCity);
    fetchDataAndDisplay(selectedCity);
}

function addToSearchHistory(city) {
    var listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.addEventListener('click', () => {
        fetchDataAndDisplay(city);
    });
    searchHistoryList.appendChild(listItem);
}

function fetchDataAndDisplay(cityName) {
    displayCurrentWeather(cityName);
    displayForecast(cityName);
}

function displayCurrentWeather(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=imperial`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const cityDateElement = document.querySelector('.city-date');
            const temperatureElement = document.getElementById('temperature');
            const windElement = document.getElementById('wind');
            const humidityElement = document.getElementById('humidity');

            cityDateElement.innerHTML = `<h2>${data.name} - ${new Date().toLocaleDateString()}</h2>`;
            temperatureElement.textContent = `${data.main.temp}°F`; // Updated to Fahrenheit
            windElement.textContent = `${data.wind.speed} m/s`;
            humidityElement.textContent = `${data.main.humidity}%`;
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
        });
}

function displayForecast(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=imperial`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const forecastElement = document.querySelector('.forecast');
            forecastElement.innerHTML = '<h2>5-Day Forecast</h2>';

            for (let i = 0; i < 5; i++) {
                const forecastData = data.list[i];
                const date = new Date(forecastData.dt * 1000).toLocaleDateString();
                const temperature = forecastData.main.temp;
                const wind = forecastData.wind.speed;
                const humidity = forecastData.main.humidity;

                const forecastBox = document.createElement('div');
                forecastBox.classList.add('forecast-box');
                forecastBox.innerHTML = `
                    <p>Date: ${date}</p>
                    <p>Temperature: ${temperature}°F</p>
                    <p>Wind: ${wind} m/s</p>
                    <p>Humidity: ${humidity}%</p>
                `;

                forecastElement.appendChild(forecastBox);
            }
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
        });
}

