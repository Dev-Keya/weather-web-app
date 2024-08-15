import React, { useEffect } from 'react'
import './Responsiveness.scss'
import './WeatherApp.scss'
import { useState } from 'react'

const WeatherApp = () => {

  const [data, setData] = useState(null);
  const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState([]);
  const [cityName, setCity] = useState([]);
  const [cityLabel, setCityLabel] = useState([]);
  const [temp_max, setMaxTemp] = useState([]);
  const [temp_min, setMinTemp] = useState([]);
  const [feelsLike, setFeelsLike] = useState([]);
  const [weather_main_text, setMain] = useState(null);
  const [weather_description, setDescription] = useState(null);
  const [userCurrentTime, setuserCurrentTime] = useState(new Date().toLocaleTimeString());
  let result = null;
  let [Weatherstyle, setWeatherStyle] = useState(null)

  // let [isNight, setisNight] = useState(null);
  //const api_key = '2cad2f39f0337c5189438989b551e96b';
  const api_key = '376f7e0482a63ddae5568c2486e840ad';
  const raindropCount = 20;
  const _keywords = ["_Rain", "_Drizzle", "_Snow", "_Clear", "_Thunderstorm"];



  const handleChange = (e) => {
    setCity(e.target.value)
  }

  const search = async () => {

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=Metric&appid=${api_key}`;
    const res = await fetch(url)
    const searchData = await res.json()
    // console.log('search data:  ', searchData);

    setTemp(searchData.main.temp);
    setHumidity(searchData.main.humidity);
    setWind(searchData.wind.speed);
    setCityLabel(searchData.name);
    setMaxTemp(searchData.main.temp_max);
    setMinTemp(searchData.main.temp_min);
    setFeelsLike(searchData.main.feels_like);
    setMain(searchData.weather[0].main)
    setDescription(searchData.weather[0].description)
    setuserCurrentTime(new Date().toLocaleTimeString());
    // console.log({ weather_main_text })
  }

  useEffect(() => {
    if (weather_description) {
      const weather = () => {
        for (let i = 0; i < _keywords.length; i++) {
          if (weather_description.includes(_keywords[i]) || _keywords[i].includes(weather_description) || weather_main_text.includes(_keywords[i]) || _keywords[i].includes(weather_main_text)) {
            result = _keywords[i];
            return result;
          }
        }
        if (!result) {
          switch (weather_description) {
            case "few clouds": return 'fewclouds'
              break;

            case "scattered clouds": return 'scatteredclouds'
              break;

            case "overcast clouds": return 'clouds'
              break;

            case "broken clouds": return 'clouds'
              break;

            default:
              return 'atmosphere'

          }
        }
      }

      // console.log(weather())
      setWeatherStyle(weather);

      //console.log("userCurrentTime ", userCurrentTime)
      let formatUserTime = String(userCurrentTime.replace(/:/g, "."));
      //console.log("formatUserTime", formatUserTime)

      let isNight = (((parseFloat(formatUserTime) > parseFloat("01.00")) && (parseFloat(formatUserTime) < parseFloat("06.00"))) ||
        ((parseFloat(formatUserTime) > parseFloat("19.00")) && (parseFloat(formatUserTime) < parseFloat("24.00"))))


      //console.log("isNight ", isNight)
      // switch (weather) {
      //   case 'fewclouds': isNight ? nightFewClouds : dayFewClouds
      //     break;
      // }

      // console.log("Weatherstyle in Use Effect", Weatherstyle)
    }


  }, [weather_description])

  return (

    <div className="main-container club ">
      <div className="weather-app ">

        <div className="top-part club">
          <search className="serach-bar club">
            <input placeholder='Enter a city name eg. london ' onChange={handleChange} value={cityName} className="location">
            </input>
            <div onClick={search} className="search-icon"></div>
          </search>
          <span className='label'>Showing weather for <b className='highlight'>{cityLabel}</b></span>
        </div>

        <p className='note'>This application only displays weather information for cities. Please ensure that you have entered a city name.</p>

        <div className="weather-text">
          <p className="weather-main">{weather_main_text}</p>

          <p className="weather-desciption">{weather_description}</p>
        </div>

        <div className="middle-part">
          <div className="humid-windy club">

            <div className="humid">
              <div className="club">
                <div className="humidity-icon"></div>
                <div className="humid-count">{humidity}%</div>
              </div>

              <div className="label"> Humidity</div>
            </div>



            <div className="windy">
              <div className="club">
                <div className="windy-icon"></div>
                <div className="windy-count"> {wind} m/s</div>
              </div>

              <div className="label"> Wind</div>
            </div>
          </div>
          <div className="display-temperature">{temp} <sup>o</sup>C
            <p className="feels-like">Feels like : {feelsLike} <sup>o</sup>C</p>

          </div>
          {/* {console.log("Weatherstyle inside HTML ", Weatherstyle)} */}

          {Weatherstyle && (<div className={`weather-img ${Weatherstyle}`}>
            {
              Weatherstyle === '_Rain' && (<div className="rain">
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
              </div>)
            }

          </div>)}

        </div>

        <div className="bottom-part">
          graph
        </div>

      </div>
    </div>
  )
}

export default WeatherApp

