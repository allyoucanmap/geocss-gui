/* copyright 2018, stefano bovio @allyoucanmap. */

<style scoped>
    .am-zoom-slider {
        padding-top: 16px;
        padding-bottom: 36px;
        display: flex;
        flex-direction: column;
    }
    #am-zoom-slider {
        position: relative;
        flex: 1;
        width: 4px;
        margin: 0 8px;
    }
    button {
        margin: 24px auto 6px auto;
    }
</style>

<template lang="html">
    <div class="am-zoom-slider">
        <div id="am-zoom-slider"/>
    </div>
</template>

<script>
    import slider from 'nouislider';
    import {mapGetters, mapActions} from 'vuex';

    export default {
        data() {
            return {
                slider: null,
  
                showTooltips: false
            };
        },
        computed: {
            ...mapGetters({
                zoom: 'app/zoom',
                scales: 'app/scalesRound',
                scalesDenominator: 'app/scalesDenominator',
                layerId: 'app/selectedLayerId',
                minZoom: 'app/minZoom',
                maxZoom: 'app/maxZoom'
            })
        },
        watch: {
            zoom(newZoom, oldZoom) {
                if (this.slider && newZoom !== oldZoom) {
                    this.$am_updateZoom(newZoom);
                }
            }
        },
        mounted() {
            const div = this.$el.querySelector('#am-zoom-slider');

            if (div) {
                this.slider = slider.create(div, {
                    orientation: 'vertical',
                    start: [this.zoom],
                    connect: true,
                    tooltips: [true],
                    range: {
                        min: this.minZoom,
                        max: this.maxZoom
                    },
                    format: {
                        to: value => '1 : ' + this.scales[Math.round(value)],
                        from: value => value
                    },
                    step: 1
                });

                this.slider.on('change', (value) => {
                    const zoom = value && value[0] && this.$am_nearIndex(parseFloat(value[0].substring(4, value[0].length))) || 0;
                    this.setZoom({
                        currentZoom: Math.round(zoom)
                    });
                });

                this.$am_onToggle();
            }
        },
        beforeDestroy() {
            if (this.slider) {
                this.slider.destroy();
            }
        },
        methods: {
            ...mapActions({
                setZoom: 'app/setZoom'
            }),
            $am_onToggle() {
                this.showTooltips = !this.showTooltips;
                const tooltips = this.slider && this.slider.target && this.slider.target.getElementsByClassName && [...this.slider.target.getElementsByClassName('noUi-tooltip')] || [];
                tooltips.forEach(tooltip => {
                    tooltip.style.display = this.showTooltips ? 'block' : 'none';
                });
            },
            $am_updateZoom(zoom) {
                this.slider.set([zoom]);
            },
            $am_nearIndex(scale) {
                const scaleValue = scale && this.scales.reduce((previous, current) => {
                    return Math.abs(current - scale) < Math.abs(previous - scale) ? current : previous;
                });
                return this.scales.indexOf(scaleValue);
            }
        }
    };
</script>