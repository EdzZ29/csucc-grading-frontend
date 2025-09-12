<template>

  <div class="flex">
        <!-- <button @click="activeTab = 'dashboard'" class="bg-green-700 p-2">Dashboard</button>
        <button @click="activeTab = 'gradingModule'" class="bg-green-700 p-2">Grading Module</button>

        <component :is="activeTab"/> -->


        <aside
  id="default-sidebar"
  class="fixed top-0 left-0 z-40 w-64 border-r h-screen transition-transform -translate-x-full sm:translate-x-0 bg-white"
  aria-label="Sidebar"
>
  <div class="flex items-center justify-center h-20 border-b border-gray-200 mb-12">
    <img src="../assets/image/header-logo.png" alt="Csucc Logo" class="h-12" />
  </div>

  <div class="h-full px-3 py-4 overflow-y-auto font-inria">
    <ul class="space-y-2 font-bold">
      <li>
        <a
          @click="activeTab = 'dashboard'"
          :class="[
            'cursor-pointer flex items-center p-2 group',
            activeTab === 'dashboard'
              ? 'bg-green-700 text-white transition'
              : 'text-dark hover:bg-green-700 hover:text-white transition'
          ]"
        >
          <span class="ms-3">Dashboard</span>
        </a>
      </li>

      <li>
        <a
          @click="activeTab = 'gradingModule'"
          :class="[
            'cursor-pointer flex items-center p-2 group',
            activeTab === 'gradingModule'
              ? 'bg-green-700 text-white transition'
              : 'text-dark hover:bg-green-700 hover:text-white transition'
          ]"
        >
          <span class="flex-1 ms-3 whitespace-nowrap">Grading Module</span>
        </a>
      </li>

      <li>
        <a
          @click="activeTab = 'studentMonitoring'"
          :class="[
            'cursor-pointer flex items-center p-2 group',
            activeTab === 'studentMonitoring'
              ? 'bg-green-700 text-white transition'
              : 'text-dark hover:bg-green-700 hover:text-white transition'
          ]"
        >
          <span class="flex-1 ms-3 whitespace-nowrap">Student Monitoring</span>
        </a>
      </li>

      <li>
        <a
          @click="activeTab = 'classRecord'"
          :class="[
            'cursor-pointer flex items-center p-2 group',
            activeTab === 'classRecord'
              ? 'bg-green-700 text-white transition'
              : 'text-dark hover:bg-green-700 hover:text-white transition'
          ]"
        >
          <span class="flex-1 ms-3 whitespace-nowrap">Class Record</span>
        </a>
      </li>

      <li>
        <a
          @click="activeTab = 'importCsv'"
          :class="[
            'cursor-pointer flex items-center p-2 group',
            activeTab === 'importCsv'
              ? 'bg-green-700 text-white transition'
              : 'text-dark hover:bg-green-700 hover:text-white transition'
          ]"
        >
          <span class="flex-1 ms-3 whitespace-nowrap">Import CSV</span>
        </a>
      </li>


      <li>
        <a
          @click="activeTab = 'profile'"
          :class="[
            'cursor-pointer flex items-center p-2 group',
            activeTab === 'profile'
              ? 'bg-green-700 text-white transition'
              : 'text-dark hover:bg-green-700 hover:text-white transition'
          ]"
        >
          <span class="flex-1 ms-3 whitespace-nowrap">Users</span>
        </a>
      </li>

      

      <li>
        <a class="transition"
          @click="showLogoutModal = true"
          :class="[
            'cursor-pointer flex items-center p-2 group text-red-600',
            'hover:bg-red-600 hover:text-white transition'
          ]"
        >
          <span class="flex-1 ms-3 whitespace-nowrap">Logout</span>
        </a>
      </li>
    </ul>
  </div>
</aside>


<!-- Logout Confirmation Modal -->
  <div
    v-if="showLogoutModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition"
  >
    <div class="bg-white p-6 shadow-lg w-80 text-center">
      <h2 class="text-lg font-inria mb-8">Are you sure you want to logout?</h2>
      <div class="flex justify-center gap-4">
        <button
          @click="confirmLogout"
          class="px-6 py-2 bg-red-600 text-white  hover:bg-red-700"
        >
          Yes
        </button>
        <button
          @click="showLogoutModal = false"
          class="px-6 py-2 bg-green-700 text-white  hover:bg-gray-400"
        >
          No
        </button>
      </div>
    </div>
  </div>


    <component :is="activeTab"/>

    </div>
    
</template>

<script>
import dashboard from '../components/dashboard.vue';
import gradingModule from '../components/grading-module.vue';
import studentMonitoring from '../components/student-monitoring.vue';
import classRecord from '../components/class-record.vue';
import profile from '../components/profile.vue';



export default {

  middleware: 'auth',
  
  components: { dashboard },
        name: 'Main',
        comments: {
            dashboard,
            gradingModule,
            studentMonitoring,
            classRecord,
            profile
        },
        data() {
            return {
                activeTab: 'dashboard',
                showLogoutModal: false
            }
        },


    methods: {
      
      async logout() {
        try {
          await this.$axios.post('/logout', {}, { withCredentials: true })
          console.log("User logged out")
          this.$router.push('/login')
        } catch (err) {
          console.error('Logout failed:', err)
        }
      },


      confirmLogout() {
        this.logout()
        this.showLogoutModal = false
      }

    }
}
</script>