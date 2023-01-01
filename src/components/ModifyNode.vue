<template>
    <b-form >
      <b-form-group label="UID: " label-for="node_uid" description="Please enter uid" >
        <b-form-input id="node_uid" v-model.trim="modifyNodeForm.uid" placeholder="Enter UID"></b-form-input>
      </b-form-group>
      <b-form-group label="Location: " label-for="node_loc" description="Please enter Location" >
        <b-form-input id="node_loc" v-model.trim="modifyNodeForm.loc" placeholder="Enter Location"></b-form-input>
      </b-form-group>
      <b-form-group label="Sublocation: " label-for="node_sloc" description="Please enter sub Location" >
        <b-form-input id="node_sloc" v-model.trim="modifyNodeForm.sloc" placeholder="Enter Sublocation"></b-form-input>
      </b-form-group>
      <b-form-group label="Machine: " label-for="node_mac" description="Please enter Machine name" >
        <b-form-input id="node_mac" v-model.trim="modifyNodeForm.mac" placeholder="Enter Machine"></b-form-input>
      </b-form-group>

      <b-table v-if="modifyNodeForm.parameters.length > 0" striped hover :items="modifyNodeForm.parameters" :fields="paramLabels">
      <template #cell(actions)="row">
        <b-button @click="deleteParam(row)"><DeleteIcon /></b-button>
      </template>
    </b-table>

    <b-form-group label="Add parameters: " v-if="labels.length > 0">
      <b-form-select v-model="curLabel" :options="labels"></b-form-select>
      <b-form-group label="Range: " class="mt-2">
        <b-form-input class="range" type="number" id="min" v-model.trim="curMin" placeholder="Enter Min value"></b-form-input>
        <b-form-input class="range" type="number" id="max" v-model.trim="curMax" placeholder="Enter Max value"></b-form-input>
      </b-form-group>
        <b-button @click="addParameter()" variant="secondary"><AddIcon />Add Parameter</b-button>
    </b-form-group>

    <hr>

    <b-button @click="modifyNode()" variant="primary">Update Node</b-button>

    </b-form>
</template>

<script>
export default {
  name: 'ModifyNodeForm',
  props: ['sensor'],
  methods: {
    async modifyNode() {
      let node = {
        uid: this.modifyNodeForm.uid,
        metadata: {
          location: this.modifyNodeForm.loc,
          sublocation: this.modifyNodeForm.sloc,
          machineName: this.modifyNodeForm.mac,
        },
        parameters: []
      }
      this.$store.dispatch('modifyNode', node)
        .then(() => {
          this.$bvToast.toast('Node Modified')
          this.$bvModal.hide('nodeForm')
          this.$store.dispatch('fetchSensors', 1)
        })
        .catch((msg) => this.$bvToast.toast('Could not modified node: ' + msg))
    }
  },
  created() {
    this.modifyNodeForm = {
uid: this.sensor.uid,
     metadata: {
location: this.sensor.metadata.location,
          subLocation: this.sensor.metadata.sublocation,
          machineName: this.sensor.metadata.machineName
     },
parameters: this.sensor.parameters
    }
  },
  data() {
    return {
      paramLabels: [
        { key: 'label', label: 'Parameter'},
        { key: 'min', label: 'Min'},
        { key: 'max', label: 'Max'},
        { key: 'actions', label: 'Actions'}
      ],
      modifyNodeForm: {
        uid: '',
        metadata: {
          location: '',
          subLocation: '',
          machineName: ''
        },
        parameters: []
      }
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
  float: left;
  margin-left: 2px;
}
</style>
