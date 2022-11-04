const fetchStats = async (state, {uid}) => {
  return new Promise( (resolve, reject) => {
    console.log(uid)
    fetch(process.env.VUE_APP_HOST + `/server/stats/${uid}`)
    // fetch(`/analyseServer/${uid}`)
      .then(res => {
        return res.json()
      })
      .then(data => {
        resolve(data)
      })
      .catch(e => {
        reject(e)
      })
  })
}

export default fetchStats
