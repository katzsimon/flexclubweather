<!--
    Display the applicable weather icon

    Show the corresponding Climaicon if it exists in /images/icons

    1) camel_case the weather description from the feed (light_rain)
    2) If it is before 6am or after 8pm in the selected city, then show the night icon (light_rain_night)
    3) If it is the selected day, then show the animated Climaicon if it exists (light_rain_night_active)
    4) Append .svg (light_rain_night_active.svg) for the icon URL
    5) Try load the image in an Image element
    6) If the image loads (a custom svg icon exists), then set the icon to the icon URL
    7) If the image does not load (a custom icon has not been created yet), then fallback to the icon from the API

    Climaicons: https://github.com/christiannaths/Climacons-Font
    Animated Climaicon: https://github.com/noahblon/animated-climacons
    (Some of the animated icons are incorrect / do not exist)
-->
<template>
    <div>
        <img :src="getSrc" alt="Weather icon">
    </div>
</template>

<script>
export default {
    name: 'IconWeather',
    data: function () {
        return {
            src:'',
        };
    },
    props: {
        icon: {type:String, default:''},
        iconFallback: {type:String, default:''},
        active: {type:Boolean, default:false},
        date: {type:String, default:''},
    },
    computed: {
        getSrc: function(){
            return this.src;
        },
        showSrc: function(){
            return this.src.replace('/images/icons/', '');
        }
    },
    watch: {
        active: function () {
            this.setIcon();
        },
        icon: function () {
            this.setIcon();
        },
    },
    methods: {
        setUrl: function(icon){
            let url = `/images/icons/${icon}`;
            // Check if the icon should be the night version
            const hour = parseInt(this.$store.getters.timeFormat(null, 'HH'));
            if (hour<6 || hour>20) {
                url += '_night';
            }
            // Show the active icon if the day is currently selected
            if (this.active) {
                url += '_active';
            }
            url += '.svg';
            let img = document.createElement('IMG');
            // Check if the applicable SVG icon exists
            img.src = url;
            img.onerror=function(){
                // If the climaicon fails to load, use the icon from hte API
                this.src=`http://openweathermap.org/img/wn/${this.iconFallback}@2x.png`;
            }.bind(this);
            img.onload=function(){
                this.src=url;
            }.bind(this);

        },

        setIcon: function(){
            // Timeout needed to get this to work after it has loaded
            setTimeout(function(){
                this.setUrl(this.icon);
            }.bind(this),  100);
        }
    },
    beforeDestroy: function() {
        this.$eventHub.$off('changedDate');
        this.$eventHub.$off('changedCity');
    },
    mounted: function(){
        this.$eventHub.$on('changedDate', this.setIcon);
        this.$eventHub.$on('changedCity', this.setIcon);
        this.setIcon();
    }
}
</script>

<style scoped>
    img {
        width:100%;
        object-fit:contain;
    }
    @media(max-width:1000px) {
        img {
            max-height:120px;
        }
    }
</style>

