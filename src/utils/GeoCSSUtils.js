/* copyright 2018, stefano bovio @allyoucanmap. */

import {isNil, isString, trim, template, join} from 'lodash';
import tinycolor from 'tinycolor2';

const regex = /\@([\w]+):([^;]+);[\n\r|\r|\n|\r\n]/g; // /\@\{([^}]+)\}|\@\s\{([^}]+)\}/
const interpolate = /@{([\s\S]+?)}/;

const getVariables = code => {
    return isString(code) && (code.match(regex) || []).reduce((newVariables, variable) => {
        const param = variable && isString(variable) && variable.replace(/\;|\@/g, '').split(/\:/);
        const value = param.length > 1 && join(param.filter((val, idx) => idx > 0), ':');
        return !isNil(param) && !isNil(param[0]) && value && !isNil(value) ? {
            ...newVariables,
            [trim(param[0])]: trim(value)
        } : {...newVariables};
    }, {}) || {};
};

const parseVariable = (option, options) => {
    const splitted = isString(option) && option.split(/\[/g);
    const colorSplit = splitted && splitted[0]
    && (tinycolor(splitted[0]).getFormat() && tinycolor(splitted[0])
    || tinycolor(options[splitted[0]]).getFormat() && tinycolor(options[splitted[0]]));
    if (colorSplit) {
        const funcArray = splitted[1] && splitted[1].replace(']', '').split(',');
        const value = funcArray && funcArray.reduce((val, op) => {
            const operation = trim(op);
            if (operation.match(/\w{2}([\d]+)/)) {
                let perc = operation.replace(/dr|lg|br|st|ds|sp/, '');
                perc = parseFloat(perc);
                const color = !isNaN(perc) && (
                    operation.indexOf('dr') !== -1 && colorSplit.darken(perc).toHex()
                    || operation.indexOf('lg') !== -1 && colorSplit.lighten(perc).toHex()
                    || operation.indexOf('br') !== -1 && colorSplit.brighten(perc).toHex()
                    || operation.indexOf('st') !== -1 && colorSplit.saturate(perc).toHex()
                    || operation.indexOf('ds') !== -1 && colorSplit.desaturate(perc).toHex()
                    || operation.indexOf('sp') !== -1 && colorSplit.spin(perc).toHex()
                );
                return color && '#' + color || val;
            }
            return val;
        }, '');
        return value || options[option] || option;
    }
    return options[option] || option;
};

const getParsedVariables = (code, variables) => {
    const options = variables || getVariables(code);
    return Object.keys(options).reduce((newOptions, key) => {
        return {
            ...newOptions,
            [key]: parseVariable(options[key], options)
        };
    }, {});
};

const getTemplate = (css = '') => {
    const temp = css.match(/\/*TEMPLATE([^]+)TEMPLATE\*\//g);
    return temp && temp[0] && temp[0].replace(/TEMPLATE|TEMPLATE|\*\//g, '').replace(/\/\$/g, '/*').replace(/\$\//g, '*/');          
};

const getName = (css = '') => {
    const name = css.match(/\/*NAME([^]+)NAME\*\//g);
    return name && name[0] && name[0].replace(/NAME|NAME|\*\//g, '');
};

const compileCSS = (code, variables) => {
    const css = code && variables && template(code, {interpolate})(variables);
    return !isNil(css) && css.replace(regex, '');
};

const compressCSS = (code, variables, label) => {
    const css = compileCSS(code, variables);
    const temp = isString(code) && '/*TEMPLATE' + code.replace(/\/\*/g, '/$').replace(/\*\//g, '$/') + 'TEMPLATE*/' || '';
    const name = label && '/*NAME' + label + 'NAME*/' || '';
    return name + temp + css;
};

const cleanVariables = (code = '') => {
    return code.replace(regex, '');
};

const writeVariables = (variables = {}) => {
    const strVariables = Object.keys(variables).reduce((string, key) => {
        return string + '@' + key + ': ' + variables[key] + ';\n';
    }, '');
    return strVariables;
};

const properties = [
    'mark',
    'mark-composite',
    'mark-mime',
    'mark-geometry',
    'mark-size',
    'mark-rotation',
    'z-index',
    'mark-label-obstacle',
    'stroke',
    'stroke-composite',
    'stroke-geometry',
    'stroke-offset',
    'stroke-mime',
    'stroke-size',
    'stroke-rotation',
    'stroke-width',
    'stroke-opacity',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-repeat',
    'stroke-label-obstacle',
    'stroke-linecap',
    'stroke-linejoin',
    'fill',
    'fill-opacity',
    'fill-composite',
    'fill-geometry',
    'fill-mime',
    'fill-size',
    'fill-rotation',
    'fill-label-obstacle',
    'graphic-margin',
    'random',
    'random-seed',
    'random-rotation',
    'random-symbol-count',
    'random-tile-size',
    'label',
    'label-geometry',
    'label-anchor',
    'label-offset',
    'label-rotation',
    'label-z-index',
    'shield',
    'shield-mime',
    'font-family',
    'font-fill',
    'font-style',
    'font-weight',
    'font-size',
    'halo-radius',
    'halo-color',
    'halo-opacity',
    'label-padding',
    'label-group',
    'label-max-displacement',
    'label-min-group-distance',
    'label-repeat',
    'label-all-group',
    'label-remove-overlaps',
    'label-allow-overruns',
    'label-follow-line',
    'label-max-angle-delta',
    'label-auto-wrap',
    'label-force-ltr',
    'label-conflict-resolution',
    'label-fit-goodness',
    'label-priority',
    'shield-resize',
    'shield-margin',
    'label-underline-text',
    'label-strikethrough-text',
    'label-char-spacing',
    'label-word-spacing',
    'raster-channels',
    'raster-composite',
    'raster-geometry',
    'raster-opacity',
    'raster-contrast-enhancement',
    'raster-gamma',
    'raster-z-index',
    'raster-color-map',
    'raster-color-map-type',
    'composite',
    'composite-base',
    'geometry',
    'sort-by',
    'sort-by-group',
    'transform',
    'size',
    'rotation'
];

const pseudoclasses = [
    'mark',
    'shield',
    'stroke',
    'fill',
    'symbol',
    'nth-mark()',
    'nth-shield()',
    'nth-stroke()',
    'nth-fill()',
    'nth-symbol()'
];

export {
    properties,
    pseudoclasses,
    getVariables,
    parseVariable,
    getParsedVariables,
    getTemplate,
    getName,
    compileCSS,
    compressCSS,
    cleanVariables,
    writeVariables
};