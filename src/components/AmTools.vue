/* copyright 2018, stefano bovio @allyoucanmap. */

<style scoped>
    .am-tools {
        display: flex;
        flex-direction: row-reverse;
        padding: 0 8px;
        align-items: center;
    }
    .am-tools button + button {
        margin-right: 4px;
    }
    .am-tools input {
        margin-right: 4px;
        text-align: center;
        width: 250px;
    }
</style>

<template lang="html">
    <div class="am-tools">

        <button
            v-for="(tool, toolId) in tools"
            :key="toolId"
            :id="`am-direction-${tool.id}`"
            :class="`am-icon ${tool.selected ? 'am-selected' : ''}`"
            @click="() => tool.onClick()">
            <span :style="tool.style || ''">{{ tool.icon }}</span>
        </button>

        <input
            :value="center[0].toFixed(8) + ' ' + center[1].toFixed(8)"
            @change="event => $_am_onChangeCenter(event.target.value)">
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import {pseudo, wgs84} from '../utils/PrjUtils';
    import {trim} from 'lodash';
    export default {
        data() {
            return {
                tools: [
                    {
                        icon: 'T',
                        id: 'right',
                        style: 'transform: rotate(90deg);',
                        onClick: () => this.$am_onMove(1, 0)
                    },
                    {
                        icon: 'T',
                        style: 'transform: rotate(-90deg);',
                        id: 'left',
                        onClick: () => this.$am_onMove(-1, 0)
                    },
                    {
                        icon: 'T',
                        style: '',
                        id: 'up',
                        onClick: () => this.$am_onMove(0, 1)
                    },
                    {
                        icon: 'T',
                        style: 'transform: rotate(180deg);',
                        id: 'down',
                        onClick: () => this.$am_onMove(0, -1)
                    }
                ]
            };
        },
        computed: {
            ...mapGetters({
                zoom: 'app/zoom',
                resolutions: 'app/resolutions',
                center: 'app/center',
                width: 'app/width',
                height: 'app/height'
            })
        },
        methods: {
            ...mapActions({
                setCenter: 'app/setMapCenter'
            }),
            $am_onMove(x, y) {
                const center = pseudo(this.center);
                const deltaX = x * this.width / 2 * this.resolutions[this.zoom];
                const deltaY = y * this.height / 2 * this.resolutions[this.zoom];
                this.setCenter(wgs84([
                    center[0] + deltaX,
                    center[1] + deltaY
                ]));
            },
            $_am_onChangeCenter(value = '') {
                const coords = trim(value).split(' ');
                const lng = parseFloat(coords[0]);
                const lat = parseFloat(coords[1]);
                if (!isNaN(lng) && !isNaN(lat)) {
                    this.setCenter([lng, lat]);
                } else {
                    this.setCenter([...this.center]);
                }
            }
        }
    };
</script>