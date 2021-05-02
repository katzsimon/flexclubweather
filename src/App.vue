<template>
    <div id="app">
        <weather-app v-if="isInitialized"></weather-app>
        <loading v-if="showLoading"></loading>
        <background-color v-if="isInitialized"></background-color>
    </div>
</template>

<script>
import Loading from './components/Loading';
import WeatherApp from './components/WeatherApp';
import BackgroundColor from './components/BackgroundColor';
import weatherAppEvents from './mixins/weatherAppEvents';

export default {
    name: 'App',
    mixins: [weatherAppEvents],
    components: {
        BackgroundColor,
        WeatherApp,
        Loading
    },
    data: function () {
        return {
        }
    },
    computed: {
        showLoading: function(){
            return this.$store.getters.isLoading;
        },
        isInitialized: function(){
            return this.$store.getters.isInitialized;
        }
    },
};
</script>

<style>
html {
    height:100%;
    width:100%;
    margin:0;
    padding:0;
}
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height:100%;
    width:100%;
    margin:0;
    padding:0;
    background-color: var(--bg);
    transition: background var(--bg-transition);
}
*,
*::before,
*::after {
    box-sizing: border-box;
    margin:0;
    padding:0;
}
#app {
    text-align: center;
    height:100%;
    width:100%;
    display:flex;
    justify-content: center;
    align-items: center;
}
@media(max-width:1000px) {
    #app {
        display:block;
        padding:1.5rem;
    }
}
</style>
