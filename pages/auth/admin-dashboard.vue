  <template>
    <div class="flex bg-gray-50 font-inria min-h-screen">
      <!-- Sidebar with orange gradient - borders removed -->
      <aside :class="[
        'fixed top-0 left-0 z-40 w-64 h-full lg:h-screen bg-gradient-to-b from-orange400 to-orange300 text-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0'
      ]" aria-label="Sidebar">
        <div class="flex flex-col px-4 py-6 min-h-full">

          <!-- Profile Card - border removed -->
          <div class="flex flex-col items-center text-center mb-6 bg-white/10 rounded-xl p-5">
            <div class="relative">
              <img src="../../assets/image/user.png" class="w-24 h-24 mb-3 rounded-full border-4 border-white shadow-lg" alt="User Avatar">
              <span class="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <h2 class="text-xl font-epundaslab font-semibold text-white">
              {{ user?.firstname + ' ' + user?.lastname || "Guest" }}
            </h2>
            <span class="text-xs bg-black700/30 px-4 py-1.5 rounded-full mt-2 text-white font-inria">{{ user?.role || "No role" }}</span>
          </div>

          <!-- Divider - border removed, just a line -->
          <div class="relative my-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/20"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-3 bg-orange300 text-white text-xs font-inria">NAVIGATION</span>
            </div>
          </div>

          <!-- Navigation Menu -->
          <ul class="space-y-1 font-inria">
            <li v-for="item in menuItems" :key="item.name">
              <a href="#" @click.prevent="setActivePage(item)" :class="[
                'flex items-center p-3 rounded-lg group transition-all duration-200',
                activePage.name === item.name
                  ? 'bg-black700 text-white shadow-md'
                  : 'text-white hover:bg-orange200 hover:text-white'
              ]">
                <img :src="item.icon" class="w-5 h-5 mr-3 opacity-90 group-hover:opacity-100" alt="icon" />
                <span class="font-medium">{{ item.name }}</span>
                <span v-if="item.name === 'Dashboard'" class="ml-auto bg-orange200 text-black700 text-[10px] px-2 py-1 rounded-full">Home</span>
              </a>
            </li>

            <!-- Logout -->
            <li class="pt-4 mt-4 border-t border-white/20">
              <a href="#" @click.prevent="showLogout"
                class="flex items-center p-3 rounded-lg text-red-100 hover:bg-red-600/30 hover:text-white transition-all duration-200 group">
                <img src="../../assets/image/logout.png" class="w-5 h-5 mr-3 opacity-80 group-hover:opacity-100" alt="logout icon" />
                <span class="font-medium">Logout</span>
              </a>
            </li>
          </ul>

          <!-- System Info - border removed -->
          <div class="mt-auto pt-8">
            <div class="bg-black700/30 rounded-lg p-3">
              <p class="text-xs text-white text-center font-inria">CSU Grading System v2.0</p>
              <p class="text-[10px] text-orange100 text-center mt-1">A.Y. 2024-2025</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col lg:ml-64 min-h-screen transition-all duration-300 bg-gray-50">

        <!-- Top Navigation - border removed -->
        <nav class="bg-white sticky top-0 z-30 shadow-sm">
          <div class="flex justify-between items-center px-6 py-3">
            <div class="flex items-center gap-4">
              <button @click="toggleSidebar"
                class="lg:hidden p-2 text-black700 rounded-lg hover:bg-orange100 focus:outline-none focus:ring-2 focus:ring-orange400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path clip-rule="evenodd" fill-rule="evenodd"
                    d="M2 4.75h15v1.5H2v-1.5zm0 10.5h8v1.5H2v-1.5zM2 10h15v1.5H2V10z" />
                </svg>
              </button>
              <img src="../../assets/image/ceit-logo.png" class="h-14 w-auto" alt="Logo" />
              <div class="hidden md:block">
                <p class="font-epundaslab font-semibold text-black700">College of Engineering and Information Technology</p>
                <p class="text-xs text-gray-500 font-inria">Academic Records Management</p>
              </div>
            </div>

            <div class="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg">
              <div class="text-right">
                <p class="text-sm font-inria font-medium text-black700">{{ currentDate }}</p>
                <p class="text-[10px] text-gray-500 font-inria">System Date</p>
              </div>
              <div class="w-10 h-10 bg-orange400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {{ user?.firstname?.charAt(0) || 'A' }}{{ user?.lastname?.charAt(0) || 'U' }}
              </div>
            </div>
          </div>
        </nav>

        <!-- Main Content -->
        <main class="flex-1 p-6 lg:p-8 overflow-y-auto font-inria">

          <!-- Dashboard View -->
          <div v-if="activePage.name === 'Dashboard'" class="animate-fade-in space-y-8">

            <!-- Welcome Banner and Calendar Row -->
            <div class="flex flex-col xl:flex-row gap-6">

              <!-- Welcome Card - Updated with OBE Class Record text -->
              <div class="flex-1 bg-gradient-to-br from-orange400 to-orange300 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-center min-h-[250px]">
                <!-- Decorative elements -->
                <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div class="absolute bottom-0 left-0 w-60 h-60 bg-orange200/20 rounded-full blur-3xl"></div>
                
                <div class="relative z-10">
                  <div class="flex items-center gap-2 mb-4">
                    <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-inria">ADMIN DASHBOARD</span>
                    <span class="bg-green-500/30 px-3 py-1 rounded-full text-xs font-inria">ACTIVE</span>
                    <span class="bg-purple-500/30 px-3 py-1 rounded-full text-xs font-inria">OBE CLASS RECORD</span>
                  </div>
                  <h1 class="text-3xl md:text-4xl font-epundaslab font-bold mb-3">
                    Welcome, {{ user?.firstname || 'Admin' }}!
                  </h1>
                  <p class="text-white/90 text-lg font-inria leading-relaxed max-w-xl">
                    You have full control over the system. Manage users, monitor grade submissions, oversee system records, and track Outcome-Based Education (OBE) class performance from here.
                  </p>
                  
                  <!-- Quick Stats with OBE indicator -->
                  <div class="flex gap-4 mt-6">
                    <div class="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                      <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span class="text-sm font-inria">{{ masterlistStats.count }} Active Classes</span>
                    </div>
                    <div class="flex items-center gap-2 bg-purple-500/20 px-3 py-1.5 rounded-full">
                      <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span class="text-sm font-inria">OBE Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Calendar Card - border removed -->
              <div class="w-full xl:w-96 bg-white rounded-2xl shadow-md p-6">
                <div class="flex justify-between items-center mb-4">
                  <div>
                    <h3 class="font-epundaslab font-bold text-black700 text-lg">{{ currentMonth }} {{ currentYear }}</h3>
                    <p class="text-xs text-gray-500 font-inria mt-0.5">Academic Calendar</p>
                  </div>
                  <div class="bg-orange100 p-2.5 rounded-lg">
                    <svg class="w-5 h-5 text-orange400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <!-- Calendar Days -->
                <div class="grid grid-cols-7 text-center text-xs font-inria font-semibold text-gray-400 mb-2">
                  <span v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day">{{ day }}</span>
                </div>
                
                <!-- Calendar Dates -->
                <div class="grid grid-cols-7 text-center gap-1">
                  <span v-for="n in 31" :key="n" :class="[
                    'w-8 h-8 flex items-center justify-center rounded-lg mx-auto text-sm font-inria transition-all cursor-pointer',
                    n === currentDay 
                      ? 'bg-orange400 text-white shadow-md font-bold' 
                      : 'text-gray-600 hover:bg-orange100 hover:text-orange400'
                  ]">
                    {{ n }}
                  </span>
                </div>

                <!-- Today's date -->
                <div class="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 bg-orange400 rounded-full"></span>
                    <span class="text-sm font-inria text-gray-600">Today</span>
                  </div>
                  <span class="text-sm font-roboto font-semibold text-black700">{{ currentMonth }} {{ currentDay }}, {{ currentYear }}</span>
                </div>
              </div>
            </div>

            <!-- System Overview Section -->
            <div>
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h3 class="text-xl font-epundaslab font-bold text-black700 mb-1">System Overview</h3>
                  <p class="text-sm text-gray-500 font-inria">Real-time monitoring and statistics</p>
                </div>
                <button class="text-sm text-orange400 hover:text-orange300 font-inria font-medium flex items-center gap-1 bg-orange100 px-3 py-1.5 rounded-lg transition-all hover:bg-orange200">
                  View All Reports
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <!-- Total Classes Card - border removed -->
                <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all group">
                  <div class="flex items-start justify-between mb-4">
                    <div class="p-3.5 bg-orange100 rounded-lg group-hover:bg-orange200 transition-colors">
                      <img src="../../assets/image/grading-module.png" class="w-6 h-6" alt="icon">
                    </div>
                    <span class="text-xs bg-orange100 text-orange400 px-3 py-1.5 rounded-full font-inria font-medium">Total Active</span>
                  </div>
                  <p class="text-sm font-inria font-medium text-gray-500 mb-1">Total Classes in System</p>
                  <div class="flex items-end justify-between">
                    <h4 class="text-4xl font-epundaslab font-bold text-black700">{{ masterlistStats.count }}</h4>
                    <span class="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full font-inria">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      +12% this sem
                    </span>
                  </div>
                  <p class="text-xs text-gray-400 font-inria mt-3">All active masterlists across all instructors</p>
                </div>

                <!-- Latest Class Card - border removed -->
                <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                  <div class="flex items-start justify-between mb-4">
                    <div class="p-3.5 bg-purple-50 rounded-lg">
                      <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span class="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-inria font-medium">Latest Class</span>
                  </div>
                  
                  <p class="text-sm font-inria font-medium text-gray-500 mb-3">Latest Class Created</p>

                  <div v-if="masterlistStats.latest" class="space-y-3">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 bg-gradient-to-br from-orange400 to-orange300 rounded-lg flex items-center justify-center text-white font-epundaslab font-bold text-xl">
                        {{ masterlistStats.latest.subjcode.charAt(0) }}
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <h4 class="text-lg font-epundaslab font-bold text-black700">{{ masterlistStats.latest.subjcode }}</h4>
                          <span class="bg-orange100 text-orange400 text-xs px-2 py-1 rounded-lg font-inria font-medium">
                            Sec {{ masterlistStats.latest.section }}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="bg-gray-50 rounded-lg p-3 space-y-2">
                      <p class="text-sm text-gray-700 font-inria">
                        <span class="font-inria font-medium">Instructor:</span> 
                        {{ masterlistStats.latest.employee?.firstname }} {{ masterlistStats.latest.employee?.lastname }}
                      </p>
                      <p class="text-xs text-gray-500 font-inria flex items-center gap-2">
                        <span class="flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ masterlistStats.latest.sy }}
                        </span>
                        <span>•</span>
                        <span>{{ masterlistStats.latest.sem }} Sem</span>
                      </p>
                    </div>
                  </div>

                  <div v-else class="text-gray-400 italic font-inria text-center py-6 bg-gray-50 rounded-lg">
                    No activity found in the system
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity Section - border removed -->
            <div class="bg-white rounded-xl shadow-md p-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-epundaslab font-semibold text-black700">Recent System Activity</h4>
                <a href="#" class="text-sm text-orange400 hover:text-orange300 font-inria">View All</a>
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p class="text-sm text-gray-600 font-inria flex-1">New class <span class="font-roboto font-semibold">CS 101</span> was created</p>
                  <span class="text-xs text-gray-400 font-inria">2 mins ago</span>
                </div>
                <div class="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p class="text-sm text-gray-600 font-inria flex-1">Grades uploaded for <span class="font-roboto font-semibold">IT 201</span></p>
                  <span class="text-xs text-gray-400 font-inria">15 mins ago</span>
                </div>
                <div class="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p class="text-sm text-gray-600 font-inria flex-1">New user <span class="font-roboto font-semibold">John Doe</span> registered</p>
                  <span class="text-xs text-gray-400 font-inria">1 hour ago</span>
                </div>
                <div class="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p class="text-sm text-gray-600 font-inria flex-1">OBE Class Record <span class="font-roboto font-semibold">updated</span> for CS 301</p>
                  <span class="text-xs text-gray-400 font-inria">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Dynamic Component Loading -->
          <component v-else :is="activePage.component" :user="user" />

        </main>

        <!-- Footer - border removed -->
        <footer class="bg-white mt-auto">
          <div class="w-full max-w-full mx-auto p-4 md:py-6">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <img src="../../assets/image/ceit-logo.png" class="h-12" alt="Logo" />
                <div class="text-xs text-gray-500 font-inria">
                  <p class="font-roboto font-bold text-black700">Caraga State University Cabadbaran Campus</p>
                  <p class="flex items-center gap-1">
                    <svg class="w-3 h-3 text-orange400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                    T. Curato St., Cabadbaran, Philippines
                  </p>
                </div>
              </div>
              <ul class="flex flex-wrap items-center text-xs font-inria font-medium text-gray-500 gap-6">
                <li><a href="#" class="hover:text-orange400 transition-colors">About</a></li>
                <li><a href="#" class="hover:text-orange400 transition-colors">Privacy</a></li>
                <li><a href="#" class="hover:text-orange400 transition-colors">Contact</a></li>
                <li><a href="#" class="hover:text-orange400 transition-colors">Help</a></li>
              </ul>
            </div>
            <hr class="my-4 border-gray-200" />
            <span class="block text-xs text-gray-400 font-inria text-center">
              © 2024 Caraga State University - ICT Center. All Rights Reserved. | Version 2.0.1
            </span>
          </div>
        </footer>

      </div>

      <!-- Logout Modal - border removed -->
      <div v-if="showLogoutModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-2xl p-6 w-80 transform transition-all scale-100"
          :class="modalAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-roboto font-bold text-black700">Sign Out?</h2>
              <p class="text-sm text-gray-500 font-inria">Are you sure you want to end your session?</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="cancelLogout"
              class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-inria font-medium transition-colors">
              Cancel
            </button>
            <button @click="confirmLogout"
              class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-inria font-medium shadow-md transition-colors flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <!-- Scroll to Top Button -->
      <button v-show="showScrollTop" @click="scrollToTop"
        class="fixed bottom-6 right-6 bg-orange400 hover:bg-orange300 text-white p-3.5 rounded-lg shadow-lg transition-all z-50 hover:scale-110">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  </template>



  <script>
