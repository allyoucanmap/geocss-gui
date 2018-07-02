/* copyright 2018, stefano bovio @allyoucanmap. */

<style scoped>
    .am-input {
        display: flex;
        flex: 1;
    }
    .am-input button {
        min-width: 24px;
        height: 24px;
        border-left: none; 
    }
</style>

<template lang="html">
    <div class="am-input">
        <am-color
            v-if="format === 'color'"
            :value="value"
            :on-change="color => onChange(color)"/>
        <am-slider
            v-if="format === 'number'"
            :value="value"
            :range="range"
            :step="step"
            :compact="compact"
            :options="options"
            :default-option="defaultOption"
            :on-change="number => onChange(number)"/>
        <am-text
            v-if="format === 'text'"
            :value="value"
            :styles="styles"
            :on-change="text => onChange(text)"/>
        <am-mark
            v-if="format === 'mark'"
            :value="value"
            :on-change="mark => onChange(mark)"/>
        <am-select
            v-if="format === 'select'"
            :value="value"
            :options="options"
            :default-option="defaultOption"
            :on-change="option => onChange(option)"/>
        <button
            v-if="onToggle"
            class="am-icon"
            @click="() => onToggle()">
            8
        </button>
    </div>
</template>

<script>
    import AmColor from './AmColor.vue';
    import AmSelect from './AmSelect.vue';
    import AmSlider from './AmSlider.vue';
    import AmText from './AmText.vue';
    import AmMark from './AmMark.vue';

    export default {
        components: {
            AmColor,
            AmSelect,
            AmSlider,
            AmText,
            AmMark
        },
        props: {
            value: {
                type: [String, Number, Object],
                default: ''
            },
            format: {
                type: String,
                default: ''
            },
            options: {
                type: Array,
                default: () => []
            },
            range: {
                type: Object,
                default: () => ({})
            },
            onChange: {
                type: Function,
                default: () => {}
            },
            defaultOption: {
                type: String,
                default: ''
            },
            onToggle: {
                type: Function,
                default: null
            },
            compact: {
                type: Boolean,
                default: false
            },
            step: {
                type: Number,
                default: 0
            },
            styles: {
                type: Object,
                default: null
            }
        }
    };
</script>