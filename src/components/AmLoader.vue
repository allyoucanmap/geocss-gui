/* copyright 2018, stefano bovio @allyoucanmap. */

<style scoped>
    .am-loader {
        position: relative;
        background-color: #333333;
    }
    @keyframes start-loading {
        0% { left: 0;}
        50% { left: 75%;}
        100% { left: 0;}
    }
    .am-loader div {
        opacity: 1;
        position: absolute;
        background-color: #91f3f7;
        width: 25%;
        height: 2px;
        top: 1px;
        animation-name: start-loading;
        animation-duration: 8s;
        animation-iteration-count: infinite;
    }
    .am-loader div.am-hide {
        opacity: 0;
    }
</style>

<template lang="html">
    <div class="am-loader">
        <div :class="`${loading ? '' : 'am-hide'}`"/>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        data() {
            return {
                
            }
        },
        computed: {
            ...mapGetters({
                loading: 'app/loading'
            })
        },
    };
</script>