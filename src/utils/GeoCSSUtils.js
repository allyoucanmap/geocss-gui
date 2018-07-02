/* copyright 2018, stefano bovio @allyoucanmap. */

import {isNil, isString, trim, template, join} from 'lodash';
import tinycolor from 'tinycolor2';

const getVariables = code => {
    return isString(code) && (code.match(/\@\{([^}]+)\}|\@\s\{([^}]+)\}/g) || []).reduce((newOptions, group) => {
        const grp = isString(group) && group.replace(/\@|\{|\}/g, '');
        const params = isString(group) && grp.split(/\;/g);
        const paramsObj = params && params.reduce((newObj, obj) => {
            const param = obj && isString(obj) && obj.replace(/\;|\@\-/g, '').split(/\:/);
            const value = param.length > 1 && join(param.filter((val, idx) => idx > 0), ':');
            return !isNil(param) && !isNil(param[0]) && value && !isNil(value) ? {
                ...newObj,
                [trim(param[0])]: trim(value)
            } : {...newObj};
        }, {}) || {};
        return {...newOptions, ...paramsObj};
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
    const css = code && variables && template(code)(variables);
    return !isNil(css) && css.replace(/\@\{([^}]+)\}|\@\s\{([^}]+)\}/g, '');
};

const compressCSS = (code, variables, label) => {
    const css = compileCSS(code, variables);
    const temp = isString(code) && '/*TEMPLATE' + code.replace(/\/\*/g, '/$').replace(/\*\//g, '$/') + 'TEMPLATE*/' || '';
    const name = label && '/*NAME' + label + 'NAME*/' || '';
    return name + temp + css;
};

const cleanVariables = (code = '') => {
    return code.replace(/\@\{([^}]+)\}|\@\s\{([^}]+)\}/g, '');
};

const writeVariables = (variables = {}) => {
    const strVariables = Object.keys(variables).reduce((string, key) => {
        return string + '\t' + key + ': ' + variables[key] + ';\n';
    }, '@ {\n');
    return strVariables === '@ {\n' ? '' : strVariables + '}'
};

export {
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