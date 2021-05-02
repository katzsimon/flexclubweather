<!--
    Displays for the selected city:
    1) Current time
    2) The noon time

    It also shows when the data was last updated
-->
<template>
    <div class="clock">
        <div>
            Current Time in {{ displayCity }}: <br class="mobile"><span class="bold">{{ date }} {{ displayHour }}:{{ displayMinute }}:{{ displaySecond }}</span>
        </div>
        <div>
            Noon in {{ displayCity }}: {{ noon }}
        </div>
        <div>
            Last Updated: {{ lastUpdated }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Clock',
    data: function () {
        return {
            hour:0,
            minute:0,
            second:0,
            interval:null,
            noon:null,
            date:null,
            lastUpdated: null
        };
    },
    props: {
        city: String,
        timezone: Number,
    },
    computed: {
        displayCity: function(){
            return this.$store.getters.getCurrentCity();
        },
        displayHour: function(){
            return this.hour<10 ? '0'+this.hour.toString() : this.hour.toString();
        },
        displayMinute: function(){
            return this.minute<10 ? '0'+this.minute.toString() : this.minute.toString();
        },
        displaySecond: function(){
            return this.second<10 ? '0'+this.second.toString() : this.second.toString();
        }
    },
    methods: {
        /**
         * Increase the time by 1 second
         */
        incrementSecond: function(){
            this.second += 1;
            if (this.second===60) {
                this.second = 0;
                this.minute += 1;
            }
            if (this.minute===60) {
                this.minute = 0;
                this.hour += 1;
            }
            if (this.hour===24) {
                this.second = 0;
                this.minute = 0;
                this.hour = 0;
            }
        },
        /**
         * Increase the clock by 1 minute
         */
        incrementMinute: function(){
            this.minute += 1;
            if (this.minute===60) {
                this.minute = 0;
                this.hour += 1;
            }
            if (this.hour===24) {
                this.second = 0;
                this.minute = 0;
                this.hour = 0;
            }
        },
        init: function(){
            const timeData = this.$store.getters.getTimeData();
            this.hour = timeData.hour;
            this.minute = timeData.minute;
            this.second = timeData.second;
            this.noon = timeData.noon;
            this.date = timeData.date;
            this.lastUpdated = timeData.lastUpdated;
        }
    },
    beforeDestroy: function() {
        this.$eventHub.$off('changedCity');
    },
    mounted: function(){

        this.$eventHub.$on('changedCity', this.init);
        this.init();

        // Run the clock
        // Can easily be changed to increment by 1 minute
        setInterval(function(){
            this.incrementSecond();
        }.bind(this), 1000);
    }
}
</script>

<style scoped>
.clock {
    position:relative;
    margin:1rem;
    display:flex;
    flex-direction: row;
    justify-content: space-around;
}
.bold {
    font-weight:bold;
}
.mobile {
    display:none;
}
@media(max-width:1000px) {
    .mobile {
        display:block;
    }
    .clock {
        flex-direction: column;
    }
    .clock > div {
        margin:0.25rem;
    }
}
</style>
