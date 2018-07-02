/* copyright 2018, stefano bovio @allyoucanmap. */

<style>
    .am-text {
        display: flex;
        flex: 1;
    }
    .am-text input {
        flex: 1;
        height: 24px;
    }
</style>

<template lang="html">
    <div class="am-text">
        <input
            :value="text"
            @change="event => $am_onChange(event.target.value)"
            :style="$_am_getStyle()">
    </div>
</template>

<script>

    import {isNil} from 'lodash';

    export default {

        props: {
            value: {
                type: [String, Number],
                default: ''
            },
            onChange: {
                type: Function,
                default: () => {}
            },
            styles: {
                type: Object,
                default: null
            }
        },
        data(){
            return {
                text: ''
            }
        },
        watch: {
            text(text) {
                this.onChange(text);
            },
            value(newValue, oldValue) {
                if (!isNil(newValue) && newValue !== oldValue) {
                    this.text = newValue;
                }
            }
        },
        created() {
            if (!isNil(this.value)) {
                this.text = this.value;
            }
        },
        methods: {
            $am_onChange(text) {
                this.text = text;
            },
            $_am_getStyle() {
                return this.styles && Object.keys(this.styles).reduce((string, key) => {
                    return string + key + ':' + this.styles[key] + ';'
                }, '');
            }
        }
    };
</script>