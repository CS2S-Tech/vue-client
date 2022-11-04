<template >
  <div>
    <div class="container" v-if="sensors.length > 0 && !loading">
      <div class="card-container">
        <b-card
          v-for="sensor in sensors"
          :key="sensor._id"
          class="card drk"
          >
          <b-card-title class="copyable" @click="copyUID(sensor.uid)">UID: {{ sensor.uid }}</b-card-title>
          <b-card-sub-title>{{ sensor.reading.user }}</b-card-sub-title>
          <hr>
          <b-card-text >

            <table>
              <tr>
                <td>
                  Machine
                </td>
            <td class="value" >
              {{ sensor.machineName }}
            </td>
              </tr>
              <tr>
                <td>
                  Location
                </td>
                <td class="value">
                  {{ sensor.location }}
                </td>
              </tr>
              <tr>
                <td>
                  Sub-location
                </td>
                <td class="value">
                  {{ sensor.sublocation || "" }}
                </td>
              </tr>
              <tr v-if="sensor.isTemperature">
                <td>{{ $t('params.param1') }}</td>
                <td
                    class="value"
                    :class="{
                            ok : checkOK(sensor.temperatureRange, sensor.reading.temperature),
                            notok : !checkOK(sensor.temperatureRange, sensor.reading.temperature)}"
                    >
                    {{ sensor.reading.temperature || '-' }} &deg;C
                </td>
              </tr>
              <tr v-if="sensor.isHumidity">
                <td>{{ $t('params.param2') }}</td>
                <td
                    class="value"
                    :class="{
                            ok : checkOK(sensor.humidityRange, sensor.reading.humidity),
                            notok : !checkOK(sensor.humidityRange, sensor.reading.humidity)}"
                    >
                    {{ sensor.reading.humidity || '-' }} %
                </td>
              </tr>
              <tr v-if="sensor.isCO2">
                <td>{{ $t('params.param3') }}</td>
                <td
                    class="value"
                    :class="{
                            ok : checkOK(sensor.co2Range, sensor.reading.co2),
                            notok : !checkOK(sensor.co2Range, sensor.reading.co2)}"
                    >
                    {{ sensor.reading.co2 || '-'}} %
                </td>
              </tr>
              <tr>
                <td>Battery</td>
                <td class="value" :style="{ok : true}">
                  <BatteryFull title="Battery Full" v-if="parseInt(sensor.reading.battery) >= 90" class="ok" />
                  <BatteryHalf title="Battery Normal" class="notbad" v-else-if="parseInt(sensor.reading.battery) >= 20 && parseInt(sensor.reading.battery ) < 90"/>
                  <BatteryLow title="Battery Critical" class="notok" v-else/>
                </td>
              </tr>
            </table>
            <hr>
            <table>

              <tr>
                <td @click="deleteNode(sensor.uid)">
                  <DeleteIcon title="Delete Node" class="action-btn delete" />
                </td>
                <td class="value" >
                  <Pencil @click="showModify(sensor)" title="Edit the node" class="action-btn" />
                </td>
              </tr>
            </table>
            <hr>
          </b-card-text>
          <template class="c-footer" #footer>
            <div>
              Last Updated at: {{ formatDate(sensor.reading.datetime )}},
              <br>
              {{ checkOffline(sensor) }} ago
            </div>

          </template>
      </b-card>
      </div>
    </div>
    <div v-else>
      <h3>No nodes in this category</h3>
    </div>
    <b-modal class="long" ref="modifyForm" id="modifyForm" title="Modify Node" hide-footer>
      <ModifyNodeForm :sensor="currentNode"/>
    </b-modal>
  </div>
</template>

<script>

import ModifyNodeForm from '@/components/ModifyNode.vue'

import DeleteIcon from 'vue-material-design-icons/Delete.vue';
import 'vue-loaders/dist/vue-loaders.css';
import BatteryFull from 'vue-material-design-icons/Battery.vue';
import BatteryLow from 'vue-material-design-icons/BatteryLow.vue';
import BatteryHalf from 'vue-material-design-icons/Battery50.vue';
import Pencil from 'vue-material-design-icons/Pencil.vue';
// import { designationArray } from '../common/designation';
import { mapGetters } from 'vuex';

