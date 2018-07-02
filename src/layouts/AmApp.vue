/* copyright 2018, stefano bovio @allyoucanmap. */

<style>
    * {
        box-sizing: border-box;
        color: #444444;
        outline-color: #91f3f7;
        font-family: OpenSans-Light, 'Open Sans';
    }
    button {
        height: 21px;
        min-width: 21px;
        font-size: 12px;
        justify-content: center;
        background-color: transparent;
        border: 1px solid rgba(0, 0, 0, 0.12);
        display: flex;
        align-items: center;
    }
    button.am-icon {
        font-family: icone;
        height: 21px;
        width: 21px;
        padding: 0;
        user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
    }
    button.am-icon span {
        font-family: icone;
        user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
    }
    button.inverse {
        background-color: #333333;
        color: #aaaaaa;
        border-color: #aaaaaa;
    }
    button.am-selected {
        background-color: #91f3f7;
    }
    button.inverse:active {
        background-color: #000000;
    }
    button.inverse:hover {
        background-color: #000000;
    }
    button.am-active {
        background-color: #91f3f7;
        box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.06), inset 0 4px 8px rgba(0, 0, 0, 0.12);
    }
    input {
        border: 1px solid rgba(0, 0, 0, 0.12);
        background-color: #f6f6f6;
        width: 100%;
        padding: 4px;
        font-family: Inconsolata;
    }
    button:hover {
        background-color: #aaeeee;
    }
    button:active {
        background-color: #55eeee;
    }
    body {
        margin: 0;
        font-family: Georgia, "Times New Roman", Times, serif;
        background-color: #fafafa;
    }
    .am-container {
        position: absolute;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 200px 400px repeat(7, 1fr) 32px;
        grid-template-rows: 32px repeat(5, 1fr) 32px 4px;
    }
    .am-header {
        grid-column: 1 / 11;
        grid-row: 1 / 2;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.12);
        z-index: 30;
        background-color: #f6f6f6;
    }
    .am-list {
        grid-column: 1 / 2;
        grid-row: 2 / 8;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.09), 0 4px 8px rgba(0, 0, 0, 0.18);
        z-index: 20;
        background-color: #f4f4f4;
    }
    .am-editor {
        grid-column: 2 / 4;
        grid-row: 2 / 8;
        box-shadow: 3px 0 6px rgba(0, 0, 0, 0.06), 4px 0 8px rgba(0, 0, 0, 0.12);
        background-color: #f2f2f2;
        z-index: 10;
        position: relative;
        overflow-y: auto;
    }
    .am-gl {
        grid-column: 4 / 10;
        grid-row: 2 / 7;
        font-size: 0;
    }
    .am-disabled {
        opacity: 0.4;
    }
    .am-zoom-slider {
        grid-column: 10 / 11;
        grid-row: 2 / 8;
        z-index: 10;
        background-color: #f2f2f2;
        box-shadow: -3px 0 6px rgba(0, 0, 0, 0.06), -4px 0 8px rgba(0, 0, 0, 0.12);
    }
    .am-tools {
        grid-column: 4 / 10;
        grid-row: 7 / 8;
        z-index: 5;
        background-color: #f2f2f2;
        box-shadow: -3px 0 6px rgba(0, 0, 0, 0.06), -4px 0 8px rgba(0, 0, 0, 0.12);
    }
    .am-info {
        grid-column: 4 / 10;
        grid-row: 5 / 7;
        z-index: 4;
        background-color: #f2f2f2;
        box-shadow: -3px 0 6px rgba(0, 0, 0, 0.06), -4px 0 8px rgba(0, 0, 0, 0.12);
    }
    .am-loader {
        grid-column: 1 / 11;
        grid-row: 8 / 9;
    }

    /*! nouislider - 10.1.0 - 2017-07-28 17:11:18 */
    /* Functional styling;
    * These styles are required for noUiSlider to function.
    * You don't need to change these rules to apply your design.
    */
    .noUi-target,
    .noUi-target * {
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-user-select: none;
        -ms-touch-action: none;
        touch-action: none;
        -ms-user-select: none;
        -moz-user-select: none;
        user-select: none;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .noUi-target {
        position: relative;
        direction: ltr;
    }
    .noUi-base {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
        /* Fix 401 */
    }
    .noUi-connect {
        position: absolute;
        right: 0;
        top: 0;
        left: 0;
        bottom: 0;
    }
    .noUi-origin {
        position: absolute;
        height: 0;
        width: 0;
    }
    .noUi-handle {
        position: relative;
        z-index: 1;
    }
    .noUi-state-tap .noUi-connect,
    .noUi-state-tap .noUi-origin {
        -webkit-transition: top 0.3s, right 0.3s, bottom 0.3s, left 0.3s;
        transition: top 0.3s, right 0.3s, bottom 0.3s, left 0.3s;
    }
    .noUi-state-drag * {
        cursor: inherit !important;
    }
    /* Painting and performance;
    * Browsers can paint handles in their own layer.
    */
    .noUi-base,
    .noUi-handle {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    /* Slider size and handle placement;
    */
    .noUi-horizontal {
        height: 4px;
    }
    .noUi-horizontal .noUi-handle {
        width: 10px;
        height: 12px;
        left: -5px;
        top: -5px;
    }
    .noUi-vertical {
        width: 18px;
    }
    .noUi-vertical .noUi-handle {
        width: 28px;
        height: 34px;
        left: -6px;
        top: -17px;
    }
    /* Styling;
    */
    .noUi-target {
        background: #fafafa;
        border-radius: 0;
        border: 1px solid #d3d3d3;
        box-shadow: inset 0 1px 1px #f0f0f0, 0 3px 6px -5px #bbb;
    }
    .noUi-connect {
        background: #3fb8af;
        border-radius: 0;
        box-shadow: inset 0 0 3px rgba(51, 51, 51, 0.45);
        -webkit-transition: background 450ms;
        transition: background 450ms;
    }
    /* Handles and cursors;
    */
    .noUi-draggable {
        cursor: ew-resize;
    }
    .noUi-vertical .noUi-draggable {
        cursor: ns-resize;
    }
    .noUi-handle {
        border: 1px solid #d9d9d9;
        border-radius: 0;
        background: #fff;
        cursor: default;
        box-shadow: inset 0 0 1px #fff, inset 0 1px 7px #ebebeb, 0 3px 6px -3px #bbb;
    }
    .noUi-active {
        box-shadow: inset 0 0 1px #fff, inset 0 1px 7px #ddd, 0 3px 6px -3px #bbb;
    }
    /* Handle stripes;
    */
    .noUi-handle:before,
    .noUi-handle:after {
        content: "";
        display: none;
        position: absolute;
        height: 14px;
        width: 1px;
        background: #e8e7e6;
        left: 14px;
        top: 6px;
    }
    .noUi-handle:after {
        left: 17px;
    }
    .noUi-vertical .noUi-handle:before,
    .noUi-vertical .noUi-handle:after {
        width: 14px;
        height: 1px;
        left: 6px;
        top: 14px;
    }
    .noUi-vertical .noUi-handle:after {
        top: 17px;
    }
    /* Disabled state;
    */
    [disabled] .noUi-connect {
        background: #b8b8b8;
    }
    [disabled].noUi-target,
    [disabled].noUi-handle,
    [disabled] .noUi-handle {
        cursor: not-allowed;
    }
    /* Base;
    *
    */
    .noUi-pips,
    .noUi-pips * {
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .noUi-pips {
        position: absolute;
        color: #999;
    }
    /* Values;
    *
    */
    .noUi-value {
        position: absolute;
        white-space: nowrap;
        text-align: center;
    }
    .noUi-value-sub {
        color: #ccc;
        font-size: 10px;
    }
    /* Markings;
    *
    */
    .noUi-marker {
        position: absolute;
        background: #ccc;
    }
    .noUi-marker-sub {
        background: #aaa;
    }
    .noUi-marker-large {
        background: #aaa;
    }
    /* Horizontal layout;
    *
    */
    .noUi-pips-horizontal {
        padding: 10px 0;
        height: 80px;
        top: 100%;
        left: 0;
        width: 100%;
    }
    .noUi-value-horizontal {
        -webkit-transform: translate3d(-50%, 50%, 0);
        transform: translate3d(-50%, 50%, 0);
    }
    .noUi-marker-horizontal.noUi-marker {
        margin-left: -1px;
        width: 2px;
        height: 5px;
    }
    .noUi-marker-horizontal.noUi-marker-sub {
        height: 10px;
    }
    .noUi-marker-horizontal.noUi-marker-large {
        height: 15px;
    }
    /* Vertical layout;
    *
    */
    .noUi-pips-vertical {
        padding: 0 10px;
        height: 100%;
        top: 0;
        left: 100%;
    }
    .noUi-value-vertical {
        -webkit-transform: translate3d(0, 50%, 0);
        transform: translate3d(0, 50%, 0);
        padding-left: 25px;
    }
    .noUi-marker-vertical.noUi-marker {
        width: 5px;
        height: 2px;
        margin-top: -1px;
    }
    .noUi-marker-vertical.noUi-marker-sub {
        width: 10px;
    }
    .noUi-marker-vertical.noUi-marker-large {
        width: 15px;
    }
    .noUi-tooltip {
        display: block;
        position: absolute;
        border: none;
        border-radius: 0;
        background: #fff;
        color: #000;
        padding: 5px;
        text-align: center;
        white-space: nowrap;
        font-family: Inconsolata;
        font-size: 10px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.12);
    }
    .noUi-horizontal .noUi-tooltip {
        -webkit-transform: translate(-50%, 0);
        transform: translate(-50%, 0);
        left: 50%;
        bottom: 120%;
    }
    .noUi-vertical .noUi-tooltip {
        -webkit-transform: translate(0, -50%);
        transform: translate(0, -50%);
        top: 50%;
        right: 150%;
    }
    .noUi-connect {
        background: #91f3f7;
        box-shadow: none;
    }
    .noUi-vertical .noUi-handle {
        width: 26px;
        height: 12px;
        left: -6px;
        top: -6px;
    }

    /* BASICS */

.CodeMirror {
  /* Set height, width, borders, and global font properties here */
  font-family: monospace;
  height: 300px;
  color: black;
  direction: ltr;
}

/* PADDING */

.CodeMirror-lines {
  padding: 4px 0; /* Vertical padding around content */
}
.CodeMirror pre {
  padding: 0 4px; /* Horizontal padding of content */
}

.CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
  background-color: white; /* The little square between H and V scrollbars */
}

/* GUTTER */

.CodeMirror-gutters {
  border-right: 1px solid #ddd;
  background-color: #f7f7f7;
  white-space: nowrap;
}
/*.CodeMirror-linenumbers {}*/
.CodeMirror-linenumber {
  padding: 0 3px 0 5px;
  min-width: 20px;
  text-align: right;
  color: #999;
  white-space: nowrap;
}

.CodeMirror-guttermarker { color: black; }
.CodeMirror-guttermarker-subtle { color: #999; }

/* CURSOR */

.CodeMirror-cursor {
  border-left: 1px solid black;
  border-right: none;
  width: 0;
}
/* Shown when moving in bi-directional text */
.CodeMirror div.CodeMirror-secondarycursor {
  border-left: 1px solid silver;
}
.cm-fat-cursor .CodeMirror-cursor {
  width: auto;
  border: 0 !important;
  background: #7e7;
}
.cm-fat-cursor div.CodeMirror-cursors {
  z-index: 1;
}
.cm-fat-cursor-mark {
  background-color: rgba(20, 255, 20, 0.5);
  -webkit-animation: blink 1.06s steps(1) infinite;
  -moz-animation: blink 1.06s steps(1) infinite;
  animation: blink 1.06s steps(1) infinite;
}
.cm-animate-fat-cursor {
  width: auto;
  border: 0;
  -webkit-animation: blink 1.06s steps(1) infinite;
  -moz-animation: blink 1.06s steps(1) infinite;
  animation: blink 1.06s steps(1) infinite;
  background-color: #7e7;
}
@-moz-keyframes blink {
  0% {}
  50% { background-color: transparent; }
  100% {}
}
@-webkit-keyframes blink {
  0% {}
  50% { background-color: transparent; }
  100% {}
}
@keyframes blink {
  0% {}
  50% { background-color: transparent; }
  100% {}
}

/* Can style cursor different in overwrite (non-insert) mode */
/*.CodeMirror-overwrite .CodeMirror-cursor {}*/

.cm-tab { display: inline-block; text-decoration: inherit; }

.CodeMirror-rulers {
  position: absolute;
  left: 0; right: 0; top: -50px; bottom: -20px;
  overflow: hidden;
}
.CodeMirror-ruler {
  border-left: 1px solid #ccc;
  top: 0; bottom: 0;
  position: absolute;
}

/* DEFAULT THEME */

.cm-s-default .cm-header {color: blue;}
.cm-s-default .cm-quote {color: #090;}
.cm-negative {color: #d44;}
.cm-positive {color: #292;}
.cm-header, .cm-strong {font-weight: bold;}
.cm-em {font-style: italic;}
.cm-link {text-decoration: underline;}
.cm-strikethrough {text-decoration: line-through;}

.cm-s-default .cm-keyword {color: #708;}
.cm-s-default .cm-atom {color: #219;}
.cm-s-default .cm-number {color: #164;}
.cm-s-default .cm-def {color: #00f;}
/*.cm-s-default .cm-variable,
.cm-s-default .cm-punctuation,
.cm-s-default .cm-property,
.cm-s-default .cm-operator {}*/
.cm-s-default .cm-variable-2 {color: #05a;}
.cm-s-default .cm-variable-3, .cm-s-default .cm-type {color: #085;}
.cm-s-default .cm-comment {color: #a50;}
.cm-s-default .cm-string {color: #a11;}
.cm-s-default .cm-string-2 {color: #f50;}
.cm-s-default .cm-meta {color: #555;}
.cm-s-default .cm-qualifier {color: #555;}
.cm-s-default .cm-builtin {color: #30a;}
.cm-s-default .cm-bracket {color: #997;}
.cm-s-default .cm-tag {color: #170;}
.cm-s-default .cm-attribute {color: #00c;}
.cm-s-default .cm-hr {color: #999;}
.cm-s-default .cm-link {color: #00c;}

.cm-s-default .cm-error {color: #f00;}
.cm-invalidchar {color: #f00;}

.CodeMirror-composing { border-bottom: 2px solid; }

/* Default styles for common addons */

div.CodeMirror span.CodeMirror-matchingbracket {color: #0b0;}
div.CodeMirror span.CodeMirror-nonmatchingbracket {color: #a22;}
.CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }
.CodeMirror-activeline-background {background: #e8f2ff;}

/* STOP */

/* The rest of this file contains styles related to the mechanics of
   the editor. You probably shouldn't touch them. */

.CodeMirror {
  position: relative;
  overflow: hidden;
  background: white;
}

.CodeMirror-scroll {
  overflow: scroll !important; /* Things will break if this is overridden */
  /* 30px is the magic margin used to hide the element's real scrollbars */
  /* See overflow: hidden in .CodeMirror */
  margin-bottom: -30px; margin-right: -30px;
  padding-bottom: 30px;
  height: 100%;
  outline: none; /* Prevent dragging from highlighting the element */
  position: relative;
}
.CodeMirror-sizer {
  position: relative;
  border-right: 30px solid transparent;
}

/* The fake, visible scrollbars. Used to force redraw during scrolling
   before actual scrolling happens, thus preventing shaking and
   flickering artifacts. */
.CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
  position: absolute;
  z-index: 6;
  display: none;
}
.CodeMirror-vscrollbar {
  right: 0; top: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
.CodeMirror-hscrollbar {
  bottom: 0; left: 0;
  overflow-y: hidden;
  overflow-x: scroll;
}
.CodeMirror-scrollbar-filler {
  right: 0; bottom: 0;
}
.CodeMirror-gutter-filler {
  left: 0; bottom: 0;
}

.CodeMirror-gutters {
  position: absolute; left: 0; top: 0;
  min-height: 100%;
  z-index: 3;
}
.CodeMirror-gutter {
  white-space: normal;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  margin-bottom: -30px;
}
.CodeMirror-gutter-wrapper {
  position: absolute;
  z-index: 4;
  background: none !important;
  border: none !important;
}
.CodeMirror-gutter-background {
  position: absolute;
  top: 0; bottom: 0;
  z-index: 4;
}
.CodeMirror-gutter-elt {
  position: absolute;
  cursor: default;
  z-index: 4;
}
.CodeMirror-gutter-wrapper ::selection { background-color: transparent }
.CodeMirror-gutter-wrapper ::-moz-selection { background-color: transparent }

.CodeMirror-lines {
  cursor: text;
  min-height: 1px; /* prevents collapsing before first draw */
}
.CodeMirror pre {
  /* Reset some styles that the rest of the page might have set */
  -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;
  border-width: 0;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  margin: 0;
  white-space: pre;
  word-wrap: normal;
  line-height: inherit;
  color: inherit;
  z-index: 2;
  position: relative;
  overflow: visible;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-variant-ligatures: contextual;
  font-variant-ligatures: contextual;
}
.CodeMirror-wrap pre {
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: normal;
}

.CodeMirror-linebackground {
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  z-index: 0;
}

.CodeMirror-linewidget {
  position: relative;
  z-index: 2;
  overflow: auto;
}

/*.CodeMirror-widget {}*/

.CodeMirror-rtl pre { direction: rtl; }

.CodeMirror-code {
  outline: none;
}

/* Force content-box sizing for the elements where we expect it */
.CodeMirror-scroll,
.CodeMirror-sizer,
.CodeMirror-gutter,
.CodeMirror-gutters,
.CodeMirror-linenumber {
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.CodeMirror-measure {
  position: absolute;
  width: 100%;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}

.CodeMirror-cursor {
  position: absolute;
  pointer-events: none;
}
.CodeMirror-measure pre { position: static; }

div.CodeMirror-cursors {
  visibility: hidden;
  position: relative;
  z-index: 3;
}
div.CodeMirror-dragcursors {
  visibility: visible;
}

.CodeMirror-focused div.CodeMirror-cursors {
  visibility: visible;
}

.CodeMirror-selected { background: #d9d9d9; }
.CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }
.CodeMirror-crosshair { cursor: crosshair; }
.CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #d7d4f0; }
.CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #d7d4f0; }

.cm-searching {
  background-color: #ffa;
  background-color: rgba(255, 255, 0, .4);
}

/* Used to force a border model for a node */
.cm-force-border { padding-right: .1px; }

@media print {
  /* Hide the cursor when printing */
  .CodeMirror div.CodeMirror-cursors {
    visibility: hidden;
  }
}

/* See issue #2901 */
.cm-tab-wrap-hack:after { content: ''; }

/* Help users use markselection to safely style text background */
span.CodeMirror-selectedtext { background: none; }

</style>

<template lang="html">
    <div
        id="app"
        class="am-container"
        oncontextmenu="return false;">
        <am-header/>
        <am-list/>
        <am-code type="css"/>
        <am-gl/>
        <am-zoom-slider/>
        <am-tools/>
        <!--am-info/-->
        <am-loader/>
    </div>
</template>

<script>
import components from "../utils/requires/getComponents.js";

export default {
  components
};
</script>