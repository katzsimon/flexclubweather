<!--
    Allows the User to select the current city
-->
<template>
    <div class="select-city">

        <select v-model="selectedCity" @change="selectNewCity">
            <option v-for="(city, index) in cities" :value="city" v-bind:key="index">{{ city }}</option>
        </select>

    </div>
</template>

<script>
export default {
    name: 'CitySelector',
    data: function () {
        return {
            selectedCity: '',
        };
    },
    methods: {
        selectNewCity: function(){
            this.$eventHub.$emit('setCurrentCity', this.selectedCity);
        },
        changedCity: function(){
            this.selectedCity = this.$store.getters.getCurrentCity();
        }
    },
    watch:{
    },
    computed: {
        cities: function(){
            return this.$store.state.cities;
        }
    },
    beforeDestroy: function() {
        this.$eventHub.$off('changedCity');
    },
    mounted: function () {
        this.$eventHub.$on('changedCity', this.changedCity);
        if (this.selectedCity==='') {
            this.selectedCity = this.$store.getters.getCurrentCity();
        }
    }
};
</script>

<style scoped>
.select-city {
    margin:1rem 1.5rem;
    position:relative;
}
select {
    padding:1rem;
    width:100%;
    border:2px solid #888;
    font-size:1rem;
    font-weight:bold;
    box-shadow:0 3px 3px rgba(0,0,0,0.2);
    outline:none;
}
select:focus {
    outline:none;
}
</style>
