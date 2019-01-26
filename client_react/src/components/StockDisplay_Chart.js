import React from 'react';
import moment from 'moment';
import { LineChart, Line, AreaChart, Area, Brush, XAxis, YAxis, CartesianGrid, Tooltip } from 'Recharts';

const StockDisplay_Chart = ({ data }) => (
    <LineChart width={600} height={200} data={data} syncId="anyId" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type='monotone' dataKey='open' stroke='#82ca9d' fill='#82ca9d' />
        <Brush />
    </LineChart>
    
);
export default StockDisplay_Chart;

