/* copyright 2018, stefano bovio @allyoucanmap. */

import Vue from 'vue';
import AmApp from './layouts/AmApp.vue';
import store from './store.js';

const app = new Vue({
    el: '#app',
    store,
    components: {
        AmApp
    },
    template: '<am-app></am-app>'
});

export default app;
