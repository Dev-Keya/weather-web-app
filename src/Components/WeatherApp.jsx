import React, { useEffect, useState } from 'react';
import './Responsiveness.scss';
import './WeatherApp.scss';
import WeatherGraph from './WeatherGraph';

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const WeatherApp = () => {
  const [data, setData] = useState(null);
  const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState([]);
  const [cityName, setCity] = useState('');
  const [cityLabel, setCityLabel] = useState('');
  const [countryLabel, setCountryLabel] = useState('');
  const [temp_max, setMaxTemp] = useState([]);
  const [temp_min, setMinTemp] = useState([]);
  const [feelsLike, setFeelsLike] = useState([]);
  const [weather_main_text, setMain] = useState(null);
  const [weather_description, setDescription] = useState(null);
  const [userCurrentTime, setUserCurrentTime] = useState(new Date().toLocaleTimeString());
  const [Weatherstyle, setWeatherStyle] = useState(null);
  const [error, setError] = useState(null);

  const api_key = '376f7e0482a63ddae5568c2486e840ad';
  const raindropCount = 20;
  const _keywords = ["_Rain", "_Drizzle", "_Snow", "_Clear", "_Thunderstorm"];

  const handleChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z\s]*$/;
    if (regex.test(value)) {
      setCity(e.target.value);
      setError(null);
    } else {
      setError('Please enter only letters and spaces.');
    }
  };

  const search = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${api_key}`;
    try {
      if (!cityName || cityName.length < 3) throw new Error("Enter Valid city name");
      const res = await fetch(url);
      if (res.status === 404) throw new Error("City Not Found");

      const searchData = await res.json();
      if (searchData.main) {
        setTemp(searchData.main.temp);
        setHumidity(searchData.main.humidity);
        setWind(searchData.wind.speed);
        setCityLabel(searchData.name);
        setMaxTemp(searchData.main.temp_max);
        setMinTemp(searchData.main.temp_min);
        setFeelsLike(searchData.main.feels_like);
        setMain(searchData.weather[0].main);
        setDescription(searchData.weather[0].description);
        setUserCurrentTime(new Date().toLocaleTimeString());
        setCountryLabel(searchData.sys.country);
        setError(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearchClick = () => search();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') search();
  };

  useEffect(() => {
    if (weather_description) {
      const weather = () => {
        for (let i = 0; i < _keywords.length; i++) {
          if (weather_description.includes(_keywords[i]) || _keywords[i].includes(weather_description) || weather_main_text.includes(_keywords[i]) || _keywords[i].includes(weather_main_text)) {
            return _keywords[i];
          }
        }
        switch (weather_description) {
          case "few clouds": return 'fewclouds';
          case "scattered clouds": return 'scatteredclouds';
          case "overcast clouds":
          case "broken clouds": return 'clouds';
          default: return 'atmosphere';
        }
      };
      setWeatherStyle(weather());

      let formatUserTime = String(userCurrentTime.replace(/:/g, "."));
      let isNight = (((parseFloat(formatUserTime) > parseFloat("01.00")) && (parseFloat(formatUserTime) < parseFloat("06.00"))) ||
        ((parseFloat(formatUserTime) > parseFloat("19.00")) && (parseFloat(formatUserTime) < parseFloat("24.00"))));
    }
  }, [weather_description]);

  return (
    <div className="main-container club">
      <div className="weather-app">
        <div className="top-part club">
          <div className="search-section">
            <div className="search-bar club">
              <input
                placeholder='Enter a city name eg. London'
                onChange={handleChange}
                value={cityName}
                className="location"
                onKeyDown={handleKeyDown}
              />
              <div onClick={handleSearchClick} className="search-icon"></div>
            </div>
          </div>
          {error ? <span className='label error'>{error}</span> :
            cityLabel && <span className='label'>Showing weather for <b className='highlight'>{cityLabel}, {countryLabel}</b></span>}
        </div>
        <p className='note'>This application only displays weather information for cities. Please ensure that you have entered a city name.</p>
        {error ? <>
        
        <h4 className='error-label'>Oops! That doesn't seem like a valid location. Try again</h4>
        <div className="error-img"></div>
        </> : <>
          <div className="weather-text">
            <p className="weather-main">{weather_main_text}</p>
            <p className="weather-description">{weather_description}</p>
          </div>
          {weather_description && <div className="middle-part">
            <div className="humid-windy club">
              <div className="humid">
                <div className="club">
                  <div className="humidity-icon"></div>
                  <div className="humid-count">{humidity}%</div>
                </div>
                <div className="label">Humidity</div>
              </div>
              <div className="windy">
                <div className="club">
                  <div className="windy-icon"></div>
                  <div className="windy-count">{wind} m/s</div>
                </div>
                <div className="label">Wind</div>
              </div>
            </div>
            <div className="display-temperature">{temp} <sup>o</sup>C
              <p className="feels-like">Feels like: {feelsLike} <sup>o</sup>C</p>
            </div>
            {Weatherstyle && (
              <div className={`weather-img ${Weatherstyle}`}>
                {Weatherstyle === '_Rain' && (
                  <div className="rain">
                    {Array.from({ length: raindropCount }).map((_, index) => (
                      <div
                        key={index}
                        className="raindrop"
                        style={{
                          left: `${Math.random() * 11}vw`,
                          animationDuration: `${0.5 + Math.random() * 0.9}s`,
                          animationDelay: `${Math.random()}s`
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>}
          {weather_description && <div className="bottom-part weather-graph-container">
            <WeatherGraph cityName={cityName} cityLabel={cityLabel} />
          </div>}
        </>}
      </div>
    </div>
  );
};

export default WeatherApp;
