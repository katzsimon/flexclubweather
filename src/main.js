import Vue from 'vue';
import App from './App.vue';
import store from './store';

// Initialize dayjs with UTC plugin
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
window.dayjs = dayjs;

Vue.prototype.$eventHub = new Vue();

Vue.config.productionTip = false;

// eslint-disable-next-line object-shorthand
new Vue({
    store,
    render: (h) => h(App),
    beforeCreate() {
        // Restore the store from local storage
        this.$store.commit('initialiseStore');
    },
}).$mount('#app');
