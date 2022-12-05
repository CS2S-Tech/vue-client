<template>
  <div>
    <b-button class="no-print" variant="primary" title="Print Chart" @click="print()">
      <PrintIcon/>
    </b-button>

    <table class="table ">
       <thead>
         <tr>
           <th> UID </th>
           <th> Location </th>
           <th v-for="param in availableParameters" :key="param">{{ param }}</th>
         </tr>
       </thead>
       <tbody>
         <tr v-for="sensor in $store.getters.getSensors" :key="sensor.uid">
           <th> {{ sensor.uid }}</th>
           <th> {{ sensor.metadata.location }}</th>
           <th v-for="param in availableParameters" :key="param">{{ getParamValue(sensor, param) }}</th>
         </tr>
       </tbody>
    </table>
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
      availableParameters: ['Temperature', 'Humidity', 'CO2'],
      fields: [
        { key: 'uid', label: 'UID' },
        { key: 'metadata.location', label: 'Location' },
        { key: 'parameters.0.label', label: 'Parameters' },
        { key: 'parameters.0.label', label: 'Parameters2' }
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
    },
    getParamValue(sensor,param) {
      const expected = param.toLowerCase()
      const match = sensor.reading.filter((x) => {
        return x.label == expected
      })[0]
      if (match != undefined) {
        return match.value
      }
      return "-"
      
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
