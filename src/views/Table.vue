<template>
  <div>
    <b-button class="no-print" variant="primary" title="Print Chart" @click="print()">
      <PrintIcon/>
    </b-button>

    <h2>{{ uid }}</h2>
    <div v-if="nodes !== {}">
      <h3>{{ nodes.location }} - {{ nodes.sublocation }}</h3>
    </div>
    <b-table :busy="loading" filter="/.*/" :filter-function="filterReadings" striped sticky-header hover :items="readings" :fields="fields" >
      <template #cell(datetime)="dt">
        {{ new Date(dt.value).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})  }}
      </template>
      <template #cell(temperature)="dt">
        {{ dt.item.temperature }} &deg;C
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
  methods: {
    filterReadings(item) {
      if (this.nodes.isTemperature && item.temperature === undefined) {
        return false
      }
      if (this.nodes.isHumidity && item.humidity === undefined) {
        return false
      }
      if (this.nodes.isCO2 && item.co2 === undefined) {
        return false
      }
      return true
    },
    async getNode() {
      this.$store.dispatch('fetchNode', this.uid).then(data => {
        this.nodes = data
        if (data.isTemperature) {
          this.fields.push(this.$t('params.param1'))
        }
        if (data.isHumidity) {
          this.fields.push(this.$t('params.param2'))
        }
        if (data.isCO2) {
          this.fields.push(this.$t('params.param3'))
        }
      })
    },
    async getReadings() {
      console.log( this.uid, this.from , this.to )
      this.$store.dispatch('fetchTrend', {
        uid: this.uid,
        from: this.from,
        to: this.to
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
