/* copyright 2018, stefano bovio @allyoucanmap. */
<style>
    /*
        Name:       yeti
        Author:     Michael Kaminsky (http://github.com/mkaminsky11)
        Original yeti color scheme by Jesse Weed (https://github.com/jesseweed/yeti-syntax)
    */
    .cm-s-yeti.CodeMirror {
        background-color: #ECEAE8 !important;
        color: #d1c9c0 !important;
        border: none;
    }
    .cm-s-yeti .CodeMirror-gutters {
        color: #adaba6;
        background-color: #E5E1DB;
        border: none;
    }
    .cm-s-yeti .CodeMirror-cursor { border-left: solid thin #d1c9c0; }
    .cm-s-yeti .CodeMirror-linenumber { color: #adaba6; }
    .cm-s-yeti.CodeMirror-focused div.CodeMirror-selected { background: #DCD8D2; }
    .cm-s-yeti .CodeMirror-line::selection, .cm-s-yeti .CodeMirror-line > span::selection, .cm-s-yeti .CodeMirror-line > span > span::selection { background: #DCD8D2; }
    .cm-s-yeti .CodeMirror-line::-moz-selection, .cm-s-yeti .CodeMirror-line > span::-moz-selection, .cm-s-yeti .CodeMirror-line > span > span::-moz-selection { background: #DCD8D2; }
    .cm-s-yeti span.cm-comment { color: #d4c8be; }
    .cm-s-yeti span.cm-string, .cm-s-yeti span.cm-string-2 { color: #96c0d8; }
    .cm-s-yeti span.cm-number { color: #a074c4; }
    .cm-s-yeti span.cm-variable { color: #55b5db; }
    .cm-s-yeti span.cm-variable-2 { color: #a074c4; }
    .cm-s-yeti span.cm-def { color: #55b5db; }
    .cm-s-yeti span.cm-operator { color: #9fb96e; }
    .cm-s-yeti span.cm-keyword { color: #9fb96e; }
    .cm-s-yeti span.cm-atom { color: #a074c4; }
    .cm-s-yeti span.cm-meta { color: #96c0d8; }
    .cm-s-yeti span.cm-tag { color: #96c0d8; }
    .cm-s-yeti span.cm-attribute { color: #9fb96e; }
    .cm-s-yeti span.cm-qualifier { color: #96c0d8; }
    .cm-s-yeti span.cm-property { color: #a074c4; }
    .cm-s-yeti span.cm-builtin { color: #a074c4; }
    .cm-s-yeti span.cm-variable-3, .cm-s-yeti span.cm-type { color: #96c0d8; }
    .cm-s-yeti .CodeMirror-activeline-background { background: #E7E4E0; }
    .cm-s-yeti .CodeMirror-matchingbracket { text-decoration: underline; }
    /*
        End      yeti
    */
    .am-color-picker {
        top: 0;
        left: 0;
        position: absolute;
        z-index: 500;
        display: flex;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
    }
    .am-color-picker .vc-chrome {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.24);
        border-radius: 0;
        margin: auto;
    }
    .am-placeholder {
        font-size: 128px;
        margin: auto;
        padding: 0 15px;
        font-family: icone;
        color: #ddd;
    }
    .am-general {
        flex: 1;
        
        display: flex;
        flex-direction: column;
    }
    .am-general > .am-head {
        padding: 8px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        text-align: center;
    }
    
    .am-general .am-body {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
    }
    .am-general .am-panel {
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-bottom: none;
    }
    .am-general .am-panel + .am-panel {
        margin-top: 4px;
    }
    .am-editor {
        display: flex;
        flex-direction: column;
    }
    .am-editor-container {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    .am-code-textarea {
        flex: 1;
        position: relative;
        margin-top: 8px;
    }
    .am-code-textarea > .CodeMirror {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .am-code-textarea > .CodeMirror * {
        font-family: Inconsolata;
        font-size: 14px;
    }
    .am-editor-container input {
        margin: 8px;
        margin-bottom: 0;
        width: calc(100% - 16px);
    }
    .am-editor-container input + input {
        margin-top: 8px;
        width: calc(100% - 16px);
    }
    .am-editor-container input:disabled {
        opacity: 0.5;
    }
    .am-error-log {
        width: 100%;
        font-family: Inconsolata;
        font-size: 14px;
        height: 64px;
        background-color: #333333;
        overflow-y: auto;
    }
    .am-error-log pre {
        color: #ff173f;
        font-weight: bold;
        padding: 0 15px;
        font-family: Inconsolata;
        font-size: 14px;
        white-space: pre-wrap;
    }
    .CodeMirror-hints {
        position: absolute;
        z-index: 10;
        overflow: hidden;
        list-style: none;

        margin: 0;
        padding: 2px;

        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.12);
        border-radius: 3px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        background-color: #ECEAE8;
        font-size: 90%;
        font-family: monospace;

        max-height: 20em;
        overflow-y: auto;
    }

    .CodeMirror-hint {
        margin: 0;
        padding: 0 4px;
        border-radius: 2px;
        white-space: pre;
        color: #333333;
        cursor: pointer;
        background-color: #ECEAE8;
    }

    li.CodeMirror-hint-active {
        background: #91f3f7;
        color: #333333;
    }
    .CodeMirror-hints li:last-child {
        display: none;
    }
</style>
<template lang="html">
    <div :class="'am-editor am-code-' + type">
        <div
            class="am-editor-container"
            v-if="selectedLayer.id && selectedLayer.type === 'layer'"
            :key="selectedLayer.id">
            <input
                :value="selectedLayer.label"
                @change="event => event && event.target && event.target.value && updateLayer({id: selectedLayer.id, label: event.target.value})">
            <input
                :value="$_am_getFullName(selectedLayer).fullName"
                disabled="true">
            <div
                :id="'am-code-' + type"
                class="am-code-textarea"/>
            <div
                @click="e => e && e.target && e.target.getAttribute('class') === 'am-color-picker' && $_am_replaceValue()"
                class="am-color-picker"
                v-if="showColorPicker">
                <chrome
                    :value="{hex: param && param.value}"
                    @input="$_am_updateColor"/>
            </div>
            <div class="am-error-log">
                <pre>{{ error }}</pre>
            </div>
        </div>
        <div
            class="am-placeholder"
            v-if="!selectedLayer.id && !general">
            V
        </div>
        <div
            class="am-general"
            v-if="!selectedLayer.id && general">
            <div class="am-head">
                <small>Variables Summary</small>
            </div>
            <div class="am-body">
                <am-panel
                    v-for="lyr in general"
                    :head="lyr.label"
                    :key="lyr.id"
                    :collapsed="lyr.summary"
                    :on-expand="expand => $_am_onUpdate('layer', lyr, 'summary', !expand)">
                    <am-input-group
                        v-for="key in Object.keys(lyr.variables)"
                        :key="key"
                        :label="key"
                        :styles="$_am_getStyle(key, lyr.variables)"
                        :value="lyr.variables[key]"
                        :type="{format: $_am_getType(lyr.variables[key])}"
                        :on-change="value => $_am_onUpdate('variable', lyr, key, value, lyr.variables)"/>
                </am-panel>
            </div>
            <div class="am-error-log">
                <pre>{{ error }}</pre>
            </div>
        </div>
    </div>
</template>

<script>

    import codemirror from 'codemirror';
    import '../../lib/geocss';
    import 'codemirror/addon/hint/show-hint';
    import {head, delay, isEqual, isEmpty, startsWith, trim} from 'lodash';
    import {mapGetters, mapActions} from 'vuex';
    import { Chrome } from 'vue-color';
    import tinycolor from 'tinycolor2';
    import {pseudoclasses, properties, getVariables, getParsedVariables, compressCSS, getTemplate, parseVariable, writeVariables, cleanVariables} from '../utils/GeoCSSUtils';
    import AmPanel from './panel/AmPanel.vue';
    import AmInputGroup from './input/AmInputGroup.vue';

    export default {
        components: {
            Chrome,
            AmPanel,
            AmInputGroup
        },
        props: {
            type: {
                type: String,
                default: 'css'
            }
        },
        data(){
            return {
                cm: null,
                code: '',
                param: {},
                cursors: {},
                lineTokens: {},
                showColorPicker: false,
                showDrawEditor: false,
                showAudioEditor: false,
                value: '',
                attributeValue: [],
                general: null,
                variables: []
            }
        },
        computed: {
            ...mapGetters({
                selectedLayer: 'app/selectedLayer',
                error: 'app/error',
                layers: 'app/layers'
            })
        },
        watch: {
            selectedLayer(newData, oldDate) {
                if (newData.id !== oldDate.id && newData.id) {
                    this.$_am_destroy();
                    this.$_am_create(newData.css);
                } else if (!newData.id){
                    this.$_am_destroy();
                }
            },
            code(newData, oldData) {
                if (oldData !== newData) {
                    this.$_am_updateVisualColor(newData);
                }   
            },
            param(newData) {
                this.value = '';
                if (newData.key && tinycolor(newData.value).getFormat()) {
                    this.showColorPicker = true;
                } else {
                    this.$_am_resetEditors();
                }
            },
            layers(newData, oldData) {
                if (!isEqual(newData, oldData)) {
                    const filteredLayers = newData.filter(layer => !isEmpty(layer.variables));
                    this.general = head(filteredLayers) && [...filteredLayers] || null;
                }
            }
        },
        methods: {
            ...mapActions({
                updateStyle: 'app/updateStyle',
                setZoom: 'app/setZoom',
                updateLayers: 'app/updateLayers',
                updateLayer: 'app/updateLayer',
                setError: 'app/setError'
            }),
            $_am_onUpdate(type, layer, key, value, obj) {
                if (type === 'variable' && obj[key] !== value) {
                    this.setError();
                    try {
                        const variables = {...obj, [key]: value};
                        const strVariables = writeVariables(variables);
                        const temp = strVariables + cleanVariables(getTemplate(layer.css));
                        const parsedVariables = getParsedVariables(temp, variables);
                        const css = compressCSS(temp, parsedVariables, layer.label);
                        this.updateStyle({
                            ...this.$_am_getFullName(layer),
                            css,
                            variables,
                            selected: layer.id
                        });
                    } catch(e) {
                        this.setError(e.message);
                    }
                } else if (type === 'layer') {
                    this.updateLayer({
                        id: layer.id,
                        [key]: value
                    })
                }
            },
            $_am_getType(value) {
                if (tinycolor(value).getFormat()) {
                    return 'color';
                } else if (startsWith(trim(value, '\''), 'wkt://')) {
                    return 'mark';
                }
                return 'text';
            },
            $_am_getStyle(text, variables) {
                const option = variables[text] && parseVariable(variables[text], variables);
                const isColor = tinycolor(text).getFormat() || option && tinycolor(option).getFormat();
                if (isColor) {
                    const color = tinycolor.mostReadable(option || text, '#000000', {includeFallbackColors: true}).toHex();
                    return {
                        color: '#' + color,
                        backgroundColor: option || text
                    }
                }
                return null;
            },
            $_am_create(css) {
                delay(() => {
                    this.cm = codemirror(document.querySelector('#am-code-' + this.type), {
                        mode: { name: this.type },
                        lineNumbers: true,
                        theme: 'yeti'
                    });
                    this.cm.on('blur', this.$_am_onBlur);
                    this.cm.on('change', this.$_am_onChange);
                    this.cm.on('dblclick', this.$_am_onDoubleClick);
                    this.cm.on('cursorActivity', this.$_am_onCursorActivity);
                    this.cm.on('scroll', this.$_am_scroll);
                    this.cm.on('inputRead', this.$_am_autocomplete);
                    const code = getTemplate(css) || css || '';
                    this.cm.setValue(code);
                    const variables = getVariables(code);
                    this.variables = Object.keys(variables);
                    this.$_am_updateVisualColor();
                }, 100);
            },
            $_am_autocomplete(cm) {
                codemirror.showHint(cm, () => {
                    const cursor = cm.getCursor();
                    const token = cm.getTokenAt(cursor);

                    const start = token.start;
                    const end = cursor.ch;
                    const line = cursor.line;
                    const word = token.string;
                    const type = token.type;
                    const list = (type && type.indexOf('property') !== -1 && [...properties, ...this.variables]
                        || type && type.indexOf('variable-3') !== -1 && [...pseudoclasses] || [])
                        .filter(property => property.indexOf(word) !== -1);
                    if (!head(list)) {
                        return null;
                    }

                    return {
                        list: [...list.sort(), word],
                        from: codemirror.Pos(line, start),
                        to: codemirror.Pos(line, end)
                    }
                });
            },
            $_am_destroy() {
                if (this.cm) {
                    this.cm.off('blur', this.$_am_onBlur);
                    this.cm.off('change', this.$_am_onChange);
                    this.cm.off('dblclick', this.$_am_onDoubleClick);
                    this.cm.off('cursorActivity', this.$_am_onCursorActivity);
                    this.cm.off('scroll', this.$_am_scroll);
                    this.cm.off('inputRead', this.$_am_autocomplete);
                    this.variables = [];
                    this.cm = null;
                    this.setError();
                    this.$_am_resetEditors();
                }
            },
            $_am_scroll() {
                this.$_am_updateVisualColor();
            },
            $_am_updateVisualColor(code) {
                const cmDOM = document.getElementById('am-code-' + this.type);
                const atoms = cmDOM && cmDOM.getElementsByClassName('cm-atom');
                const property = cmDOM && cmDOM.getElementsByClassName('cm-property');
                const def = cmDOM && cmDOM.getElementsByClassName('cm-def');
                const builtin = cmDOM && cmDOM.getElementsByClassName('cm-builtin');
                if (atoms || property || def || builtin) {
                    const parms = [...(atoms || []), ...(property || []), ...(def || []), ...(builtin || [])];
                    const options = getVariables(code || this.code);
                    for (let i = 0; i < parms.length; i++) {
                        const text = parms[i].innerHTML.replace(/\@/g, '');
                        const styles = this.$_am_getStyle(text, options);
                        if (styles) {
                            parms[i].style.color = styles.color;
                            parms[i].style.backgroundColor = styles.backgroundColor;
                        }
                    }
                }
            },
            $_am_onChange(cm) {
                this.code = cm.getValue();
            },
            $_am_getFullName(layer) {
                const prefix = layer.prefix || '';
                const name = layer.name + '~gcssg';
                return {
                    prefix,
                    name,
                    fullName: (prefix && prefix + '~') + name
                };
            },
            $_am_onBlur(cm) {
                if (this.$_am_edit()) return null;
                this.code = cm && cm.getValue() || this.code;
                const variables = getVariables(this.code);
                this.variables = Object.keys(variables);
                const parsedVariables = getParsedVariables(null, variables);
                try {
                    const css = compressCSS(this.code, parsedVariables, this.selectedLayer.label);
                    this.updateStyle({
                        ...this.$_am_getFullName(this.selectedLayer),
                        css,
                        variables
                    });
                } catch(e) {
                    this.setError(e.message);
                }
                
            },
            $_am_resetEditors() {
                this.showColorPicker = false;
            },
            $_am_setSelection() {
                this.cm.setSelection({
                        line: this.cursors.start.line,
                        ch: this.attributeValue[this.attributeValue.length - 1].end
                    },
                    {line: this.cursors.start.line, ch: this.attributeValue[0].start}
                );
            },
            $_am_edit() {
                return this.showColorPicker;
            },
            $_am_updateColor({hex}) {
                this.value = ' ' + hex;
            },
            $_am_updateValue(value) {
                this.value = ' ' + value;
            },
            $_am_replaceValue() {
                if (this.value) {
                    this.cm.replaceSelection(this.value);
                }
                this.$_am_resetEditors();
                this.$_am_onBlur();
            },
            $_am_onCursorActivity() {
                if (this.$_am_edit()) {
                    this.$_am_setSelection();
                } else {
                    this.$_am_resetEditors();
                }
            },
            $_am_getProperty(cm) {
                const inlineProperty = this.lineTokens.filter(token => token.type === 'property' || token.type === 'property error' || token.type === 'def').reduce((str, token) => str + token.string ,'');
                if (inlineProperty) {
                    return inlineProperty;
                }
                const currentLine = this.cursors.start.line;
                if (currentLine > 0) {
                    let upLine = currentLine - 1;
                    let checkUp = true;
                    let property = '';
                    while (checkUp) {
                        const token = [...cm.getLineTokens(upLine)];
                        const colon = head(token.filter(tk => tk.string === ':'));
                        const cProperty = token.filter(tk => tk.type === 'property' || tk.type === 'property error' || token.type === 'def').reduce((str, token) => str + token.string ,'');
                        if (cProperty && colon) {
                            checkUp = false;
                            property = cProperty;
                        } else if(colon) {
                            checkUp = false;
                        }
                        upLine--;
                        if (upLine === -1) {
                            checkUp = false;
                        }
                    }
                    if (property) {
                        return property;
                    }
                }
                return null;
            },
            $_am_onDoubleClick(cm) {
                this.cursors = { start: {...cm.getCursor(true)}, end: {...cm.getCursor(false)}};
                this.lineTokens = [...cm.getLineTokens(this.cursors.start.line)];

                const insideProperty = head(this.lineTokens.filter(token => this.cursors.start.ch >= token.start && this.cursors.start.ch < token.end && (token.type === 'property' || token.type === 'property error' )).map(() => true));

                if (!insideProperty) {
                    const colonIndex = this.lineTokens.reduce((index, token, idx) => token.string === ':' ? idx : index, -1);
                    let semicolonIndex = this.lineTokens.reduce((index, token, idx) => token.string === ';' ? idx : index, -1);
                    const grepIndex = this.lineTokens.map((token, idx) => ({...token, idx})).filter(token => token.string === ',');
                    const property = this.$_am_getProperty(cm);
                    semicolonIndex = semicolonIndex === -1 ? null : semicolonIndex;
                    if (grepIndex.length === 0 && property) {
                        this.attributeValue = this.lineTokens.filter((token, idx) => idx > colonIndex && idx < (semicolonIndex || this.lineTokens.length));
                        this.$_am_setSelection();
                        this.param = {key: property, value: cm.getSelection().trim()};
                    } else if (grepIndex.length > 0 && property) {
                        const gIndex = grepIndex.map((token, idx) => {
                            if (this.cursors.start.ch < token.start) {
                                const previous = idx > 0 && grepIndex[idx - 1].idx || -1;
                                return { c: token.idx, p: previous};
                            }
                            return null;
                        }).filter(v => v);
                        const boundsIndex = !gIndex[0] && { after: grepIndex[grepIndex.length - 1].idx }
                            || gIndex[0] && gIndex.length === grepIndex.length && { before: gIndex[0].c }
                            || gIndex[0] && { after: gIndex[0].p, before: gIndex[0].c }
                            || {};
                        this.attributeValue = this.lineTokens.filter((token, idx) => idx > (boundsIndex.after || colonIndex) && idx < (boundsIndex.before || semicolonIndex || this.lineTokens.length));
                        this.$_am_setSelection();
                        this.param = {key: property, value: cm.getSelection().trim()};
                    } else {
                        this.param = {};
                    }
                } else {
                    this.param = {};
                }
            }
        }
    }
</script>

