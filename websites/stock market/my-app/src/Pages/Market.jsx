import Data from "../Components/Data";
import SearchBar from "../Components/SearchBar";
import CandleStickChart from "../Components/Charts";
import { useState } from 'react';


function Market() {

    const [candleData, setCandleData] = useState([]);

    return(
        <>
        <h1>Market</h1>
        <SearchBar/>
        <Data setCandleData={setCandleData}/>
        <CandleStickChart candleData={candleData}/>
        </>
    )
}

export default Market;