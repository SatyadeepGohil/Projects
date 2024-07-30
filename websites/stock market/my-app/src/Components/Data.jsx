import axios from 'axios';
import React, { useEffect, useState} from 'react';


const API_KEY = 'HTDB0C6D5PR00F1S';
const BASE_URL = 'https://www.alphavantage.co/query';

function Data() {
    const [stockData, setStockData] = useState(null);
    const [candleData, setCandleData] = useState([]);


   const getStockData = async (symbol) => {
        try {
            const response = await axios.get(BASE_URL, {
                params: {
                    function: 'TIME_SERIES_DAILY',
                    symbol: symbol,
                    apikey: API_KEY,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching stock data:', error);
            throw error;
        }
    };

    useEffect(() => {
        async function fetchStockData() {
            try {
                const data = await getStockData('AAPL');
                const dailyData = data['Time Series (Daily)'];
                
                const candles = [];
                for (const date in dailyData) {
                    const daily = dailyData[date];
                    candles.push({
                        date: new Date(date),
                        open: parseFloat(daily['1. open']),
                        high: parseFloat(daily['2. high']),
                        low: parseFloat(daily['3. low']),
                        close: parseFloat(daily['4. close']),
                        volume: parseInt(values['5. volume'])
                    });
                }

                setStockData(data);
                setCandleData(candles);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        }
        fetchStockData();
    }, []);

    return (
        <div>
            {stockData ? (
                <pre>{JSON.stringify(stockData, null, 2)}</pre>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default Data;