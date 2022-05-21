import { createElem, toProperCase } from "./domFunctions.js"

export const createCurrentConditionsDivs = (weatherObj, unit) => {
    const tempUnit = unit === 'metric' ? 'C' :  'F'
    const windUnit = unit === 'metric' ? 'm/s' : 'mph'
    const icon = createMainImgDiv(
        weatherObj.current.weather[0].icon,
        weatherObj.current.weather[0].descrition
        )
    const temp = createElem('div', 'temp', `${Math.round(Number(weatherObj.current.temp))}°`, tempUnit)
    const properDesc = toProperCase(weatherObj.current.weather[0].description)
    const desc =     createElem('div', 'desc', properDesc)
    const feels =    createElem('div', 'feels', `Feels Like ${Math.round(Number(weatherObj.current.feels_like))}°`)
    const maxTemp =  createElem('div', 'maxtemp', `High ${Math.round(Number(weatherObj.daily[0].temp.max))}°`)
    const minTemp =  createElem('div', 'mintemp', `Low ${Math.round(Number(weatherObj.daily[0].temp.min))}°`)
    const humidity = createElem('div', 'humidity', `Humidity ${Math.round(Number(weatherObj.current.humidity))}%`)
    const wind =     createElem('div', 'wind', `Wind ${Math.round(Number(weatherObj.current.wind_speed))} ${windUnit}`)
    return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind]
}

const createMainImgDiv = (icon, altText) => {
    const iconDiv = createElem('div', 'icon')
    iconDiv.id = 'icon'
    const faIcon = translateIconToFontAwesome(icon)
    faIcon.ariaHidden = true
    faIcon.title = altText
    iconDiv.appendChild(faIcon)
    return iconDiv
}

const translateIconToFontAwesome = icon => {
    const i = document.createElement('i')
    const firstTwoChars = icon.slice(0, 2)
    const lastChar = icon.slice(2);
    switch (firstTwoChars) {
        case '01':
            if (lastChar === 'd') {
              i.classList.add('far', 'fa-sun')
            } else {
              i.classList.add('far', 'fa-moon')
            }
            break
          case '02':
            if (lastChar === 'd') {
              i.classList.add('fas', 'fa-cloud-sun')
            } else {
              i.classList.add('fas', 'fa-cloud-moon')
            }
            break
          case '03':
            i.classList.add('fas', 'fa-cloud')
            break
          case '04':
            i.classList.add('fas', 'fa-cloud-meatball')
            break
          case '09':
            i.classList.add('fas', 'fa-cloud-rain')
            break
          case '10':
            if (lastChar === 'd') {
              i.classList.add('fas', 'fa-cloud-sun-rain')
            } else {
              i.classList.add('fas', 'fa-cloud-moon-rain')
            }
            break
          case '11':
            i.classList.add('fas', 'fa-poo-storm')
            break
          case '13':
            i.classList.add('far', 'fa-snowflake')
            break
          case '50':
            i.classList.add('fas', 'fa-smog')
            break
        default:
            i.classList.add('far', 'fa-question-circle' )
    }
    return i
}