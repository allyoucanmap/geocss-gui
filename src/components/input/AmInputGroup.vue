/* copyright 2018, stefano bovio @allyoucanmap. */

<style scoped>
    .am-label {
        margin-bottom: 4px;
        font-size: 14px;
        display: flex;
        align-items: center;
    }
    .am-label div {
        flex: 1;
    }
    .am-label button {
        border: none;
    }
    .am-input-group {
        margin-bottom: 8px;
    }
    .am-label-text {
        font-family: EBGaramond12-Regular, 'EB Garamond';
    }
    .am-label-text * {
        font-family: EBGaramond12-Regular, 'EB Garamond';
    }
    .am-btn {
        opacity: 0.5;
        font-size: 10px;
    }
</style>

<template lang="html">
    <div class="am-input-group">
        <div
            v-if="!active"
            :class="`am-label ${disabled && 'am-disabled'}`">
            <div
                :key="label"
                class="am-label-text">{{ label }}</div>
        </div>
        <am-input
            :value="value"
            :format="type.format"
            :options="type.options"
            :range="type.range"
            :step="type.step"
            :styles="styles"
            :default-option="defaultOption"
            :on-change="val => onChange(val)"
            :on-toggle="type.transformation ? () => onChange({}) : null"/>
    </div>
</template>

<script>
    import {isObject, isNil} from 'lodash';
    import AmInput from './AmInput.vue';

    export default {
        components: {
            AmInput
        },
        props: {
            value: {
                type: [String, Number, Object],
                default: undefined
            },
            label: {
                type: String,
                default: ''
            },
            active: {
                type: Boolean,
                default: false
            },
            type: {
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
            styles: {
                type: Object,
                default: null
            }
        },
        data(){
            return {
                disabled: false
            }
        },
        watch: {
            disabled(newDisabled, oldDisabled) {
                if (newDisabled && !oldDisabled && !isNil(this.value)) {
                    this.onChange(undefined);
                }
            },
            value(newValue) {
                this.disabled = isNil(newValue);
            }
        },
        created() {
            this.disabled = isNil(this.value);
        },
        methods: {
            $am_isObject(value) {
                return value && !value.number && !value.unit && isObject(value);
            }
        }
    };
</script>