<template>
  <div>
    <b-button class="no-print" variant="primary" title="Print Chart" @click="print()">
      <PrintIcon/>
    </b-button>

    <b-table :busy="loading" striped sticky-header hover :items="$store.getters.getSensors" :fields="fields">
      <template #cell(reading.temperature)="dt">
        <span v-if="dt.item.reading.temperature">
          {{ dt.item.reading.temperature }} &deg;C
        </span>
        <span v-else>
          --
        </span>
      </template>
      <template #cell(reading.humidity)="dt">
        <span v-if="dt.item.reading.humidity">
          {{ dt.item.reading.humidity }} %
        </span>
        <span v-else>
          --
        </span>
      </template>
      <template #cell(reading.co2)="dt">
        <span v-if="dt.item.reading.co2">
          {{ dt.item.reading.co2 }} %
        </span>
        <span v-else>
          --
        </span>
      </template>
      <template #table-busy>
        <div class="text-center text-info my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong> Coming soon...</strong>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import PrintIcon from 'vue-material-design-icons/Printer.vue'

export default {
  name: 'Table',
  components: {
    PrintIcon
  },
  data() {
    return {
      loading: true,
      items: [],
      fields: [
        { key: 'uid', label: 'UID' },
        { key: 'location', label: 'Location' },
        // { key: 'temperatureRange.min', label: 'Min Temp' },
        { key: 'reading.temperature', label: 'Current ' + this.$t('params.param1') },
        // { key: 'temperatureRange.max', label: 'Max Temp' },
        // { key: 'humidityRange.min', label: 'Min Hum' },
        { key: 'reading.humidity', label: 'Cur ' + this.$t('params.param2') },
        // { key: 'humidityRange.max', label: 'Max Hum' },
        // { key: 'co2Range.min', label: 'Min CO2' },
        { key: 'reading.co2', label: 'Cur ' + this.$t('params.param3') },
        // { key: 'co2Range.max', label: 'Max CO2' },
      ],
    }
  },
  async mounted() {
    await this.allNodesCurrentData()
  },
  methods: {
    print() {
      window.print()
    },
    async allNodesCurrentData() {
      this.items = this.$store.getters.getSensors
      this.loading = false

    }
  }

}
</script>

<style scoped>
table, tbody {
  width: 100%;
}
th, td {
  width: 100px;
}

@media print {
  .no-print { display: none; }
}

</style>
