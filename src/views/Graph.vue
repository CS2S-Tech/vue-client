<template>
  <div>
    <h1>Trend for {{ uid }} </h1>
    <div v-if="node">
      <h2>{{ node.metadata.location }} - {{ node.metadata.subLocation }}</h2>
      <table class="table">
        <tbody>
          <tr>
            <th>Parameter</th>
            <th>Min</th>
            <th>Max</th>
            <!--th>Mean</th>
            <th>Standard Deviation</th>
            <th>Variance</th-->
          </tr>
          <tr v-for="parameter in node.parameters" :key="parameter.label">
            <td>{{ parameter.label }}</td>
            <td>{{ parameter.min }}</td>
            <td>{{ parameter.max }}</td>
          </tr>
        </tbody>
      </table>
      <hr>
      Showing From
      <b>{{ formateDate(from) }}</b>
      to
      <b>{{ formateDate(to) }}</b>
      <p> Total readings beyond setpoints: {{ stats.faulty_readings }} </p>
    </div>
    <vue-loaders-ball-beat color="grey" scale="1" v-if="loading"/>
      <div v-else>
        <div class="row no-print">
          <div class="col-md-6">
            <b-button
                variant="primary"
                v-b-tooltip.hover
                @click="goToTable()"
                title="Go to table"
                >
                <TableIcon/>
            </b-button>
          </div>
          <div class="col-md-6" >
            <b-button variant="primary" title="Print Chart" @click="print()">
              <PrintIcon/>
            </b-button>
          </div>
        </div>
        <div class="print">
          <highcharts :options="chartOptions"></highcharts>
        </div>
      </div>
  </div>
</template>

<script>
import PrintIcon from 'vue-material-design-icons/Printer.vue'
import TableIcon from 'vue-material-design-icons/Table.vue'
import {Chart} from 'highcharts-vue'

export default {
  name: 'Graph',
  components: {
    highcharts: Chart,
    PrintIcon,
    TableIcon,
  },
  async mounted() {
    this.loading = true
    this.$store.dispatch('fetchNode', this.uid)
      .then(data => {
        this.node = data[0]
      })
    this.$store.dispatch('fetchTrend', {
      uid: this.uid,
      from: this.from,
      to: this.to
    })
    .then(this.constructData)

    this.$store.dispatch('fetchStats', {
      uid: this.uid,
      }).then(d => {
        console.log({d})
        this.stats = {...d}
        })
    this.loading = false
  },
  data() {
    return {
      uid: this.$route.params.uid,
      node: null,
      from: this.$route.params.from,
      to: this.$route.params.to,
      loading: true,
      /* chartData: [], */
      stats: {},
      chartOptions: {
        credits: false,
        title: {
          text: 'Trend for node'
        },
        yAxis: {
          title: {
            text: "Readings",
          }
        },
        xAxis: {
          type: 'datetime',
          minorTickInterval:10,
          minTickInterval:10,
          title: {
            text: "Timestamps",
          }
        },
        tooltip: {
          xDateFormat: '%B, %d %Y %H:%M:%S',
        },
        time: {
          timezoneOffset: -330
        },
        series: [ ]
      }
    }
  },
  methods: {
    formateDate(date) {
      let unx = Date.parse(date)
      unx = unx - (330*60*1000)
      return new Date(unx).toLocaleString()
    },
    goToTable() {
      this.$router.push({
        name: 'NodeTable',
        params: {
          uid: this.uid,
          from: this.from,
          to: this.to,
        }
      })
    },
    print() {
      window.print()
    },
    constructData (readings) {

      let reading = readings[0]
      let parameters = {}
      for (let i = 0; i < reading.values.length; i++) {
        let param = reading.values[i].label
          parameters[param] = []
      }
      for (let reading of readings) {
        for (let i = 0; i < reading.values.length; i++) {
          console.log({reading})
          console.log(new Date(reading.datetime * 1000))
          let param = reading.values[i].label
          let value = parseFloat(reading.values[i].value) || 0
          parameters[param].push([
           new Date(reading.datetime * 1000),
           value,
          ])
        }
      }
      console.log(parameters)

      let paramkeys = Object.keys(parameters)
      console.log(paramkeys)
      for (let i = 0; i < paramkeys.length; i++) {
        let param = paramkeys[i]
        console.log(param)
        this.chartOptions.series.push({
          name: param,
          data: parameters[param]
        })
      }
    }
  }
}
</script>

<style scoped>
@media print {
  .no-print { display: none; }

  .print {
    display: block;
    transform: translateY(400px) rotate(90deg) scale(1.25);
  }
}

</style>
