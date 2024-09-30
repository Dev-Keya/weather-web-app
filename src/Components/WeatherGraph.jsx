import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register components for Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherGraph = ({ cityName, cityLabel }) => {
    const [weatherData, setWeatherData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const fetchWeatherData = async (city) => {
        if (!city || city.length < 3) return; // Don't fetch if input is too short

        const api_key = '376f7e0482a63ddae5568c2486e840ad';
        setIsFetching(true); // Start fetching

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${api_key}`
            );
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            console.log("Weather Data: ", data);

            const dailyData = data.list.reduce((acc, curr) => {
                const date = new Date(curr.dt * 1000).toLocaleDateString();
                const temp = curr.main.temp;

                if (!acc[date]) {
                    acc[date] = { date, tempSum: 0, count: 0 };
                }

                acc[date].tempSum += temp;
                acc[date].count += 1;

                return acc;
            }, {});

            const formattedData = Object.values(dailyData).map(({ date, tempSum, count }) => ({
                date,
                averageTemp: (tempSum / count).toFixed(1),
            }));

            setWeatherData(formattedData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false); // End fetching
        }
    };

    useEffect(() => {
        if (cityName) fetchWeatherData(cityName);
    }, []);

    const chartData = {
        labels: weatherData.map(item => item.date),
        datasets: [
            {
                label: `Average Temperature for ${cityLabel}`,
                data: weatherData.map(item => item.averageTemp),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
        },
    };

    return (
        <div className="weather-graph" id="weatherGraphCanvas">
            {isFetching ? (
                <p>Loading weather data...</p>
            ) : (
                <Line data={chartData} options={chartOptions} />
            )}
        </div>
    );
};

export default WeatherGraph;
