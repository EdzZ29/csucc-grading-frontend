<template>
  <div class="flex bg-gray-100">
    <!-- Sidebar -->
    <aside :class="[
      'fixed top-0 left-0 z-40 w-64 h-full lg:h-screen bg-green-900 text-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out overflow-y-auto',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0'
    ]" aria-label="Sidebar">
      <div class="flex flex-col px-3 py-8 min-h-full">

        <!-- User Info Section -->
        <div class="flex flex-col items-center text-center mb-6">
          <img src="../../assets/image/user.png" class="w-20 h-20 mb-2" alt="">
          <h2 class="text-xl font-semibold text-white font-epundaslab">
            {{ user?.firstname + ' ' + user?.lastname || "Guest" }}
          </h2>
          <span class="text-sm text-gray-200 font-inria">{{ user?.role || "No role" }}</span>
        </div>
        
        <div class="border-b border-gray-500 mb-5"></div>

        <!-- Menu Items -->
        <ul class="space-y-3 text-sm font-small">
          <li v-for="item in menuItems" :key="item.name">
            <a href="#" @click.prevent="setActivePage(item)" :class="[
              'flex items-center p-2 rounded-lg group space-x-3',
              activePage.name === item.name
                ? 'bg-green-700 text-white'
                : 'text-white hover:bg-green-700'
            ]">
              <!-- Icon beside text -->
              <img :src="item.icon" class="w-4 h-4" alt="icon" />
              <span>{{ item.name }}</span>
            </a>
          </li>

          <div class="border-b border-gray-500"></div>

          <li>
            <a href="#" @click.prevent="showLogout"
              class="flex items-center space-x-3 text-md text-white hover:text-white px-2 py-2 rounded-lg hover:bg-red-800 transition">
              <img src="../../assets/image/logout.png" class="w-4 h-4 text-white" alt="logout icon" />
              <span>Logout</span>
            </a>
          </li>
        </ul>

      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col lg:ml-64 min-h-screen">

      <!-- Navbar -->
      <nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 mb-4">
        <div class="flex justify-between items-center p-4">
          <img src="../../assets/image/header-logo.png" class="h-14" alt="Logo" />
          <div class="flex items-center space-x-4">
            <button @click="toggleSidebar"
              class="md:inline-flex lg:hidden items-center p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
              <svg :class="{ 'rotate-90': sidebarOpen }" class="w-6 h-6 transition-transform duration-300"
                fill="currentColor" viewBox="0 0 20 20">
                <path clip-rule="evenodd" fill-rule="evenodd"
                  d="M2 4.75h15v1.5H2v-1.5zm0 10.5h8v1.5H2v-1.5zM2 10h15v1.5H2V10z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <!-- Dynamic Content -->
      <main class="flex-1 p-4">
        <component :is="activePage.component" :user="user" />
      </main>

      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-900 rounded-lg shadow-sm mt-20">
        <div class="w-full p-4 md:py-8">
          <div class="sm:flex sm:items-center sm:justify-between">
            <img src="../../assets/image/header-logo.png" class="h-14 mb-4 sm:mb-0" alt="Logo" />
            <ul class="flex flex-wrap text-sm font-medium text-gray-500 dark:text-gray-400">
              <li><a href="#" class="hover:underline me-4 md:me-6">About</a></li>
              <li><a href="#" class="hover:underline me-4 md:me-6">Privacy Policy</a></li>
              <li><a href="#" class="hover:underline me-4 md:me-6">Licensing</a></li>
              <li><a href="#" class="hover:underline">Contact</a></li>
            </ul>
          </div>

          <hr class="my-6 border-gray-200 dark:border-gray-700" />

          <div class="text-center space-y-2">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              2024 All Rights Reserved - Caraga State University<br />
              Ampayon, Butuan City, Caraga Region, 8600 Philippines<br />
              Powered by: CSU - ICT Center, CSU - Main Campus
            </p>
          </div>
        </div>
      </footer>

    </div>

    <!-- Logout Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80 transform transition-transform duration-300"
        :class="modalAnimation ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Logout</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to logout?</p>
        <div class="flex justify-end space-x-3">
          <button @click="cancelLogout"
            class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
            Cancel
          </button>
          <button @click="confirmLogout" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Scroll To Top -->
    <button v-show="showScrollTop" @click="scrollToTop"
      class="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition z-50">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<script>
import axios from "axios"
import Dashboard from "@/components/dashboard/dashboard.vue"
import User from "@/components/user/user.vue"
import Profile from "@/components/profile/profile.vue"
import GradingModule from "@/components/grading-module/grading-module.vue"
import ImportCSV from "@/components/import-csv.vue"
import StudentMonitoring from "@/components/student-monitoring/student-monitoring.vue"

export default {
  data() {
    return {
      user: null,
      sidebarOpen: false,
      showLogoutModal: false,
      modalAnimation: false,
      showScrollTop: false,
      activePage: { name: "Dashboard", component: Dashboard },
      menuItems: [
        { name: "Dashboard", component: Dashboard, icon: require("../../assets/image/dashboard-sidebar.png") },
        { name: "Grading Module", component: GradingModule, icon: require("../../assets/image/grading-module.png") },
        { name: "Student Monitoring", component: StudentMonitoring, icon: require("../../assets/image/student-monitoring.png") },
        { name: "Class Record", icon: require("../../assets/image/grading-module.png") },
        { name: "User", component: User, icon: require("../../assets/image/multiple-users-silhouette.png") },
        { name: "Profile", component: Profile, icon: require("../../assets/image/user-sidebar.png") },
        { name: "Import CSV", component: ImportCSV, icon: require("../../assets/image/import.png") }
      ]
    }
  },
  async mounted() {
    try {
      const res = await axios.get("http://localhost:9000/api/auth/user", { withCredentials: true })
      this.user = res.data
    } catch (err) {
      console.error("Failed to fetch user:", err)
    }
    window.addEventListener("scroll", this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    setActivePage(item) {
      if (item.component) {
        this.activePage = item
      }
      this.sidebarOpen = false
    },
    showLogout() {
      this.showLogoutModal = true
      setTimeout(() => (this.modalAnimation = true), 10)
    },
    cancelLogout() {
      this.modalAnimation = false
      setTimeout(() => (this.showLogoutModal = false), 300)
    },
    async confirmLogout() {
      try {
        await axios.post("http://localhost:9000/api/auth/logout", {}, { withCredentials: true })
        this.user = null
        window.location.href = "/login"
      } catch (err) {
        console.error("Logout failed:", err)
      }
    },
    handleScroll() {
      this.showScrollTop = window.scrollY > 200
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }
}
</script>
