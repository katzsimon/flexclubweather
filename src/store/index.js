import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

/**
 * Vuex store that
 *
 */

const store =  new Vuex.Store({
    state: {
        // API key for the openweathermap feed
        appid: 'fa3bffceabed747f413432785aebee42',
        isInitialized: false,
        loading:true,
        // Holds the data fetched from the API
        weatherData: {},
        currentCity:null,
        currentDate:null,
        // Cities enabled for the weather app
        cities: [
            'Cape Town',
            'Amsterdam',
            'Guadalajara',
            'London',
            'Sydney',
            'Tokyo'
        ]
    },
    mutations: {
        /**
       * Initialize the store and app
       *
       * Attempt to load previous stored data from localStorage
       *
       * @param state
       */
        initialiseStore(state) {
            if(localStorage.getItem('store')) {
                try {
                    let stored = localStorage.getItem('store');
                    stored = JSON.parse(stored);
                    state = {...state, ...stored};
                    this.replaceState(state);
                } catch(e) {
                    //
                }
            }
        },
        setCurrentCity (state, city) {
            state.currentCity = city;
        },
        setCurrentDate (state, date) {
            if (date===null) date = window.dayjs().format('YYYY-MM-DD');
            state.currentDate = date;
        },
        setLoading (state) {
            state.loading = true;
        },
        setLoaded (state) {
            state.loading = false;
        },
        setWeatherDataCurrent (state, data) {
            state.weatherData[data.city] = data.weatherData;
        },
        setWeatherData (state, data) {
            if (state.weatherData[data.city]===undefined) state.weatherData[data.city] = {};
            state.weatherData[data.city] = {...state.weatherData[data.city], ...data.weatherData};
        },
        setCity (state, city) {
            state.testCity = city;
        },
        setInitialized(state) {
            state.isInitialized = true;
        }
    },
    getters: {
        // Signifies when the app has loaded for the first time
        isInitialized: (state) => {
            return state.isInitialized;
        },
        // Returns a formatted time, with the timezone offset
        timeFormat: (state) => (utc, format) => {
            if (utc===null) utc = window.dayjs();
            // Convert seconds to milliseconds if needed
            if (utc<1000000000000) utc = utc * 1000;
            format = format ?? 'YYYY-MM-DD HH:mm:ss';
            const timezone = state.weatherData[state.currentCity].timezone;
            return window.dayjs(utc).utc().add(timezone, 'second').format(format);
        },
        // Get the timeazone offset for the current city
        getTimezoneOffset: (state) => () => {
            return state.weatherData[state.currentCity].timezone;
        },
        // Return if the loading component should show
        // eslint-disable-next-line no-unused-vars
        isLoading: (state) => {
            return state.loading;
        },
        // Get the currently selected city, or the first city in the array
        getCurrentCity: (state) => () => {
            if (state.currentCity===null) return state.cities[0];
            return state.currentCity;
        },
        // Get the currently selected date
        getCurrentDate: (state) => () => {
            return state.currentDate;
        },
        // Get the data for the currently selected city
        getWeatherData: (state, getters) => () => {
            if (state.weatherData[getters.getCurrentCity()]===undefined) return {};
            return state.weatherData[getters.getCurrentCity()];
        },
        // Get the time data needed for the clock
        getTimeData: (state, getters) => () => {
            let timeData = {};
            const data = getters.getWeatherData();
            const timezone = data.timezone;
            const noon = data.noon;
            const theTime = window.dayjs().utc().add(timezone, 'second');
            timeData.hour = parseInt(theTime.format('H'));
            timeData.minute = parseInt(theTime.format('m'));
            timeData.second = parseInt(theTime.format('s'));
            timeData.noon = window.dayjs(noon * 1000).utc().add(timezone, 'second').format('HH:mm');
            timeData.date = theTime.format('YYYY-MM-DD');
            timeData.lastUpdated = window.dayjs(data.lastUpdated * 1000).format('HH:mm:ss');
            return timeData;
        },
        // Build the array containing the dates for the next 5 days
        getNext5Days: (state, getters) => () => {
            const data = getters.getWeatherData().weathers;
            let days = [];
            for (let i=0; i<data.length; i+=1) {
                const item = data[i];
                if (days.length<5 && !days.includes(item.date)) days.push(item.date);
                if (days.length===5) break;
            }
            return days;
        },
        // Return the detailed data for a date
        getWeatherDayData: (state, getters) => (date) => {
            const data = getters.getWeatherData().weathers;
            let weather = [];
            let starting = false;
            let count = 0;
            for (let i=0; i<data.length; i+=1) {
                const item = data[i];
                // Check for when item first finds the date
                if (item.date===date) starting = true;
                if (starting) {
                    count += 1;
                    // Use the 5th time entry of the day as the main temperature
                    if (count===5) {
                        weather = item;
                        // Stop the loop when the desired item is found
                        break;
                    }
                }
            }

            if (weather.length===0) {
                weather = data[0];
            }
            weather.city = state.currentCity;

            // ** This wouldn't be needed with a proper API subscription
            // Get the maximum and minimum temperates for the day
            let temperature_min = 0;
            let temperature_max = 0;
            const days = data.filter(function(item) {
                return item.date===date;
            }.bind(this));
            if (days.length>0) {
                temperature_min = days.reduce(function (currentMin, loopDay) {
                    return loopDay.temperature < currentMin.temperature ? loopDay : currentMin;
                }).temperature;
                temperature_max = days.reduce(function (currentMax, loopDay) {
                    return loopDay.temperature > currentMax.temperature ? loopDay : currentMax;
                }).temperature;
            }
            if (temperature_max<data.temperature) {
                temperature_max = data.temperature;
            }
            if (temperature_min>data.temperature) {
                temperature_min = data.temperature;
            }
            weather.temperature_max = temperature_max;
            weather.temperature_min = temperature_min;
            // ---

            return weather;
        },
        // Return the data needed for the chart
        getChartData: (state, getters) => () => {
            const wdata = getters.getWeatherData();
            const date = state.currentDate;
            let chartData = {};
            chartData.data = [];
            chartData.xaxis = [];
            chartData.yaxis = [];
            chartData.yaxis.min = 0;
            chartData.yaxis.max = 0;
            let adding = false;
            for (let i=0; i<wdata.weathers.length; i+=1) {
                const item = wdata.weathers[i];                // Start processing the item when the relevant date is reached
                if (item.date===date || item.date>date) {
                    adding = true;
                }

                if (adding===true) {
                    chartData.data.push(item.temperature);
                    chartData.xaxis.push(item.time);
                    if (item.temperature<chartData.yaxis.min) chartData.yaxis.min = item.temperature;
                    if (item.temperature>chartData.yaxis.max) chartData.yaxis.max = item.temperature;
                }

                // Stop processing the loop when 8 items have been added
                // This allows the current day to wrap to the next day if more hours are needed
                if (chartData.data.length===8) break;
            }

            // If temperature goes below 0, calculate the ymin value. Example: -3 -> -10
            if (chartData.yaxis.min<0) chartData.yaxis.min = Math.floor(chartData.yaxis.min/10)*10;
            // Set the ymax value to be rounded to nearest higher 10. Examples: 25 -> 30, 10 -> 20
            chartData.yaxis.max = Math.ceil((chartData.yaxis.max+1)/10)*10;
            // Set the ticks/intervals to be the range / 10
            chartData.yaxis.ticks = Math.round((chartData.yaxis.max+Math.abs(chartData.yaxis.min))/10);

            return chartData;
        },
    },
    actions: {
    },
});
/*
 Save the fetched data and state
 Allows the app to return to its previous state (selected city and day) and fetched data if it is not outdated
*/
store.subscribe((mutation, state) => {
    let saveState = {};
    saveState.weatherData = state.weatherData;
    saveState.currentCity = state.currentCity;
    saveState.currentDate = state.currentDate;

    localStorage.setItem('store', JSON.stringify(saveState));
});

export default store;
