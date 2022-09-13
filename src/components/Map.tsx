import React, {useState, useRef, MutableRefObject, useEffect} from "react"
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import Image from "next/image"
import {fetchCurrentWeather, fetchPollution, fetchWeatherForcast} from "../api/external"
import {LatLngExpression} from "leaflet"

/**
 * Interface type for search data type
 */
interface SearchDataType {
  place_id: number,
  licence: string,
  osm_type: string,
  osm_id: string,
  boundingbox: Array<number>,
  lat: string,
  lon: string,
  display_name: string,
  class: string,
  type: string,
  importance: number,
  icon: string,
}

/**
 * Interface type for Map search parameters being passed to Map component
 */
interface MapSearchTypeProps {
  data?: SearchDataType[]
}

/**
 * Map component for rendering OpenStreetMap.
 * The component also includes the API integration which fetches the weather forecast data as well as pollution data from OpenWeatherMap
 *
 * @return {Component} Map component
 * @param props
 */
const Map = (props: {data: MapSearchTypeProps | any } ) => {
  const {data} = props
  const [center, setCenter] = useState<LatLngExpression>([57.70690, 11.96614])
  const [isModalShown, setIsModalShown] = useState(false)
  const [weatherForcastDataFetched, setWeatherForcastDataFetched] = useState(false)
  const [weatherForcastData, setWeatherForcastData] = useState<Array<Object> | any>([])
  const [weatherForcastCurrentDataFetched, setWeatherForcastCurrentDataFetched] = useState(false)
  const [weatherForcastCurrentData, setWeatherForcastCurrentData] = useState<Array<Object> | any>([])
  const [pollutionDataFetched, setPollutionDataFetched] = useState(false)
  const [pollutionData, setPollutionForcastData] = useState<Array<Object> | any>([])
  const ZOOM_LEVEL: number = 5
  const mapRef: MutableRefObject<any> = useRef()

  /**
   * Represents the available pollution states
   */
  enum Condition {
    Good = 1,
    Fair,
    Moderate,
    Poor,
    VeryPoor,
  }

  /**
   * Asynchronous function for calling external apis defined in `src/api/external.ts`
   * Response of api calls will set the state hooks defined inside the component
   *
   * @param {string} lat - Latitude of the city to determine the weather conditions
   * @param {string} lon - Longitude of the city to determine the weather conditions
   */
  const fetchWeatherConditionsAPI = async (lat: string, lon: string) => {

    /**
     * Function call for `fetchWeatherForcast` api
     */
    const weatherForcast = fetchWeatherForcast(lat, lon)
    weatherForcast.then((result) => {
      if (result.status != 200) {
        setWeatherForcastDataFetched(false)
      } else {
        setWeatherForcastData(result.data)
        setWeatherForcastDataFetched(true)
      }
    })

    /**
     * Function call for `fetchCurrentWeather` api
     */
    const weatherForcastCurrent = fetchCurrentWeather(lat, lon)
    weatherForcastCurrent.then((result) => {
      if (result.status != 200) {
        setWeatherForcastCurrentDataFetched(false)
      } else {
        setWeatherForcastCurrentData(result.data)
        setWeatherForcastCurrentDataFetched(true)
      }
    })

    /**
     * Function call for `fetchPollution` api
     */
    const pollution = fetchPollution(lat, lon)
    pollution.then((result) => {
      if (result.status != 200) {
        setPollutionDataFetched(false)
      } else {
        setPollutionForcastData(result.data)
        setPollutionDataFetched(true)
      }
    })
  }

  /**
   * Function to handle click event from view weather pin
   */
  const handleViewClickEvent = () => {
    setIsModalShown(true)
    if (data != undefined) {
      try {
        fetchWeatherConditionsAPI(data[0].lat, data[0].lon)
      } catch (error) {
        fetchWeatherConditionsAPI("57.70690", "11.96614")
      }
    }
  }

  /**
   * Function defined for converting the pollution aqi number field to string mapping the corresponding pollution status
   * @see https://openweathermap.org/api/air-pollution#fields
   */
  function convertPollution(value: number): React.ReactNode {
    if (value === Condition.Good) {
      return "Good"
    } else if (value === Condition.Fair) {
      return "Fair"
    } else if (value === Condition.Moderate) {
      return "Moderate"
    } else if (value === Condition.Poor) {
      return "Poor"
    } else if (value === Condition.VeryPoor) {
      return "Very Poor"
    }
  }

  /**
   * useEffect function to set the default values for certain elements such as the center position of the map
   */
  useEffect(() => {
    if (data != undefined) {
      if (data?.length > 0) {
        setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        fetchWeatherConditionsAPI(data[0].lat, data[0].lon)
      }
    }

  }, [data])

  return (
    <>
      <div className='container mx-auto px-4'>
        <div className='row'>
          <div className='col'>
            <div className='container'>
              <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker
                  position={center}
                >
                  <Popup>
                    <button className="rounded-lg" onClick={() => handleViewClickEvent()}>Click to view forecasts
                    </button>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
      {
        isModalShown ?
          <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                  className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Image src="/weather_notification.svg" alt="Subscribe" width={260} height={190}/>
                        <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">Here is the weather
                          forcasts for the
                          location {weatherForcastDataFetched ? weatherForcastData.city.name : "NIL"}</h3>
                        <div className="mt-2">
                          {
                            data ?
                              <div className="flex flex-col">
                                <div className="basis-1/2">
                                  <h4>Today&apos;s weather</h4>
                                  <div className="flex flex-row">
                                    <div className="basis-1/2">Weather</div>
                                    <div
                                      className="basis-1/2">{weatherForcastCurrentDataFetched ? weatherForcastCurrentData.weather[0].description : "NIL"}</div>
                                  </div>
                                  <div className="flex flex-row">
                                    <div className="basis-1/2">Temperature</div>
                                    <div
                                      className="basis-1/2">{weatherForcastCurrentDataFetched ? parseInt(weatherForcastCurrentData.main.temp) : "NIL"}&deg; C
                                    </div>
                                  </div>
                                  <div className="flex flex-row">
                                    <div className="basis-1/2">Feels like</div>
                                    <div
                                      className="basis-1/2">{weatherForcastCurrentDataFetched ? parseInt(weatherForcastCurrentData.main.feels_like) : "NIL"}&deg; C
                                    </div>
                                  </div>
                                </div>
                                <div className="basis-1/2">
                                  <div className="flex flex-row">
                                    <div className="basis-1/2">Air quality</div>
                                    <div
                                      className="basis-1/2">{pollutionDataFetched ? convertPollution(pollutionData.list[0].main.aqi) : "NIL"}</div>
                                  </div>
                                </div>
                              </div>
                              :
                              <p>Data unavailable at the moment!</p>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => setIsModalShown(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          null
      }
    </>
  )
}

export default Map
