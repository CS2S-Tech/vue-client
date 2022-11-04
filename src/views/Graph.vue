<template>
  <div>
    <h1>Trend for {{ uid }} </h1>
    <div v-if="node">
      <h2>{{ node.location }} - {{ node.sublocation }}</h2>
      <table class="table">
        <tbody>
          <tr>
            <th>Parameter</th>
            <th>Min</th>
            <th>Max</th>
            <th>Mean</th>
            <th>Standard Deviation</th>
            <th>Variance</th>
          </tr>
          <tr v-if="node.isTemperature">
            <td>{{ $t('params.param1') }}</td>
            <td>{{ node.temperatureRange.min }}</td>
            <td>{{ node.temperatureRange.max }}</td>

<!--
{
  "co2Mean": null,
  "co2Sigma": null,
  "faulty_readings": 2,
  "humidityMean": null,
  "humiditySigma": null,
  "temperatureMean": 87.29724770642203,
  "temperatureSigma": 417.4485495189427,
  "uid": "ABCDEF"
}
-->
            <td>{{ stats.temperatureMean }}</td>
            <td>{{ stats.temperatureSigma }}</td>
            <td>{{ stats.temperatureSigma*stats.temperatureSigma }}</td>
          </tr>
          <tr v-if="node.isHumidity">
            <td>{{ $t('params.param2') }}</td>
            <td>{{ node.temperatureRange.min }}</td>
            <td>{{ node.humidityRange.min }}</td>
            <td>{{ node.humidityRange.max }}</td>

            <td>{{ stats.humidityMean }}</td>
            <td>{{ stats.humiditySigma }}</td>
            <td>{{ stats.humiditySigma*stats.humiditySigma }}</td>
          </tr>
          <tr v-if="node.isCO2">
            <td>{{ $t('params.param3') }}</td>
            <td>{{ node.co2Range.min }}</td>
            <td>{{ node.co2Range.max }}</td>

            <td>{{ stats.co2Mean }}</td>
            <td>{{ stats.co2Sigma }}</td>
            <td>{{ stats.co2Sigma*stats.co2Sigma }}</td>
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
        this.node = data
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
      chartData: [],
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
      const csvData = []

      let co2 = []
      let humidity = []
      let temperature = []

      for(let reading of readings) {
        let date = new Date(reading.datetime).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})
        csvData.push({
          date: date,
          co2: parseFloat(reading.co2 || 0),
          temperature: parseFloat(reading.temperature || 0),
          humidity: parseFloat(reading.humidity || 0)
        })

        co2.push([
          Date.parse(new Date(reading.datetime)),
          parseFloat(reading.co2) || 0
        ])

        temperature.push([
          Date.parse(new Date(reading.datetime)),
          parseFloat(reading.temperature) || 0
        ])

        humidity.push([
          Date.parse(new Date(reading.datetime)),
          parseFloat(reading.humidity) || 0
        ])

      }

      this.chartData.push(...csvData)

      let idx = 0
      if (this.node.isCO2) {
        this.chartOptions.series.push({
          name: this.$t('params.param3'),
          data: []
        })
        this.chartOptions.series[idx].data.push(...co2)
        idx++
      }
      if (this.node.isTemperature) {
        this.chartOptions.series.push({
          name: this.$t('params.param1'),
          data: []
        })
        this.chartOptions.series[idx].data.push(...temperature)
        idx++
      }
      if (this.node.isHumidity) {
        this.chartOptions.series.push({
          name: this.$t('params.param2'),
          data: []
        })
        this.chartOptions.series[idx].data.push(...humidity)
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
