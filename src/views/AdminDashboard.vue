<template>
  <div v-if="designation === 'admin' || designation === 'superadmin'" >
    <div class="accordion" role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-1 variant="info">Backup Settings</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              <h4>Backup</h4>
              <div v-if="backups.length > 0">
                <b-card class="mb-1" v-for="(backup) in backups" :key="backup">
                  <div class="row">
                    <div class="col-md-6">
                      <a :href="getLink(backup)" target="_blank">
                        <strong>{{ (backup) }}</strong>
                      </a>
                    </div>
                    <div class="col-md-6">
                      <DeleteIcon @click="deleteBackup(backup)" />
                    </div>
                  </div>
                </b-card>
              </div>
              <div v-else>
                There are no current backups
              </div>
            </b-card-text>
          </b-card-body>
          <b-button class="mb-2" @click="createBackup()">Backup now</b-button>
        </b-collapse>
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-2 variant="info">Archived Nodes</b-button>
        </b-card-header>
        <b-collapse class="container" id="accordion-2" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              <h4>Archived nodes Setings</h4>
              <div class="scrollable" v-if="nodes.length > 0" v-bar>
                <b-card class="mb-1" v-for="(node, idx) in nodes" :key="node._id">
                  <div class="row">
                    <div class="col-md-2">
                      <strong>{{ node.uid }}</strong>
                    </div>
                    <div class="col-md-2">
                      <strong>{{ node.user }}</strong>
                    </div>
                    <div class="col-md-3">
                      <b-button @click="restoreNode(node.uid)" variant="info" class="mr-2">Restore <RestoreIcon /></b-button>
                      <b-button @click="deleteNode(node.uid)" variant="danger">Delete <DeleteIcon /></b-button>
                    </div>
                    <div class="col-md-3">
                      <div>
                        <b-select :options="users"
                         v-model.trim="attrUser[idx]"
                         value-field="username"
                         text-field="username"
                         />
                      </div>
                    </div>
                    <div class="col-md-1">
                      <b-button @click="changeOwner(node.uid, attrUser[idx])" variant="secondary">Save</b-button>
                    </div>
                  </div>
                </b-card>
              </div>
              <div v-else>
                There are no archived nodes.
              </div>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
  <div v-else>
    <h3>You are not authorised to see these logs.</h3>
  </div>
</template>

<script>
// import DownloadIcon from 'vue-material-design-icons/Download.vue'
import RestoreIcon from 'vue-material-design-icons/Restore.vue'
import DeleteIcon from 'vue-material-design-icons/Delete.vue'

import { mapGetters } from 'vuex'
export default {
  name: 'Logs',
  data() {
    return {
      backups: [],
      nodes: [],
      attrUser: [],
      users: []
    }
  },
  components: {
    RestoreIcon,
    DeleteIcon
  },
  computed: {
    ...mapGetters({
      designation: 'getDesignation'
    }),
  },
  methods: {
    agoCalc(time) {
      const dt = Date.parse(time)
      const dateDiff_hrs = Math.floor((new Date() - dt) / 1000 / 3600 ) ;
      if (dateDiff_hrs > 24) {
        const days = Math.floor(dateDiff_hrs / 24)
        return days + " days"
      }
      if (dateDiff_hrs === 0) {
        return "few seconds"
      }
      return dateDiff_hrs + " hrs"
    },
    async changeOwner(uid, newOwner) {
      this.$bvModal.msgBoxConfirm(`Are you sure you want to change ${uid} to ${newOwner}`)
        .then((confirmation) => {
          if (confirmation) {
            this.$store.dispatch('changeOwner', {
              uid: uid,
              newOwner: newOwner
            })
              .then(() => {
                this.$bvToast.toast('Saved')
                this.loadAll()
              })
              .catch(e => this.$bvToast.toast(e))
          } else {
            this.$bvToast.toast('Aborted owner change operation')
          }
        })
    },
    getLink(str) {
      return `${process.env.VUE_APP_HOST}/server/backup/${str}`
    },
    async loadAll() {
      this.loadArchivedNodes()
      this.fetchUsers()
    },
    async loadBackups() {
      this.$store.dispatch('getAllBackups')
        .then(backups => {
          this.backups = backups
        })
    },
    async loadArchivedNodes() {
      this.$store.dispatch('getArchived')
        .then(nodes => {
          this.nodes = nodes
        })
    },
    async createBackup() {
      this.$store.dispatch('createBackup')
        .then(msg => {
          if (msg === 'ok') {
            this.$bvToast.toast('Backup started')
            this.loadBackups()
          } else {
            this.$bvToast.toast('There was a problem creating backup')
          }
        })
    },
    async deleteBackup(backup) {
      this.$bvModal.msgBoxConfirm(`Are you sure you want to delete the backup?`)
        .then(confirmation => {
          if(confirmation) {
            this.$store.dispatch('deleteBackup', backup)
              .then(msg => {
                if (msg === 'deleted') {
                  this.$bvToast.toast('Backup deleted')
                  this.loadBackups()
                } else {
                  this.$bvToast.toast('There was a problem deleting backup')
                }
              })
          } else {
            this.$bvToast.toast('Aborted')
          }
        })
    },
    async fetchUsers() {
      this.$store.dispatch('createdUsers')
        .then((users) => {
          let rUsers = []
          rUsers.push({ username: 'Change owner' })
          rUsers.push({ username: 'master' })
          rUsers.push(...users)
          this.users = rUsers
          this.attrUser = Array(this.nodes.length).fill('Change owner')
        })
        .catch((e) => {
        this.$bvToast.toast('Could not load users ' + e.message)
      })
    },
    async restoreNode(uid) {
      this.$bvModal.msgBoxConfirm(`Are you sure you want to retore the node: ${uid}?`)
        .then(confirmation => {
          if(confirmation) {
            this.$store.dispatch('unarchiveNode', uid)
              .then(() => {
                this.$bvToast.toast(`Node ${uid} has been restored.`)
                this.loadAll()
              })
              .catch((err) => {
                this.$bvToast(err)
              })
          } else {
            this.$bvToast.toast('Node restoration aborted')
          }
        })
    },
    async deleteNode(uid) {
      this.$bvModal.msgBoxConfirm(`Are you sure you want to delete the node: ${uid}?`)
        .then(confirmation => {
          if(confirmation) {
            this.$store.dispatch('deleteNode', uid)
              .then(() => {
                this.$bvToast.toast('Node will be deleted')
                this.loadAll()
              })
          } else {
            this.$bvToast.toast('Deletion aborted')
          }
        })
    },
  },
  mounted() {
    this.loadAll()
    this.loadBackups()
  }
}
</script>

<style>

.b-toast .toast {
  background: #FFFFFFFF;
}

.card {
  width: 100%;
}

.scrollable {
  min-height: 100px;

}

</style>
