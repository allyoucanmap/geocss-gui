/* copyright 2018, stefano bovio @allyoucanmap. */

<style scoped>
    .am-color {
        display: flex;
        flex: 1;
    }
    .am-color input {
        flex: 1;
        height: 24px;
    }
    .am-color button {
        height: 24px;
        min-width: 24px;
        border-left: none;
    }
    .am-color-picker {
        top: 0;
        left: 0;
        position: absolute;
        z-index: 500;
        display: flex;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
    }
    .am-color-picker .vc-chrome {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.24);
        border-radius: 0;
        margin: auto;
    }
</style>

<template lang="html">
    <div class="am-color">
        <input
            :value="color"
            @change="event => $am_onChange(event.target.value)"
            :style="`color: ${colorText}; background-color: ${color};`">
        <button
            :class="`am-icon ${enable ? 'am-active' : ''}`"
            @click="() => { enable = !enable; }">
            D
        </button>
        <div
            @click="$am_onToggle"
            class="am-color-picker"
            v-if="enable">
            <chrome
                :value="colors"
                @input="$am_onChange"/>
        </div>
    </div>
</template>

<script>
    import { Chrome } from 'vue-color';
    import tinycolor from 'tinycolor2';
    import {isString, isNil} from 'lodash';

    export default {
        components: {
            Chrome
        },
        props: {
            value: {
                type: String,
                default: ''
            },
            onChange: {
                type: Function,
                default: () => {}
            }
        },
        data(){
            return {
                enable: false,
                color: '',
                colorText: '#000000',
                colors: {
                    hex: ''
                }
            }
        },
        watch: {
            color(color) {
                if (!this.enable) {
                    this.onChange(color);
                }
            },
            value(newValue, oldValue) {
                if (!isNil(newValue) && newValue !== oldValue) {
                    this.colors = { hex: newValue };
                    this.color = newValue;
                    this.colorText = tinycolor.mostReadable(newValue, '#000000', {includeFallbackColors: true});
                }
            },
            enable(newEnable, oldEnable) {
                if (!newEnable && oldEnable) {
                    this.onChange(this.color);
                } else {
                    this.colors = { hex: this.color };
                    this.colorText = tinycolor.mostReadable(this.color, '#000000', {includeFallbackColors: true});
                }
            }
        },
        created() {
           if (!isNil(this.value)) {
                this.colors = { hex: this.value };
                this.color = this.value;
                this.colorText = tinycolor.mostReadable(this.value, '#000000', {includeFallbackColors: true});
            } else {
                this.colors = { hex: '' };
                this.color = '';
                this.colorText = '#000000';
            }
        },
        methods: {
            $am_onToggle(e){
                if (e && e.target && e.target.getAttribute('class') === 'am-color-picker') {
                    this.enable = !this.enable;
                }
            },
            $am_onChange(color) {
                const hex = !isString(color) && color.hex || color;
                this.colors = {hex};
                this.color = hex;
                this.colorText = tinycolor.mostReadable(hex, '#000000', {includeFallbackColors: true});
            }
        }
    };
</script>