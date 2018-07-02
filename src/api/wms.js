/* copyright 2018, stefano bovio @allyoucanmap. */

import axios from 'axios';
import {get} from 'lodash';
import xml2js from 'xml2js';
const xmlParser = new xml2js.Parser();

const getInfo = ({options, settings}, response = () => {}, error = () => {}) => {
    axios.get(`${settings.source ? settings.source : 'http://localhost:8080/geoserver'}/wms`, {
        params: {
            request: 'GetFeatureInfo',
            ...(options.params ? options.params : {})
        }
    })
    .then(({data}) => response(data))
    .catch(() => error());
};

const parseCapabilities = (data, parsed = () => {}) => {
    xmlParser.parseString(data, (error, capabilities) => {
        const layers = get(capabilities, 'WMT_MS_Capabilities.Capability[0].Layer[0].Layer');
        parsed({
            layers: layers && layers.map(layer => layer.Name && layer.Name[0]).filter(val => val) || []
        });
    });
};

const getCapabilities = ({settings}, response = () => {}, error = () => {}) => {
    axios.get(`${settings.source ? settings.source : 'http://localhost:8080/geoserver'}/wms`, {
        params: {
            service: 'wms',
            version: '1.1.1',
            request: 'GetCapabilities'
        }
    })
    .then(({data}) => parseCapabilities(data, response))
    .catch(() => error());
};

export default {
    getInfo,
    getCapabilities
};