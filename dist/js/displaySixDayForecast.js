import { createElem } from "./domFunctions.js"

export const displaySixDayForecast = weatherJson => {
    for (let i = 1; i <= 6; i++) {
      const dfArray = createDailyForecastDivs(weatherJson.daily[i])
      displayDailyForecast(dfArray);
    }
  }
  
  
const createDailyForecastDivs = dayWeather => {
    const dayAbbreviationText = getDayAbbreviation(dayWeather.dt)
    const dayAbbreviation = createElem( 'p', 'dayAbbreviation',  dayAbbreviationText
    )
    const dayIcon = createDailyForecastIcon(
      dayWeather.weather[0].icon,
      dayWeather.weather[0].description)
    const dayHigh = createElem( 'p', 'dayHigh', `${Math.round(Number(dayWeather.temp.max))}°`)
    const dayLow = createElem( 'p', 'dayLow', `${Math.round(Number(dayWeather.temp.min))}°`)
    return [dayAbbreviation, dayIcon, dayHigh, dayLow]
  };
  

const getDayAbbreviation = (data) => {
    const dateObj = new Date(data * 1000)
    const utcString = dateObj.toUTCString()
    return utcString.slice(0, 3).toUpperCase()
  }
  

const createDailyForecastIcon = (icon, altText) => {
    const img = document.createElement('img')
    if (window.innerWidth < 768 || window.innerHeight < 1025) {
      img.src = `https://openweathermap.org/img/wn/${icon}.png`
    } else {
      img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`
    }
    img.alt = altText
    return img
  };
  

const displayDailyForecast = (dfArray) => {
    const dayDiv = createElem('div', 'forecastDay')
    dfArray.forEach((el) => dayDiv.appendChild(el))
    const dailyForecastContainer = document.getElementById("dailyForecast__contents")
    dailyForecastContainer.appendChild(dayDiv)
  }