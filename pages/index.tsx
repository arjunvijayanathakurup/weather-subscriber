import type { NextPage } from 'next'
import Head from 'next/head'
import NavBar from '../src/components/NavBar'
import Search from "../src/components/Search";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Weather Subscriber!</title>
        <meta name="description" content="Weather Subscriber!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <NavBar />
        <p className='text-center text-2xl'>Easily view the weather condition of a city using weather subscriber!</p>
        <p className='text-center text-l'>Search for the city using the search bar provided below and click the forward button.</p>
        <p className='text-center text-l'>The pin will be dropped to the searched city and you can view the climatic conditions of that city by clicking dialog shown after clicking the pin.</p>
        <Search />
      </main>

    </div>
  )
}

export default Home
