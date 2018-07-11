/* copyright 2018, stefano bovio @allyoucanmap. */

<style scoped>
    #am-gl {
        font-family: serif;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    canvas {
        font-family: serif;
        cursor: pointer;
    }
    .am-popup {
        position: absolute;
        font-size: 12px;
        z-index: 10;
        background-color: rgba(255, 255, 255, 0.85);
        padding: 4px;
        box-shadow: 3px 0 6px rgba(0, 0, 0, 0.06), 4px 0 8px rgba(0, 0, 0, 0.12);
        display: flex;
        flex-direction: column;
        cursor: default;
    }
    .am-popup::after {
        position: absolute;
        display: block;
        content: '';
        width: 16px;
        height: 2px;
        top: calc(100% - 1px);
        left: calc(100% - 8px);
        background-color: rgba(0, 0, 0, 0.5);
    }
    .am-popup::before {
        position: absolute;
        display: block;
        content: '';
        width: 2px;
        height: 16px;
        top: calc(100% - 8px);
        left: calc(100% - 1px);
        background-color: rgba(0, 0, 0, 0.5);
    }
    .am-popup.am-left::after {
        left: -8px;
    }
    .am-popup.am-top::after {
        top: -1px;
    }
    .am-popup.am-left::before {
        left: -1px;
    }
    .am-popup.am-top::before {
        top: -8px;
    }
    .am-panel {
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-bottom: none;
    }
    .am-panel + .am-panel {
        margin-top: 2px; 
    }

    .am-popup-head {
        display: flex;
        flex-direction: row-reverse;
        padding: 4px 0;
    }
    .am-popup-body {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>

<template lang="html">
    <div
        id="am-gl"
        class="am-gl"
        @click="event => $am_getInfo(event)"
        @mousemove="event => $am_onMove(event)"
        @mousewheel="event => $am_onScroll(event)"
        @dblclick="event =>$am_setCenter(event)">
        <div
            :class="'am-popup' + popup.class"
            v-if="features && features.length > 0"
            :style="`left: ${popup.x}px; top: ${popup.y}px; height: ${popup.height}px; width: ${popup.width}px;`"
            @click="event => event.stopPropagation()"
            @mousemove="event => event.stopPropagation()"
            @mousewheel="event => event.stopPropagation()">
            <div class="am-popup-head">
                <button
                    class="am-icon"
                    @click="() => { features = []; }">
                    X
                </button>
            </div>
            <div class="am-popup-body">
                <am-panel
                    v-for="(feature, idx) in features"
                    :key="idx"
                    :head="feature.id"
                    :on-click="() => $_am_onSelectLayer(feature.id)">
                    <div
                        v-for="key in Object.keys(feature.properties).filter(key => feature.properties[key])"
                        :key="key">
                        <small>{{ key }}</small>
                        <div class="am-property">{{ feature.properties[key] }}</div>
                    </div>
                </am-panel>
            </div>
        </div>
    </div>
</template>

<script>
    import gl from '../gl/index';
    import {mapGetters, mapActions} from 'vuex';
    import {join, isEqual, head, isArray} from 'lodash';
    import {pseudo, wgs84} from '../utils/PrjUtils';
    import {mapValue, lerp} from '../utils/Utils';
    import AmPanel from './panel/AmPanel.vue';

    export default {
        components: {
            AmPanel
        },
        data() {
            return {
                gl: null,
                entities: [],
                bbox: [],
                width: 0,
                height: 0,
                oldCSS: '',
                oldLayers: [],
                oldZoom: 0,
                oldPseudo: [],
                pixel: [],
                dragPoint: [],
                delta: [],
                pseudo: [],
                popup: {
                    x: 0,
                    y: 0,
                    height: 200,
                    width: 250,
                    class: ''
                },
                features: [],
                updateZoomEvent: null,
                oldUpdateZoom: 0,
                updateZoom: 0
            };
        },
        computed: {
            ...mapGetters({
                layers: 'app/layers',
                selectedLayer: 'app/selectedLayer',
                currentCSS: 'app/currentCSS',
                backgroundColor: 'app/backgroundColor',
                zoom: 'app/zoom',
                zooms: 'app/zooms',
                resolutions: 'app/resolutions',
                scales: 'app/scales',
                center: 'app/center',
                projectName: 'app/projectName',
                info: 'app/info'
            })
        },
        watch: {
            center(newCenter, oldCenter) {
                if (!isEqual(newCenter, oldCenter)) {
                    this.delta = [...pseudo(newCenter)];
                    this.features = [];
                }
            },
            zoom(newZoom, oldZoom) {
                if (newZoom !== oldZoom) {
                    this.features = [];
                    clearTimeout(this.updateZoomEvent);
                    this.updateZoomEvent = setTimeout(() => {
                        this.updateZoom = newZoom;
                    }, 500);
                }
            },
            width(width) {
                this.setSize({width, height: this.height});
            },
            height(height) {
                this.setSize({width: this.width, height});
            },
            dragPoint(newData, oldData) {
                if (this.dragPoint[2]) {
                    this.delta = [this.delta[0] - (newData[0] - oldData[0]), this.delta[1] - (newData[1] - oldData[1]) ];
                }
            },
            info(newData) {
                if (newData && newData.features) {
                    this.features = [...newData.features];
                }
            }
        },
        created() {
            this.pseudo = pseudo(this.center);
            this.delta = [...this.pseudo];
        },
        mounted() {
            this.oldZoom = this.zoom;
            gl.start('#am-gl', {
                view: {
                    before: ({gl, backgroundColor, entity, width, height, camera}) => {
                        camera.type = 'ortho';
                        this.gl = gl;
                        backgroundColor(this.backgroundColor);
                        this.updateZoom = this.zoom;
                        this.oldUpdateZoom = this.zoom;
                        camera.near = 1;
                        camera.far = 200;
             
                        this.pseudo = pseudo(this.center);
                        this.width = width;
                        this.height = height;

                        this.bbox = this.$am_getBBOX({
                            pseudo: this.pseudo,
                            width: this.width,
                            height: this.height,
                            zoom: this.zoom
                        });

                        this.entities =  this.$am_getEntities({
                            layers: this.$am_getLayers(),
                            entity,
                            bbox: this.bbox,
                            width: this.width,
                            height: this.height
                        });
                    },
                    loop: ({backgroundColor, drawEntity, camera, updateEntityTexture, destroyEntity, entity}) => {

                        backgroundColor(this.backgroundColor);

                        this.pseudo = [
                            lerp(this.pseudo[0], this.delta[0], 0.3),
                            lerp(this.pseudo[1], this.delta[1], 0.3)
                        ];

                        camera.position = [this.pseudo[0], this.pseudo[1], 100];
                        camera.target = [this.pseudo[0], this.pseudo[1], 0];
                        camera.zoom = 1 / this.resolutions[this.zoom];

                        const layers = this.$am_getLayers();

                        if (this.oldZoom !== this.zoom
                        || !isEqual(this.pseudo, this.oldPseudo)) {
                            this.bbox = this.$am_getBBOX({
                                pseudo: this.pseudo,
                                width: this.width,
                                height: this.height,
                                zoom: this.zoom
                            });
                        }
                        this.entities.forEach(ent => {
                            if (ent) {
                                drawEntity(ent);
                                const layer = head(layers.filter(layer => layer.name === ent.id));
                                const oldLayer = head(this.oldLayers.filter(layer => layer.name === ent.id));
                                if (layer && oldLayer && layer.css !== oldLayer.css
                                || this.oldCSS !== this.currentCSS /*&& this.selectedLayer && ent.id === this.selectedLayer.name*/) {
                                    this.onLoading(true);
                                   updateEntityTexture(ent,  this.$am_getLayerUrl({
                                        layer: layer,
                                        bbox: this.bbox,
                                        width: this.width,
                                        height: this.height
                                    }),
                                    () => {
                                        this.onLoading(false);
                                    },
                                    () => {
                                        this.onLoading(false);
                                    });
                                }
                            }
                        });
                        const oldOrder = join(this.oldLayers.reduce((newLayers, layer) => [...newLayers, ...layer.names], []), ',');
                        const order = join(layers.reduce((newLayers, layer) => [...newLayers, ...layer.names], []), ',');
                        if (this.oldLayers.length !== layers.length
                        || this.updateZoom !== this.oldUpdateZoom
                        || Math.abs(this.pseudo[0] - this.oldPseudo[0]) < 1.2
                        && Math.abs(this.pseudo[1] - this.oldPseudo[1]) < 1.2
                        && !isEqual(this.pseudo, this.oldPseudo)
                        || oldOrder !== order) {
                            const entities =  this.$am_getEntities({
                                layers,
                                entity,
                                bbox: this.bbox,
                                width: this.width,
                                height: this.height,
                                callback: () => {
                                    this.entities.forEach(ent => {
                                        destroyEntity(ent);
                                    });
                                    this.entities = entities;
                                }
                            });
                            this.pseudo = [...this.delta];
                            this.setCenter(wgs84(this.pseudo));
                            this.oldUpdateZoom = this.updateZoom;
                        }

                        if (this.oldLayers.length > 0 && layers.length === 0) {
                            this.entities.forEach(ent => {
                                destroyEntity(ent);
                            });
                            this.entities = [];
                        }
                        this.oldCSS = this.currentCSS;
                        this.oldLayers = [...layers];
                        this.oldZoom = this.zoom;
                        this.oldPseudo = [...this.pseudo];
                    },
                    resize: ({destroyEntity, entity, width, height}) => {
                        this.width = width;
                        this.height = height;

                        this.bbox = this.$am_getBBOX({
                            pseudo: this.pseudo,
                            width: this.width,
                            height: this.height,
                            zoom: this.zoom
                        });

                        const layers = this.$am_getLayers();

                        const entities =  this.$am_getEntities({
                            layers,
                            entity,
                            bbox: this.bbox,
                            width: this.width,
                            height: this.height,
                            callback: () => {
                                this.entities.forEach(ent => {
                                    destroyEntity(ent);
                                });
                                this.entities = entities;
                            }
                        });
                    }
                }
            })
        },
        methods: {
            ...mapActions({
                setSize: 'app/setMapSize',
                setCenter: 'app/setMapCenter',
                getInfo: 'app/getInfo',
                onLoading: 'app/loading',
                setZoom: 'app/setZoom',
                selectLayer: 'app/selectLayer'
            }),
            $_am_onSelectLayer(layerName) {
                const layer = head(this.layers.filter((layer) => layer.name === layerName));
                if (layer && layer.id) {
                    this.selectLayer(layer.id);
                }
            },
            $am_getLayerUrl({layer, bbox, width, height}) {
                const params = {
                    SERVICE: layer.service,
                    VERSION: '1.1.1',
                    REQUEST: 'GetMap',
                    FORMAT: layer.format,
                    LAYERS: layer.names ? join(layer.names, ',') : layer.name,
                    SRS: 'EPSG:900913',
                    TRANSPARENT: 'true',
                    STYLES: layer.styles ? join(layer.styles, ',') : (layer.prefix && layer.prefix + '~' || '') + layer.name.replace(/\:/g, '_') + '~gcssg',
                    WIDTH: width,
                    HEIGHT: height,
                    BBOX: join(bbox, ','),
                    _d: Date.now()
                };
                return 'http://localhost:8080/geoserver/wms?'+ join(Object.keys(params).map(key => key + '=' + params[key]), '&');
            },
            $am_getInfo(event) {
                const layers = this.layers.reduce((mergedLayers, layer) => ({...mergedLayers, [layer.name]: {...layer}}), {});
                const layersNames = Object.keys(layers);
                if (isArray(layersNames) && layersNames.length > 0) {
                    const containerRect = this.$el.getBoundingClientRect();
                    const x = event.clientX - containerRect.left;
                    const y = event.clientY - containerRect.top;
                    const width = 2;
                    const height = 2;
                    const center = [...this.pseudo];
                    const coords = [
                        center[0] + (-this.width / 2 + x) * this.resolutions[this.zoom],
                        center[1] + (this.height / 2 - y) * this.resolutions[this.zoom]
                    ];
                    const bbox = [
                        coords[0] - width / 2 * this.resolutions[this.zoom],
                        coords[1] - height / 2 * this.resolutions[this.zoom],
                        coords[0] + width / 2 * this.resolutions[this.zoom],
                        coords[1] + height / 2 * this.resolutions[this.zoom]
                    ];

                    const queryLayers = [...layersNames].reverse();
                    this.getInfo({
                        params: {
                            bbox: join(bbox, ','),
                            query_layers: join(queryLayers, ','),
                            layers: join(queryLayers, ','),
                            width,
                            height,
                            crs: 'EPSG:900913',
                            x: width / 2,
                            y: height / 2,
                            feature_count: 7
                        }
                    });

                    const isLeft = x < this.width / 2;
                    const isTop = y < this.height / 2;

                    this.popup = {
                        ...this.popup,
                        x: isLeft ? x : x - this.popup.width,
                        y: isTop ? y : y - this.popup.height,
                        class: `${isLeft ? ' am-left' : ''}${isTop ? ' am-top' : ''}`
                    };
                }
            },
            $am_getLayers() {
                const layer = this.layers.length > 0 && this.layers.reduce((newLayer, lyr) => {
                    return {
                        ...lyr,
                        names: [...newLayer.names, 
                            lyr.name
                        ],
                        styles: [...newLayer.styles, 
                            (lyr.prefix && lyr.prefix + '~' || '') + lyr.name.replace(/\:/g, '_') + '~gcssg'
                        ]
                    };
                }, {
                    names: [],
                    styles: []
                });
                return layer ? [layer] : [];
            },
            $am_getEntities({layers, entity, bbox, width, height, callback = () => {}}) {
                if (layers.length > 0) this.onLoading(true);
                return layers.map((layer, z) => {
                    return entity({
                        id: layer.name,
                        color: '#333333',
                        textureUrl: this.$am_getLayerUrl({layer, bbox, width, height}),
                        textureCallback: () => {
                            if (z === layers.length - 1) {
                                this.onLoading(false);
                                callback();
                            }
                        },
                        textureError: () => {
                            if (z === layers.length - 1) {
                                this.onLoading(false);
                                callback();
                            }
                        },
                        position: [0, 0, z],
                        feature: {
                            type: 'Polygon',
                            scale: 5,
                            coordinates: [
                                [
                                    [bbox[0], bbox[1]],
                                    [bbox[0], bbox[3]],
                                    [bbox[2], bbox[3]],
                                    [bbox[2], bbox[1]]
                                ]
                            ]
                        }
                    });
                });
            },
            $am_getBBOX({pseudo, width, height, zoom}) {
                return [
                    pseudo[0] - this.resolutions[zoom] * width / 2,
                    pseudo[1] - this.resolutions[zoom] * height / 2,
                    pseudo[0] + this.resolutions[zoom] * width / 2,
                    pseudo[1] + this.resolutions[zoom] * height / 2
                ];
            },
            $am_setCenter(event) {
                const containerRect = this.$el.getBoundingClientRect();
                const x = event.clientX - containerRect.left;
                const y = event.clientY - containerRect.top;

                const center = [...this.pseudo];

                this.setCenter(wgs84([
                    center[0] + (-this.width / 2 + x) * this.resolutions[this.zoom],
                    center[1] + (this.height / 2 - y) * this.resolutions[this.zoom]
                ]));
            },
            $am_onMove(event) {
                const {left, top, width, height} = this.$el.getBoundingClientRect();
                const point = [
                    mapValue(event.clientX - left, 0, width, this.bbox[0], this.bbox[2]),
                    mapValue(event.clientY - top, 0, height, this.bbox[3], this.bbox[1])
                ];
                this.pixel = [event.clientX - left, event.clientY - top];
                if (event.button >= 1) {
                    this.dragPoint = [...point, true];
                } else {
                    this.dragPoint = [...point, false];
                }
            },
            $am_onScroll(event) {
                const zoom = event.deltaY < 0 ? this.zoom + 10 : this.zoom - 10;
                const currentZoom = zoom < 0 ? 0 : zoom > this.resolutions.length - 1 && this.resolutions.length - 1 || zoom;
                this.setZoom({currentZoom});
            }
        }
    };
</script>