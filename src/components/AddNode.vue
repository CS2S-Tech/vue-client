<template>
  <b-form >
    <b-form-group label="UID: " label-for="node_uid" description="Please enter uid" >
      <b-form-input id="node_uid" v-model.trim="addNodeForm.uid" placeholder="Enter UID"></b-form-input>
    </b-form-group>
    <b-form-group label="Location: " label-for="node_loc" description="Please enter Location" >
      <b-form-input id="node_loc" v-model.trim="addNodeForm.metadata.location" placeholder="Enter Location"></b-form-input>
    </b-form-group>
    <b-form-group label="Sublocation: " label-for="node_sloc" description="Please enter Sublocation" >
      <b-form-input id="node_sloc" v-model.trim="addNodeForm.metadata.subLocation" placeholder="Enter Sublocation"></b-form-input>
    </b-form-group>
    <b-form-group label="Machine: " label-for="node_mac" description="Please enter Machine name" >
      <b-form-input id="node_mac" v-model.trim="addNodeForm.metadata.machineName" placeholder="Enter Machine"></b-form-input>
    </b-form-group>

    <b-table v-if="addNodeForm.parameters.length > 0" striped hover :items="addNodeForm.parameters" :fields="paramLabels">
      <template #cell(actions)="row">
        <b-button @click="deleteParam(row)"><DeleteIcon /></b-button>
      </template>
    </b-table>

    <b-form-group label="Add parameters: " v-if="labels.length > 0">
      <b-form-select v-model="curLabel" :options="labels"></b-form-select>
      <b-form-group label="Range: " class="mt-2">
        <b-form-input class="range" type="number" id="min" v-model.number.trim="curMin" placeholder="Enter Min value"></b-form-input>
        <b-form-input class="range" type="number" id="max" v-model.number.trim="curMax" placeholder="Enter Max value"></b-form-input>
      </b-form-group>
      <b-button @click="addParameter()" variant="secondary"><AddIcon />Add Parameter</b-button>
    </b-form-group>
    <hr>
    <b-button @click="addNode()" variant="primary">{{ isModify? 'Update Node' : 'Add Node' }}</b-button>
  </b-form>
</template>

<script>

import AddIcon from 'vue-material-design-icons/Plus.vue'
import DeleteIcon from 'vue-material-design-icons/Delete.vue'

export default {
  name: 'AddNodeForm',
  components : {
    DeleteIcon,
    AddIcon
  },
  props: ['sensor'],
  data() {
    const labels = this.$store.getters.availableParameters
    return {
      isModify: false,
      curMin: 0,
      curMax: 100,
      curLabel: 'Voltage',
      paramLabels: [
        { key: 'label', label: 'Parameter'},
        { key: 'min', label: 'Min'},
        { key: 'max', label: 'Max'},
        { key: 'actions', label: 'Actions'}
      ],
      labels: labels,
      addNodeForm: {
        uid: '',
        metadata: {
          location: '',
          subLocation: '',
          machineName: ''
        },
        parameters: []
      }
    }
  },
  created() {
    if (this.sensor != undefined) {
      this.isModify = true
      const sensor = this.sensor
      for(let i = 0 ; i < sensor.parameters.length; i++) {
        let idx = this.labels.indexOf(sensor.parameters[i].label)
        if (idx < 0) {
          this.$bvToast.toast('Invalid Parameter')
        }
        this.labels.splice(idx, 1)
        this.curLabel = this.labels[0]
      }
      this.addNodeForm = {...sensor} 
      
    }

  },
  methods: {
     deleteParam(row) {
       const label = row.item.label
       const idx = this.addNodeForm.parameters.findIndex(param => {
         return param.label == label
       })

       this.addNodeForm.parameters.splice(idx, 1)
       this.labels.unshift(label)

     },
    addParameter() {
      let labelToAdd = this.curLabel
      let min = this.curMin
      let max = this.curMax

      let idx = this.labels.indexOf(labelToAdd)
      if (idx < 0) {
        this.$bvToast.toast('Invalid Parameter')
      }
      this.labels.splice(idx, 1)
      this.curLabel = this.labels[0]

      this.addNodeForm.parameters.push({
        label: labelToAdd,
        min: min,
        max: max
      })
    },
    async addNode() {
      let action = this.isModify ? 'modifyNode' : 'addNode';
      let toastMsg = this.isModify ? 'Node updated' : 'Node added'; 
      let modalToHide = this.isModify ? 'modifyForm' : 'nodeForm'; 
      let node = {...this.addNodeForm}
      this.$store.dispatch(action, node)
        .then(() => {
            this.$bvToast.toast(toastMsg)
            this.$bvModal.hide(modalToHide)
            this.$store.dispatch('fetchSensors')
            })
      .catch((msg) => this.$bvToast.toast('Could not perform node operation: ' + msg))
    }
  }
}

</script>

<style>
.container {
  height: 200px;
  display: block;
}
.range {
  width: 48%;
  margin-left: 2px;
}
</style>
