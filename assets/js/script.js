document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'caef23a1601559f8d0f546843772f2c4';  
    const searchButton = document.getElementById('search-button');
    const cityInput = document.getElementById('city-input');
    const searchHistoryContainer = document.getElementById('search-history');

    // Load search history from localStorage
    loadSearchHistory();

    searchButton.addEventListener('click', function() {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
            addCityToSearchHistory(city);
        }
    });

    function fetchWeatherData(city) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
            })
            .catch(error => console.error('Error fetching current weather:', error));


        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
            })
            .catch(error => console.error('Error fetching forecast:', error));
    }

    function displayCurrentWeather(data) {
        const currentWeather = document.getElementById('current-weather');
        const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        currentWeather.innerHTML = `
            <h2>Current Weather: ${data.name} (${new Date().toLocaleDateString()})</h2>
            <img src="${weatherIcon}" alt="Weather condition icon">
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} km/h</p>
        `;
    }

    function displayForecast(data) {
        const forecastWeather = document.getElementById('forecast-weather');
        forecastWeather.innerHTML = '<h2>5-Day Forecast</h2>';
        data.list.forEach((forecast, index) => {
            if (index % 8 === 0) {
                const forecastIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
                forecastWeather.innerHTML += `
                    <div>
                        <h3>${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
                        <img src="${forecastIcon}" alt="Weather icon">
                        <p>Temp: ${forecast.main.temp_max} °C</p>
                        <p>Wind: ${forecast.wind.speed} km/h</p>
                        <p>Humidity: ${forecast.main.humidity}%</p>
                    </div>
                `;
            }
        });
    }

    function addCityToSearchHistory(city) {
        if (!document.querySelector(`#search-history button[value="${city}"]`)) {
            const cityButton = document.createElement('button');
            cityButton.textContent = city;
            cityButton.value = city;
            cityButton.addEventListener('click', () => fetchWeatherData(city));
            searchHistoryContainer.appendChild(cityButton);
            saveSearchHistory(city);
        }
    }

    function saveSearchHistory(city) {
        let cities = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!cities.includes(city)) {
            cities.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(cities));
        }
    }

    function loadSearchHistory() {
        const cities = JSON.parse(localStorage.getItem('searchHistory')) || [];
        cities.forEach(city => {
            addCityToSearchHistory(city);
        });
    }
});
