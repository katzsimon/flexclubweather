<!--
 The component that handles setting the background color of the app

 The background color transitions from this.colorMidnight at the start and end of the day
 To this.colorNoon at the noon time obtained from the weather data

 this.transitionInterval is the time in milliseconds of the interval loop
 e.g. 1000 = update the background color every 1 second
      60000 = update the bacground color every 1 minute

 color-convert npm package is used for color conversions between color spaces
-->
<template>
    <div>
    </div>
</template>

<script>
const convert = require('color-convert');
export default {
    name: 'BackgroundColor',
    data: function () {
        return {
            colorNoon:'#95c4ff',
            colorMidnight:'#030035',
            transitionInterval: 60000,

            second:0,
            interval:null,

            steps:[],
            currentColor:[],
            targetColor:[],
            ticks: 0,
        };
    },
    methods: {
        convertHsbToHex: function(h, s, b) {
            return '#'+convert.hsv.hex(h, s, b);
        },
        convertHexToHsb: function(h) {
            return convert.hex.hsv(h);
        },
        setup: function(){

            const data = this.$store.getters.getWeatherData();
            const timezone = this.$store.getters.getTimezoneOffset();
            let timeCurrentDayNoon = window.dayjs(data.noon*1000).utc().add(timezone, 'second');
            let timeCurrentDayTime = window.dayjs().utc().add(timezone, 'second');
            let timeCurrentDayStart = window.dayjs().utc().add(timezone, 'second')
                .hour(0)
                .minute(0)
                .second(0);
            let timeCurrentDayEnd = timeCurrentDayStart
                .add(23, 'hour')
                .add(59, 'minute')
                .add(59, 'second');
            let timeCurrent = null;
            let timeStart = null;
            let timeTarget = null;
            if (timeCurrentDayTime.unix()<timeCurrentDayNoon.unix() || timeCurrentDayTime.unix()<timeCurrentDayStart.unix()) {
                timeStart = timeCurrentDayStart;
                timeTarget = timeCurrentDayNoon;
                this.currentColor = this.convertHexToHsb(this.colorMidnight);
                this.targetColor = this.convertHexToHsb(this.colorNoon);
            } else {
                timeStart = timeCurrentDayNoon;
                timeTarget = timeCurrentDayEnd;
                this.currentColor = this.convertHexToHsb(this.colorNoon);
                this.targetColor = this.convertHexToHsb(this.colorMidnight);
            }

            // Epoch times for the animation
            timeStart = timeStart.unix();
            timeCurrent = timeCurrentDayTime.unix();
            timeTarget = timeTarget.unix();

            // Number of ticks for the animation
            this.ticks = Math.round((timeTarget - timeStart)*(1000/this.transitionInterval));
            // Calculate the step size for each HSB
            this.steps = [
                ((this.targetColor[0]-this.currentColor[0])/this.ticks),
                ((this.targetColor[1]-this.currentColor[1])/this.ticks),
                ((this.targetColor[2]-this.currentColor[2])/this.ticks)
            ];
            // Offset the start of the animation to the current time
            const offset = Math.round((timeCurrent - timeStart)*(1000/this.transitionInterval));
            // Offset the color ro the current time
            this.currentColor = [
                this.currentColor[0]+(offset*this.steps[0]),
                this.currentColor[1]+(offset*this.steps[1]),
                this.currentColor[2]+(offset*this.steps[2]),
            ];

            // Set the background color
            document.documentElement.style.setProperty('--bg', this.convertHsbToHex(...this.currentColor));

            // Reset the animation / Clear the interval if it has been set already
            if (this.interval!==null) clearInterval(this.interval);
            this.interval = setInterval(function(){
                // Increment the current color
                this.currentColor = [
                    this.currentColor[0]+this.steps[0],
                    this.currentColor[1]+this.steps[1],
                    this.currentColor[2]+this.steps[2]
                ];

                // Update the background color by setting the css variable --bg
                document.documentElement.style.setProperty('--bg', this.convertHsbToHex(...this.currentColor));

                // When the time reaches its target (noon or midnight), restart the animation switching the colors
                if (window.dayjs().utc().add(timezone, 'second').unix()>=timeTarget) {
                    this.setup();
                }
            }.bind(this), this.transitionInterval);

        },
    },
    beforeDestroy: function() {
        this.$eventHub.$off('changedCity');
        if (this.interval!==null) clearInterval(this.interval);
    },
    mounted: function() {
        this.$eventHub.$on('changedCity', this.setup);
        this.setup();
    }
}
</script>

<style>
:root {
    --bg: #95c4ff;
    --bg-transition: 950ms;
}
</style>
