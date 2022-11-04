<template>
  <b-form >
    <b-form-group label="UID: " label-for="node_uid" description="Please enter uid" >
      <b-form-input id="node_uid" v-model.trim="addNodeForm.uid" placeholder="Enter UID"></b-form-input>
    </b-form-group>
    <b-form-group label="Location: " label-for="node_loc" description="Please enter Location" >
      <b-form-input id="node_loc" v-model.trim="addNodeForm.loc" placeholder="Enter Location"></b-form-input>
    </b-form-group>
    <b-form-group label="Sublocation: " label-for="node_sloc" description="Please enter Sublocation" >
      <b-form-input id="node_sloc" v-model.trim="addNodeForm.sloc" placeholder="Enter Sublocation"></b-form-input>
    </b-form-group>
    <b-form-group label="Machine: " label-for="node_mac" description="Please enter Machine name" >
      <b-form-input id="node_mac" v-model.trim="addNodeForm.mac" placeholder="Enter Machine"></b-form-input>
    </b-form-group>

    <b-form-checkbox
      id="_isTemp" v-model.trim="isTemp" name="checkbox1"
    >
    {{ $t('params.param1') }}
    </b-form-checkbox>

      <b-form-group v-if="isTemp" :label="`${$t('params.param1')} Range: `" label-for="node_temperaturer" :description="`Please enter ${$t('params.param1')} Range`" >
      <b-form-input class="range" type="number" id="node_temperaturen" v-model.trim="addNodeForm.temperaturen" :placeholder="`Enter ${$t('params.param1')} Min`"></b-form-input>
      <b-form-input class="range" type="number" id="node_temperaturex" v-model.trim="addNodeForm.temperaturex" :placeholder="`Enter ${$t('params.param1')} Min`"></b-form-input>
    </b-form-group>

    <b-form-checkbox
      id="_isHum" v-model.trim="isHum" name="checkbox2"
    >
    {{ $t('params.param2') }}
    </b-form-checkbox>

      <b-form-group v-if="isHum" :label="`${$t('params.param2')} Range: `" label-for="node_humidityr" :description="`Please enter ${$t('params.param2')} Range`" >
      <b-form-input class="range" type="number" id="node_humidityn" v-model.trim="addNodeForm.humidityn" :placeholder="`Enter ${$t('params.param2')} Min`"></b-form-input>
      <b-form-input class="range" type="number" id="node_humidityx" v-model.trim="addNodeForm.humidityx" :placeholder="`Enter ${$t('params.param2')} Min`"></b-form-input>
    </b-form-group>

    <b-form-checkbox
      id="_isCO2" v-model.trim="isCO2" name="checkbox3"
    >
    {{ $t('params.param3') }}
    </b-form-checkbox>

      <b-form-group v-if="isCO2" :label="`${$t('params.param3')} Range: `" label-for="node_co2r" :description="`Please enter ${$t('params.param3')} Range`" >
        <b-form-input class="range" type="number" id="node_co2n" v-model.trim="addNodeForm.co2n" :placeholder="`Enter ${$t('params.param3')} Min`"></b-form-input>
        <b-form-input class="range" type="number" id="node_co2x" v-model.trim="addNodeForm.co2x" :placeholder="`Enter ${$t('params.param3')} Max`"></b-form-input>
    </b-form-group>
    <hr>
    <b-button @click="addNode()" variant="primary">Add Node</b-button>
  </b-form>
</template>

<script>
export default {
  name: 'AddNodeForm',
  methods: {
    async addNode() {
      let node = {
        uid: this.addNodeForm.uid,
        location: this.addNodeForm.loc,
        sublocation: this.addNodeForm.sloc,
        machineName: this.addNodeForm.mac,
        co2Range: {
          min: this.addNodeForm.co2n,
          max: this.addNodeForm.co2x
        },
        temperatureRange: {
          min: this.addNodeForm.temperaturen,
          max: this.addNodeForm.temperaturex
        },
        pressureRange: {
          min: this.addNodeForm.pressuren,
          max: this.addNodeForm.pressurex
        },
        humidityRange: {
          min: this.addNodeForm.humidityn,
          max: this.addNodeForm.humidityx
        },
        isTemp: this.isTemp,
        isHum: this.isHum,
        isCO2: this.isCO2
      }
      this.$store.dispatch('addNode', node)
        .then(() => {
          this.$bvToast.toast('Node Added')
          this.$bvModal.hide('nodeForm')
          this.$store.dispatch('fetchSensors')
        })
        .catch((msg) => this.$bvToast.toast('Could not Add node: ' + msg))
    }
  },
  data() {
    return {
      addNodeForm: {
        uid: '',
        loc: '',
        sloc: '',
        mac: '',
        co2n: 0,
        co2x: 100,
        temperaturen: 0,
        temperaturex: 100,
        pressuren: 0,
        pressurex: 100,
        humidityn: 0,
        humidityx: 100,
      },
      isTemp: false,
      isHum: false,
      isCO2: false
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
