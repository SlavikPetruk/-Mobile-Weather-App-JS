import { createCurrentConditionsDivs } from "./CurrentConditionsDivs.js"
import { displaySixDayForecast } from "./displaySixDayForecast.js"

export const setPlaceholderText = () => {
    const input = document.getElementById('searchBar__text')
    window.innerWidth < 400
      ? (input.placeholder = "City, State, Country")
      : (input.placeholder = "City, State, Country, or Zip Code")
  };

export const addSpinner = element => {
    animateButton(element)
    setTimeout(animateButton, 1000, element)
}

const animateButton = element => {
    element.classList.toggle('none')
    element.nextElementSibling.classList.toggle('block')
    element.nextElementSibling.classList.toggle('none')
}

export const displayError = (headerMsg, srMsg) => {
    updateWeatherLocationHeader(headerMsg)
    updateScreenReaderConfirmation(srMsg)
}

export const displayApiError = statusCode => {
    const properMsg = toProperCase(statusCode.message)
    updateWeatherLocationHeader(properMsg)
    updateScreenReaderConfirmation(`${properMsg}. Please try again.`)
}

export const toProperCase = text => text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

const updateWeatherLocationHeader = message => {
    const h1 = document.getElementById('currentForecast__location')
    if (message.indexOf("Lat:") !== -1 && message.indexOf("Long:") !== -1) {
        const msArray = message.split(' ')
        const mapArray = msArray.map(msg => msg.replace(':', ': '))
        const lat = mapArray[0].indexOf('-') === -1 ? mapArray[0].slice(0, 10) : slice(0, 11)
        const lon = mapArray[1].indexOf('-') === -1 ? mapArray[1].slice(0, 11) : slice(0, 12)
        h1.textContent = `⚙ ${lat} • ${lon}`
    } else {
        h1.textContent = message
    }  
}

export const updateScreenReaderConfirmation = (message) => document.getElementById('confirmation').textContent = message

export const updateDisplay = (weatherJson, locationObj) => {
    fadeDisplay()
    clearDisplay()
    const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon)
    setBGImage(weatherClass)
    const screenReaderWeather = buildScreenReaderWeather(weatherJson, locationObj)
    updateScreenReaderConfirmation(screenReaderWeather)
    updateWeatherLocationHeader(locationObj.getName())

    // current conditions
    const ccArray = createCurrentConditionsDivs(weatherJson, locationObj.getUnit())
    displayCurrentConditions(ccArray)

    // six days conditions
    displaySixDayForecast(weatherJson)

    setFocusOnSearch()
    fadeDisplay()
}

const fadeDisplay = () => {
    const cc = document.getElementById('currentForecast')
    cc.classList.toggle('zero-vis')
    cc.classList.toggle('fade-in')
    const sixDay = document.getElementById('dailyForecast')
    sixDay.classList.toggle('zero-vis')
    sixDay.classList.toggle('fade-in')
}

const clearDisplay = () => {
    const currentConditions = document.getElementById('currentForecast__conditions')
    deleteContents(currentConditions)
    const sixDayForecast = document.getElementById('dailyForecast__contents')
    deleteContents(sixDayForecast)
}

const deleteContents = parentElement => {
    let child = parentElement.lastElementChild
    while (child) {
      parentElement.removeChild(child)
      child = parentElement.lastElementChild
    }
}

const getWeatherClass = icon => {
    const firstTwoChars = icon.slice(0,2)
    const lastChar = icon.slice(2)
    const weatherLookup = {
        "09": "snow",
        10: "rain",
        11: "rain",
        13: "snow",
        50: "fog"
    }

    let weatherClass
    if (weatherLookup[firstTwoChars]) {
        weatherClass = weatherLookup[firstTwoChars]
    } else if (lastChar === 'd') {
        weatherClass = 'clouds'
    } else {
        weatherClass = 'night'
    }
    return weatherClass
}

const setBGImage = weatherClass => {
    document.documentElement.classList.add(weatherClass)
    document.documentElement.classList.forEach(img => {
        if(img !== weatherClass) document.documentElement.classList.remove(img)
    })
}

const buildScreenReaderWeather = ( weatherJson, locationObj) => {
    const location = locationObj.getName()
    const unit = locationObj.getUnit()
    const tempUnit = unit === 'imperial' ? 'F' : 'C'
    return `${weatherJson.current.weather[0].descrition} and ${Math.round(Number(weatherJson.current.temp))}°${tempUnit} in ${location} ` 
}

const setFocusOnSearch = () => document.getElementById("searchBar__text").focus()

export const createElem = (elemType, divClassName, divText, unit) => {
    const div = document.createElement(elemType)
    div.className = divClassName
    if (divText) {
      div.textContent = divText
    }
    if (divClassName === 'temp') {
      const unitDiv = document.createElement('div')
      unitDiv.className = 'unit'
      unitDiv.textContent = unit
      div.appendChild(unitDiv)
    }
    return div
  }

const displayCurrentConditions = currentConditionsArray => currentConditionsArray
            .forEach(cc => document.getElementById('currentForecast__conditions').appendChild(cc))
