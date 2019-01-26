import React from 'react';
import StockDisplay_Chart from './StockDisplay_Chart';

export const StockDisplay = ({ symbol, name, type, region, marketOpen, marketClose, timezone, currency, data }) => (
  <div>
    <h1>{symbol}</h1>
    {
      name ?
        <h2>{name}</h2> :
        <h2>Loading...</h2>
    }
    {
      type ?
        <h2>{type}</h2> :
        <h2>Loading...</h2>
    }
    {
      region ?
        <h2>{region}</h2> :
        <h2>Loading...</h2>
    }
    {
      marketOpen ?
        <h2>{marketOpen}</h2> :
        <h2>Loading...</h2>
    }
    {
      marketClose ?
        <h2>{marketClose}</h2> :
        <h2>Loading...</h2>
    }
    {
      timezone ?
        <h2>{timezone}</h2> :
        <h2>Loading...</h2>
    }
    {
      currency ?
        <h2>{currency}</h2> :
        <h2>Loading...</h2>
    }
    <StockDisplay_Chart data = {data}/>
  </div>
);


export default StockDisplay;