export default {
  name: 'Cards',
  props: [ 'sensors', ],
  data() {
    return {
      server: process.env.VUE_APP_HOST,
      currentNode: null
    }
  },
  components: {
    DeleteIcon,
    BatteryFull,
    BatteryHalf,
    ModifyNodeForm,
    BatteryLow,
    Pencil
  },
  computed: {
    ...mapGetters({loading: 'isLoading'})
  },
  methods: {
    copyUID (uid) {
      try {
        navigator.clipboard.writeText(uid.trim())
        this.$bvToast.toast('UID copied to the clipboard')
      } catch (e) {
        this.$bvToast.toast('Cannot copy UID: Permission Denied')
      }
    },
    showModify(node) {
      if (this.$store.getters.getPrivilege > 2) {
        this.$bvToast.toast('You are not authorized to perform this action')
        return
      }
      this.currentNode = node
      this.$refs['modifyForm'].show()
    },
    checkOK(range, val) {
      return (range.min <= val && val <= range.max)
    },
    async deleteNode(uid) {
      if (this.$store.getters.getPrivilege > 2) {
        this.$bvToast.toast('You are not authorized to perform this action')
        return
      }
      this.$bvModal.msgBoxConfirm("Are you sure you want to delete the node "+ uid)
        .then(confirmation => {
          if(confirmation) {
            this.$store.dispatch('archiveNode', uid)
              .then(() => {
                this.$bvToast.toast('Successfully Deleted ' + uid)
                this.$store.dispatch('fetchSensors', 1)
              })
              .catch(() => this.$bvToast.toast('Could not delete ' + uid))
          }
        })
        .catch(e => {
          this.message = e.message
          this.$bvToast.toast(e.message)
        })
    },
    checkOffline(sensor) {
      const dt = Date.parse(sensor.reading.datetime)
      const dateDiff_hrs = Math.floor((new Date() - dt) / 1000 / 3600 ) ;
      if (dateDiff_hrs > 24) {
        return Math.floor(dateDiff_hrs / 24) + " days"
      }
      return dateDiff_hrs + " hrs"
    },
    formatDate(date) {
      return new Date(date).toLocaleString('en-IN')
    }
  }
}

</script>

<style scoped>

td {
  font-size: 13pt;
}
.container {
  min-height: 200px;
}

.card-container {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.card-container .card-body {
  flex: 0 1 auto;
  margin-top: auto;
}

.card-container .card-footer {
  margin-bottom: auto;
}

.card {
  padding: 15px 2px;
  padding-left: 10px;
  height: auto;
}

.card-footer {
  border-top: none;
}

.full_neu {
  border-radius: 15px;
  box-shadow: inset -3px -3px 5px rgba(255, 255, 255, 0.2), inset 3px 3px 15px rgba(0, 0, 0, 0.3);
  background-color: #efefef;
  border: none;
}

.shadow_neu {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.drk {
  background-color: #111111dd;
  color: #fefefe;
  box-shadow: 6px 6px 35px rgba(128, 128, 128, .8);
  border-radius: 15px;
}

.card-body {
  padding: 5px 5px;
}

table {
  width: 95%;
}

table.card {
  width: 95%;
  text-align: left;
}

.delete {
  color: #fd4433;
}

.ok {
  color: #689D6A;
  color: lime;
}

.long {
  height: 100%;
}

.notok {
  color: #CC241D;
  color: red;
}

td {
  text-align: left;
}

.container {
  height: auto;
}

.value {
  font-weight: bold;
  text-align: right;
  text-transform: capitalize;
}

.notbad {
  color: orange;
}

.download {
  color: #fff;
}

.copyable {
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .card-container {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media screen and (max-width: 546px) {
  .card-container {
    grid-template-columns: 1fr;
  }
}

</style>
