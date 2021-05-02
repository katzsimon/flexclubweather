<!--
    Component that holds the detailed components for the next 5 days
-->
<template>
    <div class="days">

        <day-details v-for="(day, index) in days" :key="index" :date="day"></day-details>

    </div>
</template>

<script>
import DayDetails from './DayDetails';
export default {
    name: 'Days',
    components: {
        DayDetails
    },
    data: function () {
        return {
            days: [],
        };
    },
    methods: {
        init: function(){
            this.days = this.$store.getters.getNext5Days();
        },
    },
    beforeDestroy: function() {
        this.$eventHub.$off('changedCity');
    },
    mounted: function () {
        this.$eventHub.$on('changedCity', this.init);
        this.init();
    },
};
</script>

<style scoped>
.days {
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
    padding: 0 0.75rem;
    min-height:300px;
    width: 100%;
}
@media(max-width:1000px) {
    .days {
        flex-direction:column;
        min-height:auto;
        padding:0 1.5rem;
    }
}
</style>


