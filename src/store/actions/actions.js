import login from './login'
import register from './register'
import verify from './verify'
import fetchSensors from './sensors'
import logout from './logout'
import addNode from './addNode'
import modifyNode from './modifyNode'
import getArchived from './getArchivedNodes'
import changeOwner from './changeOwner'
import archiveNode from './archiveNode'
import unarchiveNode from './unarchiveNode'
import deleteNode from './deleteNode'
import fetchTrend from './fetchTrend'
import fetchNode from './fetchNode'
import fetchSetpoint from './fetchSetpoints'
import fetchStats from './fetchStats'
import fetchProfile from './fetchProfile'
import sendResetLink from './sendResetLink'
import resetPassword from './resetPassword'
import deleteUser from './deleteUser'
import fetchLogs from './fetchLogs'
import createdUsers from './createdUsers'
import getAllBackups from './getAllBackups'
import createBackup from './createBackup'
import deleteBackup from './deleteBackup'

const updateSensors = (state, newSensorList) => {
  state.commit('updateSensors', newSensorList)
}
const setToken = (state, token) => {
  state.commit('setToken', token)
}
const setLoggedIn = (state, status_) => {
  state.commit('setLoggedIn', status_)
}
const setDesignation = (state, des) => {
  state.commit('setDesignation', des)
}
const purgeToken = (state) => {
  state.commit('purgeToken')
}

export default  {
  updateSensors,
  setToken,
  purgeToken,
  setLoggedIn,
  setDesignation,
  login,
  register,
  verify,
  fetchSensors,
  logout,
  addNode,
  modifyNode,
  changeOwner,
  getArchived,
  archiveNode,
  unarchiveNode,
  deleteNode,
  fetchTrend,
  fetchNode,
  sendResetLink,
  fetchProfile,
  fetchSetpoint,
  fetchStats,
  fetchLogs,
  deleteUser,
  createdUsers,
  resetPassword,
  getAllBackups,
  createBackup,
  deleteBackup
}
