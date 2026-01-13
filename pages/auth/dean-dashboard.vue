<template>
  <div class="flex bg-gray-100 font-sans min-h-screen">
    <aside :class="[
      'fixed top-0 left-0 z-40 w-64 h-full lg:h-screen bg-green-900 text-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out overflow-y-auto',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0'
    ]" aria-label="Sidebar">
      <div class="flex flex-col px-3 py-8 min-h-full">

        <div class="flex flex-col items-center text-center mb-6">
          <img src="../../assets/image/user.png" class="w-20 h-20 mb-2 rounded-full border-2 border-green-700 p-1"
            alt="User Avatar">
          <h2 class="text-xl font-semibold text-white font-epundaslab">
            {{ user?.firstname + ' ' + user?.lastname || "Guest" }}
          </h2>
          <span class="text-sm text-green-200 font-inria uppercase tracking-wider">{{ user?.role || "No role" }}</span>
        </div>

        <div class="border-b border-green-800 mb-5"></div>

        <ul class="space-y-2 text-sm font-medium">
          <li v-for="item in menuItems" :key="item.name">
            <a href="#" @click.prevent="setActivePage(item)" :class="[
              'flex items-center p-3 rounded-lg group transition-all duration-200',
              activePage.name === item.name
                ? 'bg-green-700 text-white shadow-md'
                : 'text-green-100 hover:bg-green-800 hover:text-white'
            ]">
              <img :src="item.icon" class="w-5 h-5 mr-3 opacity-90" alt="icon" />
              <span>{{ item.name }}</span>
            </a>
          </li>

          <div class="my-4 border-b border-green-800"></div>

          <li>
            <a href="#" @click.prevent="showLogout"
              class="flex items-center p-3 rounded-lg text-red-200 hover:bg-red-900 hover:text-white transition-all duration-200 group">
              <img src="../../assets/image/logout.png" class="w-5 h-5 mr-3 opacity-80 group-hover:opacity-100"
                alt="logout icon" />
              <span>Logout</span>
            </a>
          </li>
        </ul>

      </div>
    </aside>

    <div class="flex-1 flex flex-col lg:ml-64 min-h-screen transition-all duration-300">

      <nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
        <div class="flex justify-between items-center px-6 py-3">
          <div class="flex items-center gap-4">
            <button @click="toggleSidebar"
              class="lg:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path clip-rule="evenodd" fill-rule="evenodd"
                  d="M2 4.75h15v1.5H2v-1.5zm0 10.5h8v1.5H2v-1.5zM2 10h15v1.5H2V10z" />
              </svg>
            </button>
            <img src="../../assets/image/header-logo.png" class="h-12 w-auto" alt="Logo" />
          </div>

          <div class="text-sm text-gray-500 font-medium">
            {{ currentDate }}
          </div>
        </div>
      </nav>

      <main class="flex-1 p-6 overflow-y-auto">

        <div v-if="activePage.name === 'Dashboard'" class="animate-fade-in space-y-8">

          <div class="flex flex-col xl:flex-row gap-6">

            <div
              class="flex-1 bg-gradient-to-r from-green-900 to-green-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-center min-h-[250px]">
              <div class="relative z-10 max-w-lg">
                <h1 class="text-3xl md:text-4xl font-bold font-epundaslab mb-3 leading-tight">
                  Welcome, Dean! 🎓
                </h1>
                <p class="text-green-100 text-lg leading-relaxed">
                  Monitor academic performance, track enrollment statistics, and oversee faculty masterlists.
                </p>
              </div>
              <div
                class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none">
              </div>
            </div>

            <div class="w-full xl:w-96 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-gray-800 text-lg">{{ currentMonth }} {{ currentYear }}</h3>
              </div>
              <div class="grid grid-cols-7 text-center text-xs text-gray-400 mb-2 font-bold uppercase tracking-wide">
                <span v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day">{{ day }}</span>
              </div>
              <div class="grid grid-cols-7 text-center text-sm gap-y-3">
                <span v-for="n in 31" :key="n" :class="[
                  'w-8 h-8 flex items-center justify-center rounded-full mx-auto cursor-pointer transition-colors',
                  n === currentDay ? 'bg-green-800 text-white shadow-md font-bold' : 'text-gray-600 hover:bg-gray-100'
                ]">
                  {{ n }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-5 font-epundaslab border-l-4 border-green-800 pl-4">
              Academic Overview
            </h3>

            <div class="grid grid-cols-1 gap-6">

              <div
                class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group">
                <div>
                  <p class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Masterlists (Subjects)
                  </p>
                  <h4 class="text-5xl font-bold text-green-900 group-hover:text-green-700 transition-colors">{{
                    masterlistsCount }}</h4>
                  <p class="text-sm text-gray-500 mt-2">Active class records in the system</p>
                </div>
                <div
                  class="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <img src="../../assets/image/grading-module.png" class="w-10 h-10 opacity-80" alt="icon">
                </div>
              </div>

            </div>
          </div>

        </div>

        <component v-else :is="activePage.component" :user="user" />

      </main>

      <footer class="bg-white border-t border-gray-200 dark:bg-gray-900 mt-auto">
        <div class="w-full max-w-screen-xl mx-auto p-4 md:py-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <img src="../../assets/image/header-logo.png" class="h-10" alt="Logo" />
              <div class="text-xs text-gray-500">
                <p class="font-bold text-gray-700">Caraga State University</p>
                <p>Ampayon, Butuan City</p>
              </div>
            </div>
            <ul class="flex flex-wrap items-center text-xs font-medium text-gray-500 dark:text-gray-400 gap-4">
              <li><a href="#" class="hover:underline">About</a></li>
              <li><a href="#" class="hover:underline">Privacy Policy</a></li>
              <li><a href="#" class="hover:underline">Contact</a></li>
            </ul>
          </div>
          <hr class="my-4 border-gray-200 dark:border-gray-700" />
          <span class="block text-xs text-gray-400 text-center">
            © 2024 Caraga State University - ICT Center. All Rights Reserved.
          </span>
        </div>
      </footer>

    </div>

    <div v-if="showLogoutModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-80 transform transition-all scale-100"
        :class="modalAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Sign Out?</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to end your session?</p>
        <div class="flex justify-end space-x-3">
          <button @click="cancelLogout"
            class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors">
            Cancel
          </button>
          <button @click="confirmLogout"
            class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium shadow-md transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>

    <button v-show="showScrollTop" @click="scrollToTop"
      class="fixed bottom-6 right-6 bg-green-800 hover:bg-green-900 text-white p-3 rounded-full shadow-lg transition-all z-50 transform hover:scale-110">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<script>
import axios from "axios"
import Profile from "@/components/profile/profile.vue"
import StudentMonitoring from "@/components/student-monitoring/student-monitoring.vue"

export default {
  middleware: 'auth',
  data() {
    return {
      user: null,
      sidebarOpen: false,
      showLogoutModal: false,
      modalAnimation: false,
      showScrollTop: false,
      activePage: { name: "Dashboard", component: null }, // Dashboard handled in template
      menuItems: [
        { name: "Dashboard", component: null, icon: require("../../assets/image/dashboard-sidebar.png") },
        { name: "Student Monitoring", component: StudentMonitoring, icon: require("../../assets/image/student-monitoring.png") },
        { name: "Profile", component: Profile, icon: require("../../assets/image/user-sidebar.png") },
      ],
      masterlistsCount: 0
    }
  },
  // ✅ FIXED: Restored Computed Properties for Calendar logic
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    currentMonth() {
      return new Date().toLocaleDateString('en-US', { month: 'long' });
    },
    currentYear() {
      return new Date().getFullYear();
    },
    currentDay() {
      return new Date().getDate();
    }
  },
  async mounted() {
    try {
      const res = await axios.get("http://localhost:9000/api/auth/user", { withCredentials: true })
      this.user = res.data
      this.fetchStats();
    } catch (err) {
      console.error("Failed to fetch user:", err)
    }
    window.addEventListener("scroll", this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  },
  methods: {
    async fetchStats() {
      try {
        // Fetch unique masterlist count using the new endpoint
        const res = await axios.get("http://localhost:9000/api/masterlist/count/unique-subjects", { withCredentials: true });
        this.masterlistsCount = res.data.count;
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      }
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    setActivePage(item) {
      this.activePage = item;
      this.sidebarOpen = false;
      if (item.name === 'Dashboard') {
        this.fetchStats();
      }
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
        this.$store.dispatch('logout')
        this.user = null
        window.location.href = "/"
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

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>