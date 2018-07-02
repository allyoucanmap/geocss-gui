/* copyright 2018, stefano bovio @allyoucanmap. */

<style scoped>
    .am-select {
        display: flex;
        flex: 1;
    }
    .am-select > button {
        flex: 1;
        font-family: Inconsolata;
    }
    .am-select > button:first-child {
        border-left: 1px solid rgba(0, 0, 0, 0.12);
    }
    .am-select input {
        flex: 1;
        height: 24px;
    }
    .am-select button {
        height: 24px;
        min-width: 24px;
        border-left: none;
    }
</style>

<template lang="html">
    <div class="am-select">
        <button
            v-for="(option, idx) in options"
            :class="option === selected || !selected && option === defaultOption ? 'am-selected' : ''"
            :key="idx"
            @click="() => $am_onSelect(option)">
            {{ option }}
        </button>
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
            },
            defaultOption: {
                type: String,
                default: ''
            }
        },
        data(){
            return {
                selected: ''
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
            $am_onSelect(option) {
                this.selected = option;
                this.onChange(option);
            }
        }
    };
</script>