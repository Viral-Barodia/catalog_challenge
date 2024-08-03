import './chart.component.css';
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, CartesianGrid, Tooltip, Bar, BarChart } from 'recharts';
import { fetchData } from '../../services/financeData.service';
import Swal from 'sweetalert2';

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="value">{`${payload[0].value.toFixed(2)}`}</p>
            </div>
        );
    }
    return null;
}

export default function ChartComponent() {
    const [graphData, setGraphData] = useState([]);
    const [currency, setCurrency] = useState('USD');
    const [latestValue, setLatestValue] = useState(null);
    const [changedValue, setChangedValue] = useState(null);
    const customTooltipPos = { x: 800, y: 30, close: latestValue };

    
    const allowedDurations = ['1d','3d','1w','1mo', '6mo', '1y', 'max'];
    const [activeDuration, setActiveDuration] = useState('1mo');
    const [activeInterval, setActiveInterval] = useState('15m');
    const allTabs = ['Summary', 'Chart', 'Statistics', 'Analysis', 'Settings'];
    const [activeTab, setActiveTab] = useState('Chart');

    useEffect(() => {
        if(activeDuration && activeInterval) {
            fetchData({ interval: activeInterval, range: activeDuration })
            .then((data) => {
                setGraphData(data.chartData);
                setCurrency(data.currency);
                setLatestValue(data.latestValue);
                setChangedValue(data.changedValue);
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'The third-party API has malfunctioned!',
                });
            })
        }
    },[activeInterval,activeDuration]);

    function durationChanged(value) {
        const duration = value.target.innerHTML;
        if(duration !== '6mo' && duration !== '1y' && duration !== 'max') {
            setActiveInterval('15m');
        } else {
            setActiveInterval('1d');
        }
        setActiveDuration(duration);
    }

    function tabChanged(value) {
        setActiveTab(value.target.innerHTML);
    }

    return (
        <div className="outer-container">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <div className="container">
                <div className="price">
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span className="current-price">
                            {latestValue}
                            <span className="currency">{currency}</span>
                        </span>
                        <span className="stock-change">
                            {changedValue > 0 ?
                                <span className="increased-stock">+{changedValue}</span>
                                :
                                <span className="decreased-stock">{changedValue}</span>
                            }
                        </span>
                    </div>
                </div>
                <div className="menu">
                    <ul className="menu-list">
                        {allTabs.map(tab => (
                            <a href="#" className={`menu-item ${activeTab===tab ? 'active-tab' : ''}`} key={tab} onClick={tabChanged}><li>{tab}</li></a>
                        ))}
                    </ul>
                </div>
                <div className="actions">
                    <ul className="action-list">
                        <li className="action-item"><i className="fa fa-expand"> Fullscreen</i></li>
                        <li className="action-item"><i className="fa fa-plus-circle"> Compare</i></li>
                    </ul>
                    <div className="durations">
                        <ul className="duration-list">
                        {allowedDurations.map(duration => (
                            <li className={`duration-item ${duration===activeDuration ? 'active-duration' : ''}`} key={duration} onClick={durationChanged}>{duration}</li>
                        ))}
                        </ul>
                    </div>
                </div>
                <div className="chart">
                    <AreaChart width={839} height={200} data={graphData}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#E8E7FF" stopOpacity={0.8}/>
                                <stop offset="100%" stopColor="#FFF" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area stroke="#4B40EE" activeDot={{ r: 8 }} strokeWidth={2} dataKey="close" fill="url(#colorUv)" />
                        <CartesianGrid horizontal="" stroke="#ccc" />
                        <Tooltip content={<CustomTooltip/>} cursor={{ stroke: "#4B40EE", strokeDasharray: 5 }} />
                        {customTooltipPos && (
                            <g>
                                <rect x={customTooltipPos.x - 30} y={customTooltipPos.y - 30} width="60" height="20" fill="#4B40EE" />
                                <text x={customTooltipPos.x} y={customTooltipPos.y - 15} textAnchor="middle" fill="#fff">{customTooltipPos.close}</text>
                            </g>
                        )}
                    </AreaChart>
                    <BarChart width={839} height={50} data={graphData}>
                        <Bar dataKey="volume" fill="#6F7177" />
                    </BarChart>
                </div>
            </div>
        </div>
    )
}