import User from "@/components/user/user.vue"
import Profile from "@/components/profile/profile.vue"
import GradingModule from "@/components/grading-module/grading-page.vue"
import ImportCSV from "@/components/upload/import-csv.vue"
import StudentMonitoring from "@/components/student-monitoring/student-monitoring.vue"
import ClassRecord from "@/components/class-record/class-record.vue"

export default {
  middleware: "auth",
  data() {
    return {
      user: null,
      sidebarOpen: false,
      showLogoutModal: false,
      modalAnimation: false,
      showScrollTop: false,
      activePage: { name: "Dashboard", component: null },
      menuItems: [
        { name: "Dashboard", component: null, icon: require("../../assets/image/dashboard-sidebar.png") },
        { name: "Grading Module", component: GradingModule, icon: require("../../assets/image/grading-module.png") },
        { name: "Student Monitoring", component: StudentMonitoring, icon: require("../../assets/image/student-monitoring.png") },
        { name: "User", component: User, icon: require("../../assets/image/multiple-users-silhouette.png") },
        { name: "Profile", component: Profile, icon: require("../../assets/image/user-sidebar.png") },
        { name: "Import CSV", component: ImportCSV, icon: require("../../assets/image/import.png") },
      ],
      masterlistStats: {
        count: 0,
        latest: null
      }
    }
  },
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
      const res = await this.$axios.get("/auth/user", { withCredentials: true })
      this.user = res.data
      this.fetchDashboardStats()
    } catch (err) {
      console.error("Failed to fetch user:", err)
    }
    window.addEventListener("scroll", this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  },
  methods: {
    async fetchDashboardStats() {
      try {
        const res = await this.$axios.get("/masterlist/all", { withCredentials: true })
        const lists = res.data

        const uniqueClasses = new Set()
        lists.forEach(item => {
          if (item.subjcode && item.section) {
            uniqueClasses.add(`${item.subjcode}-${item.section}`)
          }
        })

        this.masterlistStats.count = uniqueClasses.size

        if (lists.length > 0) {
          lists.sort((a, b) => b.masterlist_id - a.masterlist_id)
          this.masterlistStats.latest = lists[0]
        }
      } catch (e) {
        console.error("Failed to load stats", e)
      }
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    setActivePage(item) {
      this.activePage = item
      this.sidebarOpen = false
      if (item.name === 'Dashboard') {
        this.fetchDashboardStats()
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
        await this.$axios.post("/auth/logout", {}, { withCredentials: true })
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