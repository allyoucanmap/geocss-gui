/* copyright 2018, stefano bovio @allyoucanmap. */

<style>
    .am-mark {
        display: flex;
        flex: 1;
    }
    .am-mark input {
        flex: 1;
        height: 24px;
    }
    .am-mark button {
        height: 24px;
        min-width: 24px;
        border-left: none;
    }
    .am-mark-editor {
        top: 0;
        left: 0;
        position: absolute;
        z-index: 500;
        display: flex;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
    }
    .am-mark-editor .am-draw-editor {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.24);
        border-radius: 0;
        margin: auto;
        width: 100%;
        box-shadow: none;
    }
</style>

<template lang="html">
    <div class="am-mark">
        <input
            :value="mark"
            @change="event => $am_onChange(event.target.value)">
        <button
            class="am-icon"
            @click="() => { enable = !enable; }">
            D
        </button>
        <div
            @click="$am_onToggle"
            class="am-mark-editor"
            v-if="enable">
            <am-draw-editor
                :value="mark"
                :on-change="value => $am_onChange('wkt://' + value)"/>
        </div>
    </div>
</template>

<script>

    import {isNil} from 'lodash';
    import AmDrawEditor from '../editor/AmDrawEditor.vue';

    export default {
        components: {
            AmDrawEditor
        },
        props: {
            value: {
                type: [String, Number],
                default: ''
            },
            onChange: {
                type: Function,
                default: () => {}
            }
        },
        data(){
            return {
                mark: '',
                enable: false
            }
        },
        watch: {
            mark(mark) {
                this.onChange(mark);
            },
            value(newValue, oldValue) {
                if (!isNil(newValue) && newValue !== oldValue) {
                    this.mark = newValue;
                }
            }
        },
        created() {
            if (!isNil(this.value)) {
                this.mark = this.value;
            }
        },
        methods: {
            $am_onToggle(e){
                if (e && e.target && e.target.getAttribute('class') === 'am-mark-editor') {
                    this.enable = !this.enable;
                }
            },
            $am_onChange(mark) {
                this.mark = mark;
            }
        }
    };
</script>