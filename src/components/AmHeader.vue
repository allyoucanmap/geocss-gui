/* copyright 2018, stefano bovio @allyoucanmap. */

<style scoped>
    .am-header {
        display: flex;
        align-items: center;
        padding: 0 8px;
    }
    button {
        margin-left: 4px;
    }
    button:hover {
        background-color: #aaeeee;
    }
    button:active {
        background-color: #55eeee;
    }
    .am-logo {
        flex: 1;
        font-family: icone;
    }
    .am-modal-container {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .am-modal {
        margin: auto;
        background: #f2f2f2;
        padding: 8px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.24);
    }
    .am-field {
        display: flex;
    }
    .am-field > .am-label {
        width: 70px;
    }
    .am-field + .am-field {
        margin-top: 4px;
    }
    
    .am-field > input {
        flex: 1;
    }
    .am-footer {
        padding: 8px 0;
        display: flex;
        flex-direction: row-reverse;
    }
</style>

<template lang="html">
    <div class="am-header">
        <div class="am-logo">
            V
        </div>
        <button 
            class="am-icon"
            @click="() => show = true">
            F
        </button>
        <div
            v-if="show"
            class="am-modal-container">
            <div class="am-modal">
                <div class="am-footer">
                    <button
                        class="am-icon"
                        @click="() => show = false">
                        X
                    </button>
                </div>
                <div
                    class="am-field"
                    v-for="(field, idx) in form"
                    :key="idx">
                    <div class="am-label">
                        <small>{{ field.name }}</small>
                    </div>
                    <input
                        :type="field.type"
                        :placeholder="field.name"
                        v-model="field.value">
                </div>
                <div class="am-footer">
                    <button
                        :class="`am-icon`"
                        @click="() => $am_updateSettings()">
                        P
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    export default {
        data() {
            return {
                show: false,
                form: [
                    {
                        name: 'username',
                        value: '',
                        type: 'text'
                    },
                    {
                        name: 'password',
                        value: '',
                        type: 'password'
                    },
                    {
                        name: 'source',
                        value: '',
                        type: 'text'
                    }
                ]
            }
        },
        computed: {
            ...mapGetters({
                settings: 'app/settings'
            })
        },
        watch: {
            show(newShow, oldShow) {
                if (newShow && !oldShow) {
                    this.form = this.form.map(field => ({...field, value: this.settings[field.name]}));
                }
            }
        },
        created() {
            const str = localStorage.getItem('geocss-gui~settings');
            if (str) {
                try {
                    const settings = JSON.parse(str);
                    this.onUpdate(settings);
                } catch(e) { /* */ }
            }
        },
        methods: {
            ...mapActions({
                onUpdate: 'app/updateSettings'
            }),
            $am_updateSettings() {
                const settings = this.form.reduce((newSettings, field) => {
                    return {
                        ...newSettings,
                        [field.name]: field.value
                    }
                }, {});
                this.onUpdate(settings);
                this.show = false;
            }
        }
    };
</script>