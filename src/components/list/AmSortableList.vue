/* copyright 2018, stefano bovio @allyoucanmap. */

<style scoped>
    .am-item {
        font-size: 14px;
        margin: 4px;
        padding: 4px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        border: 1px solid rgba(0, 0, 0, 0.12);
        box-sizing: border-box;
        pointer-events: none;
    }
    .am-item > .am-label {
        flex: 1;
        overflow: hidden;
        padding-right: 4px;
    }
    .am-item > .am-label > div {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .am-item .am-btns {
        pointer-events: auto;
        display: flex;
    }
    .am-item .am-btns button + button {
        margin-left: 4px;
    }
    .am-group .am-item .am-btns button {
        color: #aaaaaa;
        border-color: #aaaaaa;
    }
    .am-item-container {
        box-sizing: border-box;
        overflow: hidden;
        transition: all 0.3s;
        background-color: transparent;
    }
    .am-hide {
        display: none;
    }
    .am-item.am-selected {
        background-color: #91f3f7;
    }
    .am-group .am-item {
        background-color: #333333;
        transition: all 0.3s;
    }
    .am-group .am-item > div > div {
        color: #f2f2f2;
    }
    .am-group.am-collapsed .am-item {
        background-color: #444444;
    }
    .am-item .am-panel {
        width: 100%;
        pointer-events: auto;
    }
    .am-item-panel {
        padding: 0;
        border-bottom: none; 
    }
    .am-group .am-item.am-selected {
        background-color: #115555;
    }
</style>

<template lang="html">
    <div
        class="am-sortable-list"
        @dragstart="$_am_dragstart"
        @dragend="$_am_dragend"
        @dragover="$_am_dragover"
        @dragenter="$_am_dragenter"
        @drop="$_am_drop">
        <div
            v-for="item in items"
            :class="`am-item-container ${!item.panel && item.type === 'group' && item.collapsed ? 'am-collapsed' : ''} ${(oldID === item.id || item.collapsed === true && item.type !== 'group') ? 'am-hide' : ''} ${!item.panel && item.type === 'group' ? 'am-group' : ''}`"
            :key="item.id"
            :data-id="item.id"
            :data-list-id="listID"
            :draggable="!item.expanded && items.length > 1"
            @click="() => onSelect(item.id)">
            <div
                v-if="!item.panel"
                :class="`am-item ${item.id === selectedItem.id && 'am-selected'}`"
                :data-id="item.id">
                <div class="am-label">
                    <div>{{ $am_getTitle(item) || item.label }}</div>
                </div>
                <div class="am-btns">
                    <button
                        class="am-icon"
                        @click="event => $am_onRemove(event, item.id)">
                        X
                    </button>
                    <button
                        v-if="item.type === 'group'"
                        class="inverse am-icon"
                        @click="event => $am_onExpand(event, item.id)">
                        {{ item.collapsed ? 'M' : 'P' }}
                    </button>
                    <button
                        class="am-icon"
                        @click="event => onDuplicate(event, item.id)">
                        9
                    </button>
                </div>
            </div>
            <div
                v-if="item.panel"
                :class="`am-item am-item-panel`"
                :data-id="item.id"
                :key="item.id">
                <am-panel
                    :head="item.head"
                    :collapsed="!item.expanded"
                    :key="item.id"
                    :on-remove="event => $am_onRemove(event, item.id)"
                    :on-expand="value => $am_onExpandPanel(item.id, value)">
                    <am-input-group
                        v-for="(param, valueId) in item.params"
                        :key="param.label"
                        :value="param.value"
                        :default-option="param.option"
                        :label="param.label"
                        :type="param.type"
                        :on-change="value => $am_onChange(item.id, valueId, value)"/>
                </am-panel>
            </div>
        </div>
    </div>
</template>

<script>
    import {head, isNil} from 'lodash';
    import uuidv1 from 'uuid/v1';
    import AmPanel from '../panel/AmPanel.vue';
    import AmInputGroup from '../input/AmInputGroup.vue';

    export default {
        components: {
            AmPanel,
            AmInputGroup
        },
        props: {
            items: {
                type: Array,
                default: () => []
            },
            onChange: {
                type: Function,
                default: () => {}
            },
            onSelect: {
                type: Function,
                default: () => {}
            },
            onDuplicate: {
                type: Function,
                default: () => {}
            },
            selectedItem: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                oldID: -1,
                hoverID: -1,
                currentID: -1,
                position: '',
                listID: -1,
                oldListID: -1
            };
        },
        created() {
            this.listID = uuidv1();
        },
        methods: {
            $_am_dragover(event) {
                const children = [...this.$el.children];
                const child = head(children.filter(child => child.contains(event.target)));
                const currentListID = head(children.filter(child => child.contains(event.target)).map(child => child.getAttribute('data-list-id')));
                if (this.oldListID === currentListID) {
                    const hoverID  = child.getAttribute('data-id');

                    const containerRect = this.$el.getBoundingClientRect();
                    const targetRect = child.getBoundingClientRect();
                    const mouseY = event.clientY - containerRect.top;
                    const targetY = targetRect.top - containerRect.top;
                    const items = [...this.$el.getElementsByClassName('am-item-container')];

                    items.forEach(item => {
                        item.style.paddingBottom = 0;
                        item.style.paddingTop = 0;
                        item.style.backgroundColor = 'transparent';
                        item.style.color = '#333333';
                    });

                    if (hoverID) {
                        if (mouseY >= targetY + targetRect.height / 2) {
                            child.style.paddingBottom = 27 + 'px';
                            this.position = 'DOWN';
                        } else if (mouseY < targetY + (targetRect.height / 2)) {
                            child.style.paddingTop = 27 + 'px';
                            this.position = 'UP';
                        }
                    }
                }
                event.preventDefault();
            },
            $_am_dragend(event) {
                const items = [...this.$el.getElementsByClassName('am-item-container')];

                items.forEach(item => {
                    item.style.paddingBottom = 0;
                    item.style.paddingTop = 0;
                    item.style.backgroundColor = 'transparent';
                    item.style.color = '#333333';
                });
                this.currentID = -1;
                this.oldID = -1;
                event.preventDefault();
            },
            $_am_dragenter(event) {
                event.preventDefault();
            },
            $_am_drop(event) {
                const children = [...this.$el.children];
                this.currentID = head(children.filter(child => child.contains(event.target)).map(child => child.getAttribute('data-id')));
                const currentListID = head(children.filter(child => child.contains(event.target)).map(child => child.getAttribute('data-list-id')));
                if (this.oldListID === currentListID && !isNil(this.currentID) && !isNil(this.oldID) && this.currentID !== this.oldID) {
                    const oldItem = head(this.items.filter(item => item.id === this.oldID));
                    const collapsedItems = this.items.filter(item => item.type !== 'group' && item.collapsed);
                    const oldGroupTail = oldItem.type === 'group' && collapsedItems.filter(collapsed => collapsed.groupId === oldItem.id) || [];
                    const items = this.items.filter(item => (item.type !== 'group' && !item.collapsed) || item.type === 'group').reduce((newItems, item) => {
                        const groupTail = item.type === 'group' && collapsedItems.filter(collapsed => collapsed.groupId === item.id) || [];
                        if (this.position === 'UP' && item.id === this.currentID) {
                            return [...newItems, {...oldItem},  ...oldGroupTail, {...item}, ...groupTail];
                        }
                        if (this.position === 'DOWN' && item.id === this.currentID) {
                            return [...newItems, {...item}, ...groupTail, {...oldItem}, ...oldGroupTail];
                        }
                        if (item.id === this.oldID) {
                            return [...newItems];
                        }
                        return [...newItems, {...item}, ...groupTail];
                    }, []).reduce((newItems, item) => {
                        const groupId = newItems.length > 0 && newItems[newItems.length - 1]
                        && (newItems[newItems.length - 1].type === 'group' && newItems[newItems.length - 1].id
                        || newItems[newItems.length - 1].groupId);
                        return [...newItems, {...item, groupId}];
                    }, []);
                    this.onChange(items);
                }
                this.currentID = -1;
                this.oldID = -1;
                this.oldListID = -1;
            },
            $_am_dragstart(event) {
                const children = [...this.$el.children];
                this.oldID = head(children.filter(child => child.contains(event.target)).map(child => child.getAttribute('data-id')));
                this.oldListID = head(children.filter(child => child.contains(event.target)).map(child => child.getAttribute('data-list-id')));
            },
            $am_onExpand(event, itemId) {
                event.stopPropagation();
                const items = this.items.map((item) => {
                    return item.id === itemId ? {...item, collapsed: !item.collapsed} : {...item};
                }).reduce((newItems, item) => {
                    const groupId = newItems.length > 0 && newItems[newItems.length - 1]
                    && (newItems[newItems.length - 1].type === 'group' && newItems[newItems.length - 1].id
                    || newItems[newItems.length - 1].groupId);
                    const collapsed = newItems.length > 0 && newItems[newItems.length - 1]
                    && (newItems[newItems.length - 1].type === 'group' && newItems[newItems.length - 1].collapsed
                    || newItems[newItems.length - 1].collapsed);
                    return item.type === 'group' ? [...newItems, {...item}] : [...newItems, {...item, groupId, collapsed}];
                }, []);
                this.onChange(items);
            },
            $am_onExpandPanel(itemId, expanded) {
                const items = this.items.map(item => item.id === itemId ? {...item, expanded} : {...item});
                this.onChange(items);
            },
            $am_onRemove(event, id) {
                event.stopPropagation();
                const items = this.items.filter(item => item.id !== id && !(item.groupId === id && item.collapsed));
                this.onChange(items);
            },
            $am_onDuplicate(event, id) {
                event.stopPropagation();
                const items = this.items.reduce((newItems, item) => {
                    const idx = uuidv1();
                    const general = item.general && item.general.map((param) => {
                        return param.name === 'Name' ? {
                            ...param,
                            value: idx
                        } : param
                    });
                    return [...newItems, ...(item.id === id ? [item, {...item, id: idx, general}] : [item])];
                }, []);
                this.onChange(items);
            },
            $am_onChange(itemId, valueId, value) {
                const items = this.items.map(item => item.id === itemId ? {...item, params: (item.params || []).map((param, vId) => vId === valueId ? {...param, value} : {...param})} : {...item});
                this.onChange(items);
            },
            $am_getTitle(item) {
                return item && item.general && head(item.general.filter(param => param.name === 'Title').map(param => param.value));
            }
        }
    };
</script>
