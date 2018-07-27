/* copyright 2018, stefano bovio @allyoucanmap. */

import styleAPI from '../api/style';
import wmsAPI from '../api/wms';

const ADD_LAYER = 'ADD_LAYER';
const UPDATE_CURRENT_CSS = 'UPDATE_CURRENT_CSS';
const SELECT_LAYER = 'SELECT_LAYER';
const SET_BACKGROUND_COLOR = 'SET_BACKGROUND_COLOR';
const SET_ZOOM = 'SET_ZOOM';
const SET_MAP_SIZE = 'SET_MAP_SIZE';
const SET_MAP_CENTER = 'SET_MAP_CENTER';
const UPDATE_LAYERS = 'UPDATE_LAYERS';
const UPDATE_LAYER = 'UPDATE_LAYER';
const GET_INFO = 'GET_INFO';
const CLEAR_INFO = 'CLEAR_INFO';
const LOADING = 'LOADING';
const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
const GET_CAPABILITIES = 'GET_CAPABILITIES';
const SET_ERROR = 'SET_ERROR';

const updateCurrentCSS = ({ commit }, options) => {
    commit({
        type: UPDATE_CURRENT_CSS,
        options
    });
};

const loading = ({ commit }, load) => {
    commit({
        type: LOADING,
        load
    });
};

const clearInfo = ({commit}) => {
    commit({
        type: CLEAR_INFO
    });
};

const setError = ({commit}, error) => {
    commit({
        type: SET_ERROR,
        error
    });
};

export default {
    actions: {
        addLayer({ commit, state }, layer) {
            loading({ commit }, true);
            const settings = {...state.settings};
            styleAPI.getStyle({
                options: {
                    name: (layer.style || (layer.prefix && layer.prefix + '~' || '') + layer.name + '~gcssg') + '.css'
                },
                settings
            }, loadedCSS => {
                commit({
                    type: ADD_LAYER,
                    layer,
                    loadedCSS
                });
                loading({ commit }, false);
            }, () => {
                commit({
                    type: ADD_LAYER,
                    layer
                });
                loading({ commit }, false);
            });
        },
        selectLayer({ commit }, id) {
            commit({
                type: SELECT_LAYER,
                id
            });
        },
        updateLayers({ commit }, layers) {
            commit({
                type: UPDATE_LAYERS,
                layers
            });
        },
        updateLayer({ commit }, options) {
            commit({
                type: UPDATE_LAYER,
                options
            });
        },
        setBackgroundColor({ commit }, color) {
            commit({
                type: SET_BACKGROUND_COLOR,
                color
            });
        },
        setZoom({ commit }, zoom) {
            commit({
                type: SET_ZOOM,
                zoom
            });
        },
        setMapSize({ commit }, size) {
            commit({
                type: SET_MAP_SIZE,
                size
            });
        },
        setMapCenter({ commit }, center) {
            commit({
                type: SET_MAP_CENTER,
                center
            });
        },
        getInfo: ({commit, state}, options) => {
            loading({ commit }, true);
            clearInfo({commit});
            const settings = {...state.settings};
            wmsAPI.getInfo({options, settings},
                data => {
                    commit({
                        type: GET_INFO,
                        data
                    });
                    loading({ commit }, false);
                }, () => {
                    loading({ commit }, false);
                }
            );
        },
        updateStyle ({ commit, state }, options) {
            const settings = {...state.settings};
            loading({ commit }, true);
            setError({commit});
            styleAPI.updateStyle({
                options: {
                    ...options,
                    name: (options.prefix && options.prefix + '~' || '') + options.name
                },
                settings
            }, () => {
                updateCurrentCSS({ commit }, {...options});
                loading({ commit }, false);
            },
            error => {
                loading({ commit }, false);
                setError({commit}, error && error.response && error.response.statusText || '');
            });
        },
        updateSettings({ commit }, settings) {
            commit({
                type: UPDATE_SETTINGS,
                settings
            });
        },
        getCapabilities({ commit, state }) {
            loading({ commit }, true);
            const settings = {...state.settings};
            wmsAPI.getCapabilities({settings},
                capabilities => {
                    commit({
                        type: GET_CAPABILITIES,
                        capabilities
                    });
                    loading({ commit }, false);
                },
                () => loading({ commit }, false)
            )
        },
        createStyle({ commit, state }, options) {
            const settings = {...state.settings};
            loading({ commit }, true);
            setError({commit});
            styleAPI.updateStyle({
                options,
                settings
            }, () => {
                loading({ commit }, false);
            },
            error => {
                loading({ commit }, false);
                setError({commit}, error && error.response && error.response.statusText || '');
            });
        },
        loading,
        setError,
        updateCurrentCSS,
        clearInfo
    },
    ADD_LAYER,
    UPDATE_CURRENT_CSS,
    SELECT_LAYER,
    SET_BACKGROUND_COLOR,
    SET_ZOOM,
    SET_MAP_SIZE,
    SET_MAP_CENTER,
    UPDATE_LAYERS,
    UPDATE_LAYER,
    CLEAR_INFO,
    GET_INFO,
    LOADING,
    UPDATE_SETTINGS,
    GET_CAPABILITIES,
    SET_ERROR
};
