import { environment } from "../environment/environment";
import axios from "axios";

export const fetchData = async(params={ interval: '', range: '' }) => {
    try {
        const response = await axios.get(`${environment.apiUrl}?interval=${params.interval}&range=${params.range}`);
        if (!response.data.error) {
            const timestamps = response.data.chart.result[0].timestamp;
            const quotes = response.data.chart.result[0].indicators.quote[0];
            const chartData = timestamps.map((time, index) => ({
                date: new Date(time * 1000).toISOString().split('T')[0],
                close: quotes.close[index],
                volume: quotes.volume[index]
            }));
            return {
                chartData,
                currency: response.data.chart.result[0].meta.currency,
                latestValue: quotes.close[quotes.close.length - 1].toFixed(2),
                changedValue: quotes.close.length > 1
                    ? (quotes.close[quotes.close.length - 1] - quotes.close[quotes.close.length - 2]).toFixed(2)
                    : null
            };
        } else {
            console.error(response.data);
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};