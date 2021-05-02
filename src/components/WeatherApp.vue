<!--
    The main component of the weather app
-->
<template>
    <div class="weather-app">
        <clock v-if="isInitialized"></clock>
        <city-selector v-if="isInitialized"></city-selector>
        <days v-if="isInitialized"></days>
        <chart-weather></chart-weather>
    </div>
</template>

<script>
import CitySelector from './CitySelector';
import Clock from './Clock';
import Days from './Days';
import ChartWeather from './ChartWeather';
export default {
    name: 'WeatherApp',
    components: {
        ChartWeather,
        Clock,
        CitySelector,
        Days
    },
    computed: {
        isInitialized: function(){
            return this.$store.getters.isInitialized;
        }
    },
    methods: {
    },
    beforeDestroy: function() {
    },
    mounted: function(){
    }
}
</script>

<style scoped>
.weather-app {
    border:2px solid #333;
    width:950px;
    background:#fff;
    box-shadow:0 5px 15px rgba(0, 0, 0, 0.3);
    position:relative;
}
@media(max-width:1000px) {
    .weather-app {
        width: 100%;
    }
}
</style>
