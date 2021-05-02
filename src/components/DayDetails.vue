<!--
    Show detailed weather information for the day

    Select a new current day by click on the component
-->
<template>
    <div class="day" ref="aday" @click="selectDay" v-bind:class="[active ? 'active' : '']">

        <div class="name">{{ displayName }}</div>
        <div class="date">{{ displayDate }}</div>

        <div class="icon">
            <icon-weather :icon="icon" :icon-fallback="iconFallback" :active="active"></icon-weather>
        </div>

        <div class="temperature">
            <div class="bold">{{ temperature_current }} C</div>
            <div class="minmax">Min {{ temperature_min }} / Max {{ temperature_max }}</div>
        </div>

        <div class="description">
            {{ description }}
        </div>

    </div>
</template>

<script>
import IconWeather from './IconWeather';
export default {
    name: 'DayDetails',
    components: {
        IconWeather
    },
    data: function () {
        return {
            active:false,
            name:'',
            icon:'',
            iconFallback:'',
            temperature_current:'',
            temperature_min:'',
            temperature_max:'',
            description:'',
        };
    },
    props: {
        date: String,
    },
    methods: {
        /*
         Set a random angle to rotate when the component is active
         */
        setRotateAngle() {
            // Random angle between 3 and 12 degrees
            let rotateAngle = Math.floor((Math.random()*9+3));
            // Random left or right direction
            const direction = Math.random()<0.5 ? 1:-1;
            rotateAngle = rotateAngle*direction;
            const aday = this.$refs['aday'];
            if (typeof aday!=='undefined') this.$refs['aday'].style.setProperty('--rotate-angle', `${rotateAngle.toString()}deg`);
        },
        selectDay(){
            if (this.active===false) {
                // Only trigger a new date selection if the day is not selected
                this.$eventHub.$emit('setCurrentDate', this.date);
            }
        },
        init(){
            const dayData = this.$store.getters.getWeatherDayData(this.date);
            this.temperature_current = dayData.temperature;
            this.temperature_min = dayData.temperature_min;
            this.temperature_max = dayData.temperature_max;
            this.description = dayData.description;
            this.icon = dayData.icon;
            this.iconFallback = dayData.iconFallback;
            this.active = (this.currentDate === this.date);
            this.setRotateAngle();
        }
    },
    computed: {
        displayName: function(){
            return window.dayjs(this.date).format('ddd');
        },
        displayDate: function(){
            return this.date;
        },
        currentDate: function(){
            return this.$store.getters.getCurrentDate();
        }
    },
    watch: {
        // eslint-disable-next-line no-unused-vars
        date: function(newValue){
            this.init();
        }
    },
    beforeDestroy: function() {
        this.$eventHub.$off('changedCity');
        this.$eventHub.$off('changedDate');
    },
    mounted: function () {
        this.$eventHub.$on('changedCity', this.init);
        this.$eventHub.$on('changedDate', this.init);
        this.init();
    },
};
</script>

<style scoped>
.day {
    width:10rem;
    border:2px solid #888;
    display:flex;
    flex-direction:column;
    padding:1rem;
    background:#fff;
    margin:0.75rem;
    backface-visibility: hidden;
    transform: translateZ(0);
    cursor:pointer;
    box-shadow:0 4px 4px rgba(0,0,0,0.3);
    transition: transform 300ms, box-shadow 300ms, border 300ms, border 300ms;
    --rotate-angle: -10deg;
}
.day:hover {
    border-radius: 8px;
    border:2px solid #000;
    box-shadow:0 5px 12px rgba(0,0,0,0.5);
    transform: translate3d(0, -0.3rem, 0);
    transition: transform 300ms, box-shadow 300ms, border 300ms, border 300ms;
}
.day.active {
    border-radius: 8px;
    border:2px solid #000;
    box-shadow:0 5px 12px rgba(0,0,0,0.5);
    transform: translate3d(0, -0.3rem, 0) rotate3d(1,1,1,var(--rotate-angle));
    transition: transform 300ms, box-shadow 300ms, border 300ms, border 300ms;
}
.day.active .name {
    color:#008FFB;
}

.name {
    font-weight:bold;
    font-size:1.25rem;
}
.date {
    font-size:0.7rem;
    margin-bottom:1rem;
}
.description {
    font-size:0.8rem;
    text-transform: capitalize;
    font-weight:bold;
}
.temperature {
    margin-bottom:1rem;
}
.minmax {
    font-size:0.8rem;
}
.bold {
    font-weight:bold;
}
@media(max-width:1000px) {
    .day {
        width:100%;
        margin:1.5rem;
        padding:1.25rem;
    }
    .day .name {
        font-size:1.5rem;
    }
}
</style>
