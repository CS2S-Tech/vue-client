<template>
  <div>
    <b-button class="no-print" variant="primary" title="Print Chart" @click="print()">
      <PrintIcon/>
    </b-button>

    <h2>{{ uid }}</h2>
    <div v-if="nodes !== {}">
    <h3 v-if="nodes && nodes.length > 1 && nodes[0].metadata">
      {{ nodes[0].metadata.location }} - {{ nodes[0].metadata.subLocation }}
    </h3>
    </div>
    <table class="table">
     <thead>
      <tr>
        <th> Datetime </th>
        <th v-for="col in $store.getters.availableParameters" :key="col"> {{ col }}</th>
      </tr>
     </thead>
     <tbody>
       <tr v-for="reading in filteredReadings" :key="reading._id">
        <td>
          {{ new Date(reading.datetime * 1000).toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})  }}
        </td>
        <td>
          {{ reading.values[0].value }}
        </td>
        <td>
          {{ reading.values[1].value }}
        </td>
        <td>
          {{ reading.values[2].value }}
        </td>
       </tr>
     </tbody>
    </table>
    <!--b-table :busy="loading" filter="/.*/" :filter-function="filterReadings" striped sticky-header hover :items="readings" :fields="fields" >
      <template #cell(datetime)="dt">
        {{ new Date(dt.value).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})  }}
      </template>
      <template #cell(temperature)="dt">
        {{ dt.item.value }} &deg;C
      </template>
      <template #cell(co2)="dt">
        {{ dt.item.co2 }} %
      </template>
      <template #cell(humidity)="dt">
        {{ dt.item.humidity }} %
      </template>
      <template #table-busy>
        <div class="text-center text-info my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong> Loading...</strong>
        </div>
      </template>
    </b-table-->
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
      uid: this.$route.params.uid,
      from: this.$route.params.from,
      to: this.$route.params.to,
      fields: ['datetime'],
      loading: true,
      nodes: {},
      readings: []
    }
  },
  async mounted() {
    await this.getNode()
    await this.getReadings()
  },
  computed: {
    filteredReadings() {
      const x = this.readings.filter((r) => {
        return r.values !== null
      })
      return x
    },
  },
  methods: {
    filterReadings() {
      return true
    },
    async getNode() {
      this.$store.dispatch('fetchNode', this.uid).then(data => {
        this.nodes = data
      })
    },
    async getReadings() {
      console.log( this.uid, this.from , this.to )
      this.$store.dispatch('fetchTrend', {
        uid: this.uid,
        from: this.from.toString(),
        to: this.to.toString()
      }).then(r => {
        this.readings = r
        this.loading = false
      })

    },
    print() {
      window.print()
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
