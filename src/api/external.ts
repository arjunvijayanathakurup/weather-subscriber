import axios, { AxiosResponse } from "axios"

// nominateim url
const SEARCH_URL = process.env.NEXT_PUBLIC_NOMINATEIM_URL

// openweather url
const OPENWEATHER_URL = process.env.NEXT_PUBLIC_OPENWEATHER_URL
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

/**
 * Function to search a city to obtain the latitude and longitude.
 * @param {string} cityName - The name of the city to search
 * @return {Promise<AxiosResponse<any, any>>} Promise - A Promise containing the result from API call
 */
export async function searchCity(cityName: string): Promise<AxiosResponse<any, any>> {
  return await axios.get(SEARCH_URL, { params: { city: `${cityName}`, format: "json" } })
}

/**
 * Function to retrieve weather forecasts of a particular city using latitude and longitude
 * @param {string} lat - Latitude of the city
 * @param {string} lon - Longitude of the city
 * @return {Promise<AxiosResponse<any, any>>} Promise - A Promise containing the result from API call
 */
export async function fetchWeatherForcast(lat: string, lon: string): Promise<AxiosResponse<any, any>> {
  return await axios.get(OPENWEATHER_URL + "/forecast", { params: { lat: `${lat}`, lon: `${lon}`, appid: `${OPENWEATHER_API_KEY}`, units: "metric" } })
}

/**
 * Function to retrieve today's weather forecasts of a particular city using latitude and longitude
 * @param {string} lat - Latitude of the city
 * @param {string} lon - Longitude of the city
 * @return {Promise<AxiosResponse<any, any>>} Promise - A Promise containing the result from API call
 */
export async function fetchCurrentWeather(lat: string, lon: string): Promise<AxiosResponse<any, any>> {
  return await axios.get(OPENWEATHER_URL + "/weather", { params: { lat: `${lat}`, lon: `${lon}`, appid: `${OPENWEATHER_API_KEY}`, units: "metric" } })
}

/**
 * Function to retrieve pollution contents of a particular city using latitude and longitude
 * @param {string} lat - Latitude of the city
 * @param {string} lon - Longitude of the city
 * @return {Promise<AxiosResponse<any, any>>} Promise - A Promise containing the result from API call
 */
export async function fetchPollution(lat: string, lon: string): Promise<AxiosResponse<any, any>> {
  return await axios.get(OPENWEATHER_URL + "/air_pollution", { params: { lat: `${lat}`, lon: `${lon}`, appid: `${OPENWEATHER_API_KEY}`, units: "metric" } })
}
