import CurrentLocation from "./CurrentLocation.js"
import {  cleanText, 
          getCoordsFromApi, 
          getHomeLocation, 
          getWeatherFromCoords, 
          setLocationObject } from "./dataFunctions.js"

import {  addSpinner, 
          displayApiError, 
          displayError, 
          setPlaceholderText, 
          updateDisplay, 
          updateScreenReaderConfirmation } from "./domFunctions.js"

const currentLoc = new CurrentLocation()

const initApp = () => {
    // add listeners
    const geoButton = document.getElementById('getLocation')
    geoButton.addEventListener('click', getGeoWeather)

    const homeButton = document.getElementById('home')
    homeButton.addEventListener('click', loadWeather)

    const saveButton = document.getElementById('saveLocation')
    saveButton.addEventListener('click', saveLocation)

    const unitButton = document.getElementById('unit')
    unitButton.addEventListener('click', setUnitPref)

    const refreshButton = document.getElementById('refresh')
    refreshButton.addEventListener('click', refreshWeather)

    const locationEntery = document.getElementById('searchBar__form')
    locationEntery.addEventListener('submit', submitNewLocation)
  // set up
  setPlaceholderText();
  // load weather
  loadWeather();
}

document.addEventListener('DOMContentLoaded', initApp)

const getGeoWeather = event => {
    if (event && event.type === 'click') {
        const mapIcon = document.querySelector('.fa-map-marker-alt')
        addSpinner(mapIcon)
      }
      if (!navigator.geolocation) return geoError()
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
    }

const geoError = errObj => {
    const errMsg = errObj ? errObj.message : 'Geolocation not supported' 
    displayError(errMsg, errMsg)
  }

const geoSuccess = position => {
  const myCoordsObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
  }
  //set location object
  setLocationObject(currentLoc, myCoordsObj)
  // console.log(currentLoc)

  // update data and display
  updateDataAndDisplay(currentLoc)
}

const saveLocation = () => {
  if (currentLoc.getLat() && currentLoc.getLon()) {
    const saveIcon = document.querySelector('.fa-sd-card')
    addSpinner(saveIcon)
    const location = {
      name: currentLoc.getName(),
      lat: currentLoc.getLat(),
      lon: currentLoc.getLon(),
      unit: currentLoc.getUnit()
    }
    localStorage.setItem('defaultWeatherLocation', JSON.stringify(location))
    updateScreenReaderConfirmation(`Saved ${currentLoc.getName()} as home Location`)
  }
}

const loadWeather = event => {
  const savedLocation = getHomeLocation()
  if (!savedLocation && !event) return getGeoWeather()
  if (!savedLocation && event.type === 'click') {
    displayError(
      'No Home Location Saved...',
      'Please save your home location first!'
    )
  } else if (savedLocation && !event) {
    displayHomeLocationWeather(savedLocation)
  } else {
    const homeIcon = document.querySelector('.fa-house-chimney-window')
    addSpinner(homeIcon)
    displayHomeLocationWeather(savedLocation)
  }
}

const displayHomeLocationWeather = home => {
  if (typeof home === "string") {
    const locationJson = JSON.parse(home)
    const myCoordsObj = {
      lat: locationJson.lat,
      lon: locationJson.lon,
      name: locationJson.name,
      unit: locationJson.unit
    };
    setLocationObject(currentLoc, myCoordsObj)
    updateDataAndDisplay(currentLoc)
  }
}

const setUnitPref = () => {
  const unitIcon = document.querySelector('.fa-chart-bar')
  addSpinner(unitIcon)
  currentLoc.toggleUnit()
  updateDataAndDisplay(currentLoc)
}

const refreshWeather = () => {
  const refreshIcon = document.querySelector(".fa-arrow-rotate-right")
  addSpinner(refreshIcon)
  updateDataAndDisplay(currentLoc)
};

const submitNewLocation = async (event) => {
  event.preventDefault()
  const text = document.getElementById('searchBar__text').value
  const entryText = cleanText(text)
  if (!entryText.length) return
  const locationIcon = document.querySelector('.fa-search')
  addSpinner(locationIcon)
  const coordsData = await getCoordsFromApi(entryText,currentLoc.getUnit())
  // work with api data
   if (coordsData) {
    if (coordsData.cod === 200) {
      const myCoordsObj = {
        lat: coordsData.coord.lat,
        lon: coordsData.coord.lon,
        name: coordsData.sys.country
          ? `${coordsData.name}, ${coordsData.sys.country}`
          : coordsData.name
      }
      setLocationObject(currentLoc, myCoordsObj)
      updateDataAndDisplay(currentLoc)
    } else {
      displayApiError(coordsData)
    }
  } else {
    displayError('Connection Error', 'Connection Error')
  }
}

const updateDataAndDisplay = async (locationObj) => {
  const weatherJson = await getWeatherFromCoords(locationObj)
  // console.log(weatherJson)
  if (weatherJson) updateDisplay(weatherJson, locationObj)
}
