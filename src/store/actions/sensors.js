const fetchSensors = async (state) => {
  return new Promise((s, j) => {
    fetch(process.env.VUE_APP_HOST + '/server/node/', {
      headers: new Headers({
        'Authorization': 'Bearer '+state.getters.getAccessToken
      })
    })
      .then(res => res.json())
      .then(sensorsList => {
        if (!sensorsList) {
          j('failed to load nodes')
        }
        sensorsList.sort((a, b) => {
          return ('' + a.uid).localeCompare(b.uid)
        })
        state.commit('updateSensors', sensorsList)
        s()
      })
      .catch(e => j(e))
  })
}
export default fetchSensors;
