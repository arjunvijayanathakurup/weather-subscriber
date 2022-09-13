import {useState} from "react"
import {searchCity} from "../api/external"
import dynamic from "next/dynamic"

/**
 * A dynamic route of the Map component which uses leaflet library is necessary, otherwise the contents won't be showing
 */
const OpenStreetMap = dynamic(() => import("./Map"), {
  ssr: false,
})

/**
 * Map component for searching the city.
 * As of now, a filter for city has been added the api, but can be altered in the future
 *
 * @return {Component} Search component
 */
const Search = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchQueryResponse, setSearchQueryResponse] = useState({})
  const [searchQueryResponseFetched, setSearchQueryResponseFetched] = useState(false)

  /**
   * Function to search the city using nominateim library api
   * This is required as OpenStreetMap requires the latitude and longitude of a place to add a pin. Moreover, the
   * OpenWeatherMap api requires latitude and longitude to determine the city weather.
   *
   * @return {Array} - Location data
   */
  const fetchCityFromSearchQuery = () => {
    const cityList = searchCity(searchQuery)
    cityList.then((result) => {
      if (result.status != 200) {
        setSearchQueryResponseFetched(false)
      } else {
        setSearchQueryResponse(result.data)
        setSearchQueryResponseFetched(true)
      }
    })
  }

  return (
    <>
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 my-10 ">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-80"
          type="text" placeholder="Search a city" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button" onClick={() => {
          fetchCityFromSearchQuery()
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
               stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>

        </button>
      </div>
      <OpenStreetMap data={searchQueryResponse}/>
    </>
  )
}

export default Search
