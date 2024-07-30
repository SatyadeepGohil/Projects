import Data from "./Data";
import React, { useEffect, useRef} from 'react';
import * as d3 from 'd3';

const CandleStickChart = ({candledData}) =>  {
    const svgref = useRef(null);

    return (
        <>
        <svg ref={svgref} width={640} height={400} style={{ background: 'white'}}></svg>
        </>
    )
}


export default CandleStickChart;