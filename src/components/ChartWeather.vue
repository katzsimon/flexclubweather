<!--
 Displays the chart of the selected days weather in a line chart

 Displays 8 plot points, if the selected day does not have 8 plot points,
 it pads the data with the next days weather data

 Yaxis changes in increments of 10 to fit the current weather temperatures

-->
<template>
    <div class="chart-wrapper">
        <apexchart height="300" type="line" :options="chartOptions" :series="series" class="chart"></apexchart>
    </div>
</template>


<script>
import VueApexCharts from 'vue-apexcharts'

export default {
    name: 'ChartWeather',
    components: {
        apexchart: VueApexCharts
    },
    data: function() {
        return {
            chartDate: null,
            chartOptions: {
                chart: {
                    id: 'temperature-chart',
                    width:'100%',
                    toolbar: {
                        show: false
                    },
                    background:'#fff',

                },
                colors:[
                    '#008FFB'
                ],
                markers: {
                    size: 8,
                    hover: {
                        size: 10,
                    }
                },
                xaxis: {
                    categories: ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'],
                    tooltip: {
                        enabled: false,
                    },
                    crosshairs: {
                        show: false,
                    },
                    title: {
                        text: 'Local Time'
                    }
                },
                yaxis: {
                    min:0,
                    max:50,
                    tickAmount: 5,
                    labels:{
                        style:{
                            color:['#f00'],
                            fontWeight:700,
                        }
                    },
                    title: {
                        text: 'Temperature ( Celcius )',
                    }
                },
                tooltip:{
                    enabled:true,
                    x: {
                        show: false,
                    },
                    onDatasetHover: {
                        highlightDataSeries: false,
                    },
                },

                grid: {
                    padding: {
                        top: 10,
                        right: 40,
                        bottom: 10,
                        left: 40
                    },
                }
            },
            series: [{
                name: 'Temperature (C)',
                data: [0, 0, 0, 0, 0, 0, 0, 0]
            }]
        }
    },
    mounted: function(){
        this.$eventHub.$on('changedCity', this.updateChart);
        this.$eventHub.$on('changedDate', this.updateChart);
        this.updateChart();
    },
    beforeDestroy: function() {
        this.$eventHub.$off('changedCity');
        this.$eventHub.$off('changedDate');
    },
    methods: {
        updateChart() {
            const chartData = this.$store.getters.getChartData();
            const city = this.$store.getters.getCurrentCity();
            this.series = [{data: chartData.data}];
            this.chartOptions = {...this.chartOptions, ...{
                xaxis: {
                    categories: chartData.xaxis,
                    title: {
                        text: `Local Time in ${city}`
                    }
                },
                yaxis: {
                    min:chartData.yaxis.min,
                    max:chartData.yaxis.max,
                    tickAmount: chartData.yaxis.ticks,
                }
            }};

        }
    }
};
</script>


<style scoped>
.chart-wrapper {
    padding-left:1rem;
}
.chart {
    width:100%;
    padding:0px;
}
</style>
