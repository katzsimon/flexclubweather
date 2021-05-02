/*
    Mixin that handles the main events for the app

    Initializes the app,
    Fetches data from the API,
    Receives and transmits the main events, for updating the City and Selected Day
 */
export default {
    data: function() {
        return {
            // Milliseconds timeout for when the data will automatically be refreshed
            refreshDataInterval:900000,
            // Seconds that the data is outdated
            outdatedAfter:890
        }
    },
    methods: {
        /**
         * Sets the currently selected city and fetches the related weather data
         *
         * @param newCity (string)
         * @param force (boolean)
         * @param init (boolean)
         */
        setCurrentCity: function(newCity, force, init){
            // Signals the call is made when the app is being initiated the first time
            init = init || false;
            // Forces new data to be fetched from the API
            force = force || false;
            // Don't fetch new data or emit changes if it is not required, ie changing to same city
            if ((newCity===undefined || newCity==='' || newCity===null)
                || (!init && !force && this.$store.getters.getCurrentCity()===newCity)) return;

            this.$store.commit('setCurrentCity', newCity);

            if (this.$store.state.currentDate===null) {
                this.$store.commit('setCurrentDate', window.dayjs().format('YYYY-MM-DD'));
            }
            const currentData = this.$store.getters.getWeatherData();
            // getData is the Promise used to sync fetching data from the API or the store
            let getData = null;
            let getDataCurrent = null;
            // Fetch data from the API if it does not exist in the store or is older than 15 minutes
            if (force || currentData===undefined || currentData.lastUpdated===undefined || window.dayjs().unix()-currentData.lastUpdated>this.outdatedAfter) {
                this.$store.commit('setLoading');

                // ** This would be more useful with a proper API subscription
                // Having this here to demonstrate syncing Promises
                getDataCurrent = fetch(encodeURI(`https://api.openweathermap.org/data/2.5/weather?appid=${this.$store.state.appid}&q=${newCity}&units=metric`))
                    .then((response) => response.json())
                    .then((responseData) => {
                        let data = {};
                        data.temperature_current = Math.round(responseData.main.temp);
                        //data.temperature_min = Math.round(responseData.main.temp_min);
                        //data.temperature_max = Math.round(responseData.main.temp_max);
                        data.lastUpdated = window.dayjs().unix();
                        data.icon_current = responseData.weather[0].description.replaceAll(' ', '_');
                        data.iconFallback_current = responseData.weather[0].icon;
                        data.description_current = responseData.weather[0].description;

                        this.$store.commit('setWeatherData', {city:newCity, weatherData:data});
                    });

                getData = fetch(encodeURI(`https://api.openweathermap.org/data/2.5/forecast?appid=${this.$store.state.appid}&q=${newCity}&units=metric&cnt=42`))
                    .then((response) => response.json())
                    .then((responseData) => {
                        let data = {};
                        let now = window.dayjs();
                        data.name = responseData.city.name;
                        data.lastUpdated = now.unix();

                        data.sunrise = responseData.city.sunrise;
                        data.sunset = responseData.city.sunset;
                        data.noon = Math.round(data.sunrise + (data.sunset - data.sunrise) / 2);
                        data.timezone = responseData.city.timezone;

                        let weathers = [];
                        responseData.list.forEach((weatherItem) => {
                            let weather = {};
                            weather.epoch = weatherItem.dt;
                            const datetimeItem = window.dayjs(weather.epoch*1000).utc().add(data.timezone, 'second');
                            weather.datetime = datetimeItem.format('YYYY-MM-DD HH:mm');
                            weather.date = datetimeItem.format('YYYY-MM-DD');
                            weather.time = datetimeItem.format('HH:mm');
                            weather.day = datetimeItem.format('ddd');

                            weather.temperature = Math.round(weatherItem.main.temp);
                            weather.icon = weatherItem.weather[0].description.replaceAll(' ', '_');
                            weather.iconFallback = weatherItem.weather[0].icon;
                            weather.description = weatherItem.weather[0].description;

                            weathers.push(weather);
                        });

                        data.weathers = weathers;
                        this.$store.commit('setWeatherData', {city:newCity, weatherData:data});

                    })
                    .catch(() => {});
            } else {
                // Resolve the promise if valid data is retrieved from the store
                getData = new Promise(function(resolve) {
                    resolve();
                });
                getDataCurrent = new Promise(function(resolve) {
                    resolve();
                });
            }

            // Ensure the data has been fetched from the API or store
            Promise.all([getData, getDataCurrent]).then(() => {
                this.$store.commit('setLoaded');
                this.$eventHub.$emit('changedCity');

                // Check if the current selected date still exists after timezone changed
                const date = this.$store.getters.getCurrentDate();
                const days = this.$store.getters.getNext5Days();
                if (!days.includes(date)) {
                    // If the day is not in the new 'next 5 days' then set it to the first day
                    this.setCurrentDate(days[0]);
                }

                if (init===true) {
                    // Signal the app has been initialized after the initial setup call
                    this.$store.commit('setInitialized');
                }
            });

        },
        /**
         * Handles if the date changes from clicking a new DayDetails component or fom timezone change
         *
         * @param newDate (string date in YYYY-MM-DD format - E.g. 2021-05-01)
         */
        setCurrentDate: function(newDate) {
            this.$store.commit('setCurrentDate', newDate);
            this.$eventHub.$emit('changedDate');
        },
    },
    beforeDestroy: function() {
        this.$eventHub.$off('setCurrentCity');
        this.$eventHub.$off('setCurrentDate');
        if (this.refresh!==null) clearInterval(this.refresh);
    },
    mounted: function(){
        this.$eventHub.$on('setCurrentCity', this.setCurrentCity);
        this.$eventHub.$on('setCurrentDate', this.setCurrentDate);

        // Set default City, if not set
        if (this.$store.state.currentCity===null) {
            this.$store.commit('setCurrentCity', this.$store.state.cities[0]);
        }

        if (this.$store.state.currentDate===null) {
            this.$store.commit('setCurrentDate', null);
        }

        // Initiate the first selection
        this.$eventHub.$emit('setCurrentCity', this.$store.state.currentCity, false, true);

        // Refresh every 15 minutes
        this.refresh = setInterval(function(){
            this.setCurrentCity(this.$store.getters.getCurrentCity(), true);
        }.bind(this), this.refreshDataInterval);

    }
}
