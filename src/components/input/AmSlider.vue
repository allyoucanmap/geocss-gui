/* copyright 2018, stefano bovio @allyoucanmap. */

<style scoped>
    .am-slider-container {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .am-slider-container .am-slider {
        margin-top: 6px;
    }
    .am-slider-container .am-slider-input {
        display: flex;
    }
    .am-slider-container .am-slider-input input {
        flex: 1;
    }
    .am-slider-container .am-slider-input button {
        height: 24px;
        width: 24px;
        border-left: none;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .am-slider-container.am-compact .am-slider {
        margin-top: 0;
    }
    .am-slider-container.am-compact {
        height: 24px;
    }
    .am-slider-container.am-compact input {
        height: 20px;
        margin-top: 0;
    }
    .am-slider {
        width: 100%;
    }
</style>

<template lang="html">
    <div :class="`am-slider-container ${compact && 'am-compact'}`">
        <div class="am-slider-input">
            <input
                :value="number"
                @change="event => $am_Change(event.target.value, unit)">
            <button
                v-if="options && defaultOption"
                @click="() => $am_onToggle()">
                {{ unit }}
            </button>
        </div>
        <div
            id="am-slider"
            class="am-slider"/>
    </div>
</template>

<script>

    import slider from 'nouislider';
    import {isNil, isObject, isEqual} from 'lodash';

    export default {
        props: {
            value: {
                type: [Number, String, Object],
                default: 0
            },
            onChange: {
                type: Function,
                default: () => {}
            },
            range: {
                type: Object,
                default: () => ({})
            },
            compact: {
                type: Boolean,
                default: false
            },
            options: {
                type: Array,
                default: () => null
            },
            defaultOption: {
                type: String,
                default: ''
            },
            step: {
                type: Number,
                default: 0
            }
        },
        data(){
            return {
                number: 0,
                unit: '',
                slider: null
            }
        },
        watch: {
            value(newValue, oldValue) {
                if (!isEqual(newValue, oldValue)) {
                    if (this.options && isObject(newValue)) {
                        this.number = !isNil(newValue.number) && newValue.number || 0; 
                        this.unit = !isNil(newValue.unit) && newValue.unit || this.defaultOption;
                    } else {
                        this.number = !isNil(newValue) && newValue || 0;
                        this.unit = this.defaultOption;
                    }
                    this.slider.set([this.number]);
                }
            }
        },
        created() {
            if (this.options && isObject(this.value)) {
                this.number = !isNil(this.value.number) && this.value.number || 0; 
                this.unit = !isNil(this.value.unit) && this.value.unit || this.defaultOption;
            } else {
                this.number = !isNil(this.value) && this.value || 0;
                this.unit = this.defaultOption;
            }
        },
        mounted() {
            const div = this.$el.querySelector('#am-slider');
            if (div && !this.disabled) {
                this.slider = slider.create(div, {
                    start: [this.number],
                    range: this.range,
                    step: this.step
                });
                this.slider.on('change', (value) => {
                    const number = value && parseFloat(value[0]) || 0;
                    this.number = number;
                    if (this.options) {
                        this.onChange({
                            number,
                            unit: this.unit
                        });
                    } else {
                        this.onChange(number);
                    }
                });
            }
        },
        beforeDestroy() {
            if (this.slider) {
                this.slider.destroy();
            }
        },
        methods: {
            $am_Change(number) {
                this.number = number;
                this.slider.set([number]);
                if (this.options) {
                    this.onChange({
                        number,
                        unit: this.unit
                    });
                } else {
                    this.onChange(number);
                }
            },
            $am_onToggle() {
                const index = this.options.indexOf(this.unit);
                this.unit = index + 1 > this.options.length - 1 ? this.options[0] : this.options[index + 1];
                this.onChange({
                    number: this.number,
                    unit: this.unit
                });
            }
        }
    };
</script>