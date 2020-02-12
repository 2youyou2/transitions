if (CC_EDITOR && window.Vue) {

    Vue.component('transitions', {

        template: `
    
    <ui-prop name="Transition Name" style="margin-bottom:20px;">
        <ui-select
            :value="materialName"
            @confirm="_onMaterialChanged($event)"
        >
            <option
                v-for="type in materialTypes"
                :value="type"
            >{{type}}</option>
            <option 
                value="__missing__" 
                v-if="effectName === '__missing__'"
            >
                Missing Effect
            </option>
        </ui-select>
    </ui-prop>
    
    <template v-for="prop in target">
        <component
            v-if="prop.attrs.visible !== false"
            :is="prop.compType"
            :target.sync="prop"
            :indent="0"
            :multi-values="multi"
            ></component>
        </template>
    </template>

   `,

        props: {
            target: {
                twoWay: true,
                type: Object,
            },

            multi: {
                twoWay: true,
                type: Boolean,
            },
        },

        data () {
            return {
                materialName: '',
                materialTypes: []
            }
        },

        compiled () {
            this.materials = {};

            let Path = Editor.require('fire-path');
            Editor.assetdb.queryAssets('db://assets/**/transitions/**', 'material', (err, results) => {
                if (err) {
                    Editor.error(err);
                    return;
                }
                if (results) {
                    this.materialTypes = results.map(ret => {
                        let name = Path.basenameNoExt(ret.path);
                        if (ret.uuid === this.target.material.value.uuid) {
                            this.materialName = name;
                        }
                        this.materials[name] = ret;
                        return name;
                    })
                }
            });
        },

        watch: {
            materialName () {
                let uuid = this.materials[this.materialName].uuid;
                let prop = this.target.material;
                if (uuid === prop.value.uuid) {
                    return;
                }

                Editor.UI.fire(this.$el, 'target-change', {
                    bubbles: true,
                    detail: {
                        type: prop.type,
                        path: prop.path,
                        value: { uuid },
                    }
                });
            }
        },

        methods: {
            _onMaterialChanged (event) {
                this.materialName = event.target.value;
            },
        }
    });
}