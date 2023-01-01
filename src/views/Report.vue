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
           <th v-for="param in $store.getters.availableParameters" :key="param">{{ param }}</th>
         </tr>
       </thead>
       <tbody>
         <tr v-for="sensor in $store.getters.getSensors" :key="sensor.uid">
           <th> {{ sensor.uid }}</th>
           <th> {{ sensor.metadata.location }}</th>
           <th v-for="param in $store.getters.availableParameters" :key="param">{{ getParamValue(sensor, param) }}</th>
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
      const expected = param
      const expectedLower = param.toLowerCase()
      const match = sensor.reading.filter((x) => {
        return x.label === expected || x.label === expectedLower
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
