/* copyright 2018, stefano bovio @allyoucanmap. */

import actions from '../actions/app';
import {trim, isEmpty} from 'lodash';
import {minZoom, maxZoom, zooms, resolutions, scales} from '../utils/PrjUtils';
import {getName, getVariables} from '../utils/GeoCSSUtils';

export default {
    state: {
        layers: [],
        selectedLayer: null,
        backgroundColor: '#f2f2f2',
        currentCSS: '',
        zoom: Math.round((maxZoom + minZoom) / 2),
        minZoom,
        maxZoom,
        zooms,
        resolutions,
        scales,
        size: {
            width: 0,
            height: 0
        },
        center: [139.753372, 35.685360],
        info: {},
        loading: false,
        settings: {
            username: 'admin',
            password: 'geoserver',
            source: 'http://localhost:8080/geoserver'
        },
        capabilities: {},
        error: ''
    },
    mutations: {
        [actions.ADD_LAYER](state, payload) {
            const {loadedCSS = '', layer = {}} = payload;
            const label = getName(loadedCSS) || layer.id || '';
            const css = loadedCSS || '';
            const variables = getVariables(loadedCSS) || {};
            state.layers = [...state.layers, { ...layer, label, css, variables}];
        },
        [actions.UPDATE_CURRENT_CSS](state, payload) {
            const {css = '', variables = {}, selected} = payload.options || {};
            state.layers = [...state.layers.map(layer => state.selectedLayer && layer.id === state.selectedLayer || layer.id === selected ? {...layer, css, variables} : {...layer})];
            state.currentCSS = css;
        },
        [actions.SELECT_LAYER](state, payload) {
            state.selectedLayer = payload.id || null;
        },
        [actions.SET_BACKGROUND_COLOR](state, payload) {
            state.backgroundColor = payload.color;
        },
        [actions.SET_ZOOM](state, payload) {
            const id = payload.zoom && payload.zoom.layerId;
            const scales = payload.zoom && payload.zoom.scales;
            if (id && scales) {
                state.layers = state.layers.map(layer => layer.id === id ? {...layer, scales} : {...layer});
            }
            const currentZoom =  payload.zoom && payload.zoom.currentZoom;
            state.zoom = currentZoom;
        },
        [actions.SET_MAP_SIZE](state, payload) {
            state.size = payload.size;
        },
        [actions.SET_MAP_CENTER](state, payload) {
            state.center = payload.center;
        },
        [actions.UPDATE_LAYERS](state, payload) {
            state.layers = [...payload.layers];
        },
        [actions.UPDATE_LAYER](state, payload) {
            const id = payload.options && payload.options.id;
            const options = payload.options;
            state.layers = state.layers.map(layer => layer.id === id ? {...layer, ...options} : {...layer});
        },
        [actions.UPDATE_ALL_SLD](state, payload) {
            const {options} = payload;
            state.layers = state.layers.map(layer => layer.name === options.name ? {...layer, sld: options.sld} : {...layer});
        },
        [actions.CLEAR_INFO](state) {
            state.info = {};
        },
        [actions.GET_INFO](state, payload) {
            const {data = {}} = payload;
            const results = data.split('Results');

            const features = results.map((result) => {
                const spittedResult = result.split('--------------------------------------------');
                let id;
                return spittedResult.map(feature => {
                    const group = feature.match(/\'([^]+)\'/);
                    if (group && group[0]) {
                        id = group[0].replace(/\'/g, '');
                        return {};
                    }
                    return feature.split(/\n/).filter(val => val).reduce((newFeature, param) => {
                        const splittedParam = param.split('=');
                        const key = trim(splittedParam[0]);
                        const value = trim(splittedParam[1]);
                        return {
                            ...newFeature,
                            ...(value ? {[key]: value} : {})
                        };
                    }, {});
                }).filter(feature => !isEmpty(feature)).map(ft => ({properties: {...ft}, id})); 
            
            }).filter(val => val && val.length > 0).reduce((newArray, val) => {
                return [...newArray, ...val];
            }, []);
            state.info = {features};
        },
        [actions.LOADING](state, payload) {
            state.loading = payload.load;
        },
        [actions.UPDATE_SETTINGS](state, payload) {
            const settings = {...state.settings, ...payload.settings};
            localStorage.setItem('geocss-gui~settings', JSON.stringify(settings));
            state.settings = settings;
        },
        [actions.GET_CAPABILITIES](state, payload) {
            state.capabilities = payload.capabilities;
        },
        [actions.SET_ERROR](state, payload) {
            state.error = payload.error || '';
        }
    }
};
