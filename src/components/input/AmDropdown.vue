/* copyright 2018, stefano bovio @allyoucanmap. */

<style scoped>
    .am-dropdown {
        position: relative;
        flex: 1;
    }
    .am-head {
        display: flex;
        flex: 1;
    }
    .am-list {
        position: absolute;
        max-height: 150px;
        overflow: auto;
        right: 0;
    }
    .am-item {
        padding: 2px 8px;
        cursor: default;
    }
    .am-item:hover {
        background-color: #91f3f7;
    }
    .am-icon {
        transition: all 0.3s;
    }
    .am-head button {
        min-width: 24px;
        height: 24px;
    }
</style>

<template lang="html">
    <div class="am-dropdown">
        <div class="am-head">
            <input 
                :value="value"
                @change="event => $am_onChange(event.target.value)">
            <button
                class="am-icon"
                @click="() => $am_onToggle()"
                :style=" !show ? 'transform: rotateZ(-90deg); border-top: none;' : 'transform: rotateZ(-180deg); border-right: none;'">
                {{ 'T' }}
            </button>
        </div>
        <div
            v-if="show"
            class="am-list">
            <div 
                v-for="(option, idx) in options"
                class="am-item"
                :key="idx"
                @click="() => $am_onChange(option)">
                {{ option }}
            </div>
        </div>
    </div>
</template>

<script>
    import {isNil} from 'lodash';

    export default {
        props: {
            value: {
                type: String,
                default: ''
            },
            options: {
                type: Array,
                default: () => []
            },
            onChange: {
                type: Function,
                default: () => {}
            }
        },
        data(){
            return {
                selected: '',
                show: false
            }
        },
        watch: {
            value(value) {
                if (!isNil(value)) {
                    this.selected = value;
                }
            }
        },
        created() {
            if (!isNil(this.value)) {
                this.selected = this.value;  
            }
        },
        methods: {
            $am_onChange(value) {
                this.show = false;
                this.onChange(value);
            },
            $am_onToggle() {
                this.show = !this.show;
            }
        }
    };
</script>