import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions/actions'
import createPersistedState from 'vuex-persistedstate'
import { 
  getJWT,
  setJWT,
  purgeJWT,
  getLocalDesignation,
  setLocalDesignation,
  purgeLocalDesignation
} from '@/common/jwt.service.js'
import { designationArray } from '../common/designation'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sensors: [],
    accessToken: getJWT(),
    loggedIn: !!getJWT(),
    designation: getLocalDesignation(),
    loading: false,
    faulties: Array()
  },
  mutations: {
    loaded(state) {
      state.loading = false
    },
    loading(state) {
      state.loading = true
    },
    updateSensors(state, newSensorList) {
      state.sensors = newSensorList
    },
    setToken(state, token) {
      setJWT(token)
      state.accessToken = token
    },
    setLoggedIn(state, status_) {
      state.loggedIn = status_
    },
    setDesignation(state, des) {
      state.designation = des
      setLocalDesignation(des)
    },
    purgeToken(state) {
      state.accessToken = null
      purgeJWT()
    },
    purgeDesignation(state) {
      state.designation = null
      purgeLocalDesignation()
    },
    setFaulties(state, newFaulties) {
      state.faulties.push(...newFaulties)
    }
  },
  actions: actions,
  modules: {
  },
  getters: {
    getSensors: state => state.sensors,
    getAccessToken: state => state.accessToken,
    getDesignation: state => state.designation,
    getLogInStatus: state => state.loggedIn,
    isLoading: state => state.loading,
    getPrivilege: state => designationArray.indexOf(state.designation),
    getFaulties: state => state.faulties,
    availableParameters: () => ['Voltage', 'Current', 'Energy']

  },
  plugins: [createPersistedState({ storage: window.sessionStorage })]
})
