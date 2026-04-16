<template>
  <div class="flex bg-gray-50 font-inria min-h-screen">
    <aside :class="[
      'fixed top-0 left-0 z-40 w-64 h-full lg:h-screen bg-white border-r-2 border-gray-300 text-black700 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0'
    ]" aria-label="Sidebar">
      <div class="flex flex-col px-4 py-6 min-h-full">
        <div class="flex flex-col items-center text-center mb-6 bg-white/10 rounded-xl p-5">
          <div class="relative">
            <img :src="profilePicture || require('../../assets/image/user.png')" class="w-24 h-24 mb-3 rounded-full border-4 border-white shadow-lg object-cover" alt="User Avatar">
            <span class="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <h2 class="text-xl font-epundaslab font-semibold text-black700">
            {{ user?.firstname + ' ' + user?.lastname || "Guest" }}
          </h2>
          <span class="text-xs bg-black700/30 px-4 py-1.5 rounded-full mt-2 text-black700 font-inria">{{ user?.role || "No role" }}</span>
        </div>
        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/20"></div>
          </div>
          <div class="relative flex justify-center">
            <span class="px-3 bg-orange300 text-white text-xs font-inria">NAVIGATION</span>
          </div>
        </div>
        <ul class="space-y-1 font-inria">
          <li v-for="item in menuItems" :key="item.name">
            <a href="#" @click.prevent="setActivePage(item)" :class="[
              'flex items-center p-3 rounded-lg group transition-all duration-200',
              activePage.name === item.name
                ? 'bg-black700 text-white shadow-md'
                : 'text-black700 hover:bg-orange400 hover:text-white'
            ]">
              <img :src="item.icon" class="nav-icon w-5 h-5 mr-3" alt="icon" />
              <span class="font-medium">{{ item.name }}</span>
            </a>
          </li>
          <li class="pt-4 mt-4 border-t border-white/20">
            <a href="#" @click.prevent="showLogout"
              class="flex items-center p-3 rounded-lg text-red-100 hover:bg-red-600/30 hover:text-white transition-all duration-200 group">
              <img src="../../assets/image/logout.png" class="logout-icon w-5 h-5 mr-3" alt="logout icon" />
              <span class="font-medium text-black700">Logout</span>
            </a>
          </li>
        </ul>
        <div class="mt-auto pt-8">
          <div class="bg-black700/30 rounded-lg p-3">
            <p class="text-xs text-black700 text-center font-inria">CSU Grading System v2.0</p>
            <p class="text-[10px] text-orange400 text-center mt-1">A.Y. 2024-2025</p>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col lg:ml-64 min-h-screen transition-all duration-300 bg-gray-50">
      <nav class="bg-white sticky top-0 z-30 shadow-sm border-gray-300 border-b-2">
        <div class="flex justify-between items-center px-6 py-3">
          <div class="flex items-center gap-4">
            <button @click="toggleSidebar"
              class="lg:hidden p-2 text-black700 rounded-lg hover:bg-orange100 focus:outline-none focus:ring-2 focus:ring-orange400">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75h15v1.5H2v-1.5zm0 10.5h8v1.5H2v-1.5zM2 10h15v1.5H2V10z" />
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

      <main class="flex-1 p-6 lg:p-8 overflow-y-auto font-inria">
        <div v-if="activePage.name === 'Dashboard'" class="animate-fade-in space-y-8">

          <div class="flex flex-col xl:flex-row gap-6">
            <div class="flex-1 bg-gradient-to-br from-orange400 to-orange300 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-center min-h-[250px]">
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
              <div class="grid grid-cols-7 text-center text-xs font-inria font-semibold text-gray-400 mb-2">
                <span v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day">{{ day }}</span>
              </div>
              <div class="grid grid-cols-7 text-center gap-1">
                <span v-for="n in 31" :key="n" :class="[
                  'w-8 h-8 flex items-center justify-center rounded-lg mx-auto text-sm font-inria transition-all cursor-pointer',
                  n === currentDay
                    ? 'bg-orange400 text-white shadow-md font-bold'
                    : 'text-gray-600 hover:bg-orange100 hover:text-orange400'
                ]">{{ n }}</span>
              </div>
              <div class="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 bg-orange400 rounded-full"></span>
                  <span class="text-sm font-inria text-gray-600">Today</span>
                </div>
                <span class="text-sm font-roboto font-semibold text-black700">{{ currentMonth }} {{ currentDay }}, {{ currentYear }}</span>
              </div>
            </div>
          </div>

          <!-- OBE Risk Overview -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-epundaslab font-bold text-black700 mb-1">OBE Risk Overview</h3>
                <p class="text-sm text-gray-500 font-inria">All active classes · Click a card to view student details</p>
              </div>
              <button @click="fetchAllClassRisks" :disabled="obeLoading"
                class="text-sm text-black font-inria font-medium flex items-center gap-1 bg-orange100 px-3 py-1.5 rounded-lg transition-all hover:bg-orange200 disabled:opacity-50">
                <svg v-if="!obeLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ obeLoading ? 'Refreshing...' : 'Refresh' }}
              </button>
            </div>

            <div v-if="obeLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div v-for="n in 6" :key="n" class="bg-white rounded-xl shadow-md p-5 animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-3 bg-gray-100 rounded w-3/4 mb-6"></div>
                <div class="flex justify-center mb-4"><div class="w-24 h-24 bg-gray-200 rounded-full"></div></div>
                <div class="h-3 bg-gray-100 rounded w-full mb-2"></div>
                <div class="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
            </div>

            <div v-else-if="!obeLoading && obeClassCards.length === 0"
              class="bg-white rounded-xl shadow-md p-12 text-center text-gray-400">
              <svg class="w-14 h-14 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="font-medium font-epundaslab text-lg mb-1">No classes found in the system</p>
              <p class="text-sm font-inria">Import a class via the Grading Module to get started.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div v-for="card in obeClassCards" :key="card.key"
                @click="card.hasData ? openRiskModal(card) : null"
                class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all"
                :class="card.hasData ? 'hover:shadow-xl transform hover:-translate-y-1 cursor-pointer group' : 'opacity-80 cursor-default'">
                <div class="bg-gradient-to-r from-gray-800 to-gray-900 px-5 py-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-epundaslab font-bold text-white text-lg leading-tight">{{ card.subjcode }}</h4>
                      <p class="text-gray-400 text-xs mt-0.5 font-inria">{{ card.instructor }}</p>
                    </div>
                    <span class="bg-orange400/80 text-white text-xs px-2 py-1 rounded-full font-bold font-inria whitespace-nowrap">Sec {{ card.section }}</span>
                  </div>
                  <p class="text-gray-500 text-[10px] mt-1 font-inria">{{ card.sy }} · {{ card.sem }} Sem</p>
                </div>
                <div v-if="!card.hasData" class="px-5 py-6 flex flex-col items-center justify-center text-center gap-3">
                  <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-500 font-inria">Awaiting Grade Data</p>
                    <p class="text-[10px] text-gray-400 font-inria mt-1">Run Compute Grades in the<br>Grading Module to enable analysis.</p>
                  </div>
                  <span class="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-inria border border-gray-200">Class imported ✓ · Grades pending</span>
                </div>
                <div v-else class="px-5 py-4">
                  <div class="flex items-center gap-4">
                    <div class="relative flex-shrink-0">
                      <svg width="90" height="90" viewBox="0 0 90 90">
                        <circle cx="45" cy="45" r="38" fill="none" stroke="#f3f4f6" stroke-width="14"/>
                        <circle cx="45" cy="45" r="38" fill="none" stroke="#22c55e" stroke-width="14" stroke-dasharray="238.76" :stroke-dashoffset="getPieOffset(card, 'safe')" stroke-linecap="butt" transform="rotate(-90 45 45)" style="transition: stroke-dashoffset 0.6s ease;"/>
                        <circle cx="45" cy="45" r="38" fill="none" stroke="#f59e0b" stroke-width="14" stroke-dasharray="238.76" :stroke-dashoffset="getPieOffset(card, 'warning')" stroke-linecap="butt" :style="{ strokeDashoffset: getPieOffset(card, 'warning'), transform: `rotate(${getPieRotation(card, 'warning')}deg)`, transformOrigin: '45px 45px', transition: 'all 0.6s ease' }"/>
                        <circle cx="45" cy="45" r="38" fill="none" stroke="#ef4444" stroke-width="14" stroke-dasharray="238.76" :stroke-dashoffset="getPieOffset(card, 'critical')" stroke-linecap="butt" :style="{ strokeDashoffset: getPieOffset(card, 'critical'), transform: `rotate(${getPieRotation(card, 'critical')}deg)`, transformOrigin: '45px 45px', transition: 'all 0.6s ease' }"/>
                        <text x="45" y="41" text-anchor="middle" style="font-size:13px; font-weight:700; fill:#1f2937;">{{ card.total }}</text>
                        <text x="45" y="54" text-anchor="middle" style="font-size:7px; fill:#9ca3af;">students</text>
                      </svg>
                    </div>
                    <div class="flex-1 space-y-2">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0"></span><span class="text-xs font-inria text-gray-600">Safe</span></div>
                        <div class="flex items-center gap-1"><span class="text-xs font-bold text-green-700">{{ card.safe }}</span><span class="text-[10px] text-gray-400 font-inria">({{ card.total > 0 ? Math.round(card.safe/card.total*100) : 0 }}%)</span></div>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-yellow-500 flex-shrink-0"></span><span class="text-xs font-inria text-gray-600">Warning</span></div>
                        <div class="flex items-center gap-1"><span class="text-xs font-bold text-yellow-700">{{ card.warning }}</span><span class="text-[10px] text-gray-400 font-inria">({{ card.total > 0 ? Math.round(card.warning/card.total*100) : 0 }}%)</span></div>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"></span><span class="text-xs font-inria text-gray-600">Critical</span></div>
                        <div class="flex items-center gap-1"><span class="text-xs font-bold text-red-700">{{ card.critical }}</span><span class="text-[10px] text-gray-400 font-inria">({{ card.total > 0 ? Math.round(card.critical/card.total*100) : 0 }}%)</span></div>
                      </div>
                      <div class="mt-1 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                        <div class="h-full bg-green-500 transition-all" :style="{ width: (card.total > 0 ? card.safe/card.total*100 : 0) + '%' }"></div>
                        <div class="h-full bg-yellow-400 transition-all" :style="{ width: (card.total > 0 ? card.warning/card.total*100 : 0) + '%' }"></div>
                        <div class="h-full bg-red-500 transition-all" :style="{ width: (card.total > 0 ? card.critical/card.total*100 : 0) + '%' }"></div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-3 grid grid-cols-2 gap-2">
                    <div class="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
                      <p class="text-[10px] text-green-600 font-inria font-semibold uppercase tracking-wide">Class Passed</p>
                      <p class="text-lg font-epundaslab font-bold text-green-700">{{ card.total > 0 ? Math.round(card.safe / card.total * 100) : 0 }}%</p>
                      <p class="text-[10px] text-green-500 font-inria">{{ card.safe }} / {{ card.total }} students</p>
                    </div>
                    <div class="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
                      <p class="text-[10px] text-red-600 font-inria font-semibold uppercase tracking-wide">At Risk</p>
                      <p class="text-lg font-epundaslab font-bold text-red-700">{{ card.total > 0 ? Math.round((card.warning + card.critical) / card.total * 100) : 0 }}%</p>
                      <p class="text-[10px] text-red-500 font-inria">{{ card.warning + card.critical }} / {{ card.total }} students</p>
                    </div>
                  </div>
                  <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span class="text-[10px] text-gray-400 font-inria">{{ card.total }} students analyzed</span>
                    <span class="text-xs text-orange400 font-bold font-inria group-hover:underline flex items-center gap-1">
                      View Details
                      <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <component v-else :is="activePage.component" :user="user" />
      </main>

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
          <span class="block text-xs text-gray-400 font-inria text-center">© 2024 Caraga State University - ICT Center. All Rights Reserved. | Version 2.0.1</span>
        </div>
      </footer>
    </div>

    <!-- Logout Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
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
          <button @click="cancelLogout" class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-inria font-medium transition-colors">Cancel</button>
          <button @click="confirmLogout" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-inria font-medium shadow-md transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- OBE STUDENT RISK MODAL                          -->
    <!-- ═══════════════════════════════════════════════ -->
    <div v-if="riskModal.open"
      class="fixed inset-0 flex items-center justify-center z-50 p-4"
      style="background: rgba(0,0,0,0.55); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);"
      @click.self="closeRiskModal">

      <div class="bg-white rounded-2xl w-full max-w-7xl flex flex-row overflow-hidden"
        style="height: 88vh; min-height: 500px; box-shadow: 0 32px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.25);">

        <!-- ── LEFT PANEL: Class summary (matches instructor dashboard) ── -->
        <div class="w-72 flex-shrink-0 bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col overflow-y-auto relative">

          <!-- Close button -->
          <button @click="closeRiskModal"
            class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-gray-300 hover:text-white transition-all shadow-lg">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Header -->
          <div class="px-5 pt-6 pb-4 border-b border-white/10 pr-12">
            <h2 class="text-lg font-epundaslab font-bold text-white leading-tight">{{ riskModal.card?.subjcode }}</h2>
            <p class="text-orange400 text-xs font-inria font-bold mt-0.5">Section {{ riskModal.card?.section }}</p>
            <p class="text-gray-400 text-xs font-inria mt-1">{{ riskModal.card?.instructor }}</p>
            <p class="text-gray-500 text-[10px] font-inria mt-0.5">{{ riskModal.card?.sy }} · {{ riskModal.card?.sem }} Semester</p>
          </div>

          <!-- Donut chart -->
          <div class="flex flex-col items-center py-5 border-b border-white/10">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#374151" stroke-width="18"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#22c55e" stroke-width="18"
                stroke-dasharray="314.16" :stroke-dashoffset="getModalPieOffset('safe')"
                transform="rotate(-90 60 60)" style="transition: stroke-dashoffset 0.6s ease;"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" stroke-width="18"
                stroke-dasharray="314.16" :stroke-dashoffset="getModalPieOffset('warning')"
                :style="{ strokeDashoffset: getModalPieOffset('warning'), transform: `rotate(${getModalPieRotation('warning')}deg)`, transformOrigin: '60px 60px', transition: 'all 0.6s ease' }"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" stroke-width="18"
                stroke-dasharray="314.16" :stroke-dashoffset="getModalPieOffset('critical')"
                :style="{ strokeDashoffset: getModalPieOffset('critical'), transform: `rotate(${getModalPieRotation('critical')}deg)`, transformOrigin: '60px 60px', transition: 'all 0.6s ease' }"/>
              <text x="60" y="55" text-anchor="middle" style="font-size:18px; font-weight:800; fill:#ffffff;">{{ riskModal.students.length }}</text>
              <text x="60" y="70" text-anchor="middle" style="font-size:9px; fill:#9ca3af;">students</text>
            </svg>
          </div>

          <!-- Most Likely to Pass / Most Likely to Fail this semester -->
          <div class="px-4 py-5 border-b border-white/10 space-y-4">
            <p class="text-[10px] text-gray-500 font-inria font-semibold uppercase tracking-wider">This Semester</p>

            <!-- Most Likely to Pass -->
            <div class="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
              <p class="text-[10px] text-green-400 font-inria font-semibold uppercase tracking-wide mb-1">Most Likely to Pass</p>
              <div class="flex items-end justify-between">
                <p class="text-3xl font-epundaslab font-bold text-green-300">
                  {{ riskModal.students.length > 0 ? Math.round(riskModal.students.filter(s => s.risk_level === 'Safe').length / riskModal.students.length * 100) : 0 }}%
                </p>
                <p class="text-xs text-green-400 font-inria mb-1">
                  {{ riskModal.students.filter(s => s.risk_level === 'Safe').length }} / {{ riskModal.students.length }} students
                </p>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div class="h-2 bg-green-500 rounded-full transition-all"
                  :style="{ width: (riskModal.students.length > 0 ? riskModal.students.filter(s=>s.risk_level==='Safe').length/riskModal.students.length*100 : 0) + '%' }"></div>
              </div>
            </div>

            <!-- Most Likely to Fail -->
            <div class="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <p class="text-[10px] text-red-400 font-inria font-semibold uppercase tracking-wide mb-1">Most Likely to Fail</p>
              <div class="flex items-end justify-between">
                <p class="text-3xl font-epundaslab font-bold text-red-300">
                  {{ riskModal.students.length > 0 ? Math.round(riskModal.students.filter(s => s.risk_level !== 'Safe').length / riskModal.students.length * 100) : 0 }}%
                </p>
                <p class="text-xs text-red-400 font-inria mb-1">
                  {{ riskModal.students.filter(s => s.risk_level !== 'Safe').length }} / {{ riskModal.students.length }} students
                </p>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div class="h-2 bg-red-500 rounded-full transition-all"
                  :style="{ width: (riskModal.students.length > 0 ? riskModal.students.filter(s=>s.risk_level!=='Safe').length/riskModal.students.length*100 : 0) + '%' }"></div>
              </div>
            </div>

            <!-- Warning note for critical students -->
            <div v-if="riskModal.students.filter(s => s.risk_level === 'Critical').length > 0"
              class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></span>
              <p class="text-[10px] text-yellow-300 font-inria">
                {{ riskModal.students.filter(s => s.risk_level === 'Critical').length }} student{{ riskModal.students.filter(s => s.risk_level === 'Critical').length > 1 ? 's' : '' }} need immediate intervention
              </p>
            </div>
          </div>
        </div>

        <!-- ── RIGHT PANEL: tabbed ── -->
        <div class="flex-1 flex flex-col overflow-hidden">

          <div class="flex-shrink-0 border-b border-gray-200 bg-gray-50">
            <div class="flex items-center gap-1 px-5 pt-3">
              <button @click="switchModalTab('risk')"
                :class="['flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-xs font-bold font-inria transition-all border-b-2',
                  riskModal.activeTab === 'risk' ? 'bg-white border-gray-800 text-gray-800 shadow-sm' : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-white/60']">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Risk Analysis
              </button>
              <button @click="switchModalTab('heatmap')"
                :class="['flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-xs font-bold font-inria transition-all border-b-2',
                  riskModal.activeTab === 'heatmap' ? 'bg-white border-gray-800 text-gray-800 shadow-sm' : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-white/60']">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
                </svg>
                CO Heatmap
              </button>
              <!-- <button @click="switchModalTab('trajectory')"
                :class="['flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-xs font-bold font-inria transition-all border-b-2',
                  riskModal.activeTab === 'trajectory' ? 'bg-white border-gray-800 text-gray-800 shadow-sm' : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-white/60']">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                Score Trajectory
              </button> -->
            </div>

            <div v-if="riskModal.activeTab === 'risk'" class="flex items-center gap-4 px-6 py-3">
              <div class="flex-1 max-w-xs relative">
                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                </svg>
                <input v-model="riskModal.search" type="text" placeholder="Search student name or ID..."
                  class="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-inria focus:outline-none focus:ring-2 focus:ring-orange400"/>
              </div>
              <select v-model="riskModal.filter"
                class="flex-shrink-0 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-inria focus:outline-none focus:ring-2 focus:ring-orange400">
                <option value="">All Students</option>
                <option value="Critical">Critical Only</option>
                <option value="Warning">Warning Only</option>
                <option value="Safe">Safe Only</option>
              </select>
            </div>

            <div v-if="riskModal.activeTab === 'heatmap'" class="flex items-center gap-3 px-6 py-3">
              <div class="relative">
                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                </svg>
                <input v-model="riskModal.heatmapSearch" type="text" placeholder="Search student..."
                  class="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-inria focus:outline-none focus:ring-2 focus:ring-orange400"/>
              </div>
              <span class="text-xs text-gray-400 font-inria">Green = Pass (≥60%) · Red = Fail · Sorted lowest avg first</span>
            </div>

            <div v-if="riskModal.activeTab === 'trajectory'" class="flex items-center gap-3 px-6 py-3">
              <div class="relative">
                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                </svg>
                <input v-model="riskModal.trajectorySearch" type="text" placeholder="Search student..."
                  class="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-inria focus:outline-none focus:ring-2 focus:ring-orange400"/>
              </div>
              <select v-model="riskModal.trajectoryFilter"
                class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-inria focus:outline-none focus:ring-2 focus:ring-orange400">
                <option value="">All Trends</option>
                <option value="declining">Declining</option>
                <option value="stable">Stable</option>
                <option value="improving">Improving</option>
              </select>
              <div v-if="riskModal.trajectoryData && riskModal.trajectoryData.students" class="flex gap-2">
                <span v-for="t in ['declining','stable','improving']" :key="t"
                  class="text-[10px] font-bold px-2 py-1 rounded-full border font-inria"
                  :class="{
                    'bg-red-50 border-red-200 text-red-700': t === 'declining',
                    'bg-gray-50 border-gray-200 text-gray-600': t === 'stable',
                    'bg-green-50 border-green-200 text-green-700': t === 'improving'
                  }">
                  {{ riskModal.trajectoryData.students.filter(s => s.trend === t).length }}
                  {{ t.charAt(0).toUpperCase() + t.slice(1) }}
                </span>
              </div>
            </div>
          </div>

          <!-- TAB CONTENT -->
          <div class="flex-1 overflow-y-auto">

            <!-- TAB 1: Student Risk List -->
            <div v-if="riskModal.activeTab === 'risk'" class="px-5 py-4 space-y-3">
              <div v-if="riskModal.loading" class="space-y-3">
                <div v-for="n in 5" :key="n" class="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
              </div>
              <div v-else-if="filteredModalStudents.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400">
                <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/>
                </svg>
                <p class="font-inria text-sm">No students match this filter.</p>
              </div>
              <div v-for="(student, idx) in filteredModalStudents" :key="student.studid"
                class="rounded-xl border overflow-hidden"
                :class="{ 'border-red-200': student.risk_level === 'Critical', 'border-yellow-200': student.risk_level === 'Warning', 'border-green-200': student.risk_level === 'Safe' }">
                <div class="flex items-stretch"
                  :class="{ 'bg-red-50': student.risk_level === 'Critical', 'bg-yellow-50': student.risk_level === 'Warning', 'bg-green-50': student.risk_level === 'Safe' }">
                  <div class="flex flex-col items-center justify-center px-4 py-3 gap-1 border-r border-white/60 min-w-[56px]"
                    :class="{ 'bg-red-100': student.risk_level === 'Critical', 'bg-yellow-100': student.risk_level === 'Warning', 'bg-green-100': student.risk_level === 'Safe' }">
                    <span class="text-[10px] font-bold text-gray-400">#{{ idx + 1 }}</span>
                    <div class="w-8 h-8 rounded-full flex items-center justify-center"
                      :class="{ 'bg-red-500': student.risk_level === 'Critical', 'bg-yellow-500': student.risk_level === 'Warning', 'bg-green-500': student.risk_level === 'Safe' }">
                      <div class="w-3 h-3 rounded-full bg-white/80"></div>
                    </div>
                  </div>
                  <div class="flex flex-col justify-center px-4 py-3 w-52 flex-shrink-0 border-r border-white/60">
                    <p class="font-bold text-gray-800 text-sm font-inria leading-tight">{{ student.student_name }}</p>
                    <p class="text-[10px] text-gray-500 font-inria mt-0.5">ID: {{ student.studid }}</p>
                  </div>
                  <div class="flex items-center justify-center px-4 border-r border-white/60 flex-shrink-0">
                    <span v-if="student.risk_level === 'Critical'" class="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-full border border-red-300">
                      <span class="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>Critical
                    </span>
                    <span v-else-if="student.risk_level === 'Warning'" class="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-300">
                      <span class="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"></span>Warning
                    </span>
                    <span v-else class="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full border border-green-300">
                      <span class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>Safe
                    </span>
                  </div>
                  <div class="flex flex-col justify-center px-4 py-3 w-40 flex-shrink-0 border-r border-white/60">
                    <div class="flex justify-between text-[10px] mb-1">
                      <span class="text-gray-500 font-inria">Fail Probability</span>
                      <span class="font-bold" :class="{ 'text-red-600': student.fail_probability >= 70, 'text-yellow-600': student.fail_probability >= 40 && student.fail_probability < 70, 'text-green-600': student.fail_probability < 40 }">{{ student.fail_probability }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="h-2 rounded-full transition-all"
                        :class="{ 'bg-red-500': student.fail_probability >= 70, 'bg-yellow-500': student.fail_probability >= 40 && student.fail_probability < 70, 'bg-green-500': student.fail_probability < 40 }"
                        :style="{ width: student.fail_probability + '%' }"></div>
                    </div>
                  </div>
                  <div class="flex flex-col justify-center items-center px-4 py-3 w-28 flex-shrink-0 border-r border-white/60">
                    <p class="text-[10px] text-gray-500 font-inria">CO Pass Rate</p>
                    <p class="font-bold text-base" :class="student.co_pass_rate >= 0.75 ? 'text-green-700' : student.co_pass_rate >= 0.5 ? 'text-yellow-700' : 'text-red-700'">
                      {{ student.co_pass_rate !== undefined ? (student.co_pass_rate * 100).toFixed(0) : '—' }}%
                    </p>
                  </div>
                  <div class="flex flex-col justify-center items-center px-4 py-3 w-28 flex-shrink-0 border-r border-white/60">
                    <p class="text-[10px] text-gray-500 font-inria">Weighted Score</p>
                    <p class="font-bold text-base"
                      :class="{ 'text-red-600': (student.total_weighted_percent || 0) < 60, 'text-yellow-600': (student.total_weighted_percent || 0) >= 60 && (student.total_weighted_percent || 0) < 75, 'text-green-600': (student.total_weighted_percent || 0) >= 75 }">
                      {{ student.total_weighted_percent ? student.total_weighted_percent.toFixed(1) + '%' : '—' }}
                    </p>
                  </div>
                  <div class="flex flex-wrap items-center gap-1 px-4 py-3 flex-1 min-w-0">
                    <template v-if="student.weak_cos && student.weak_cos.length > 0">
                      <span class="text-[10px] text-gray-500 font-inria mr-1 flex-shrink-0">Weak COs:</span>
                      <span v-for="co in student.weak_cos" :key="co" class="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200 flex-shrink-0">{{ co }}</span>
                    </template>
                    <span v-else class="text-[10px] text-gray-400 font-inria italic">{{ student.risk_level === 'Safe' ? 'All COs on track' : 'No CO data' }}</span>
                  </div>
                </div>
                <div class="border-t"
                  :class="{ 'border-red-200 bg-white': student.risk_level === 'Critical', 'border-yellow-200 bg-white': student.risk_level === 'Warning', 'border-green-200 bg-white': student.risk_level === 'Safe' }">
                  <div class="px-4 py-3">
                    <p class="text-[10px] font-bold text-gray-600 mb-1.5 font-inria uppercase tracking-wide">Missing Assessments / Needs Intervention</p>
                    <div v-if="student.weak_cos && student.weak_cos.length > 0" class="flex flex-wrap gap-2">
                      <div v-for="co in student.weak_cos" :key="'int-' + co"
                        class="flex flex-col gap-1 bg-red-50 border border-red-100 rounded-lg px-3 py-2 min-w-[120px]">
                        <span class="text-red-800 text-[10px] font-black uppercase">{{ co }}</span>
                        <span v-if="student.weak_co_details && student.weak_co_details[co] && student.weak_co_details[co].length"
                          class="text-[11px] text-red-600 font-bold font-inria">
                          {{ student.weak_co_details[co].join(', ') }}
                        </span>
                        <span v-else class="text-[11px] text-red-600 font-bold font-inria">Missing Submissions</span>
                      </div>
                    </div>
                    <div v-else-if="student.risk_level === 'Safe'" class="text-[11px] text-green-600 font-bold font-inria">
                      All assessments are safely passing.
                    </div>
                    <div v-else class="text-[11px] text-gray-400 font-inria italic">
                      Run Compute Grades for assessment data.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 2: CO Heatmap -->
            <div v-if="riskModal.activeTab === 'heatmap'" class="p-5">
              <div v-if="riskModal.heatmapLoading" class="space-y-3">
                <div v-for="n in 6" :key="n" class="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
              <div v-else-if="riskModal.heatmapData && riskModal.heatmapData.error" class="flex flex-col items-center justify-center py-16 text-gray-400">
                <svg class="w-14 h-14 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="font-epundaslab font-bold text-gray-500 mb-1">{{ riskModal.heatmapData.error }}</p>
                <p class="text-sm font-inria">Compute Grades in the Grading Module first.</p>
              </div>
              <div v-else-if="riskModal.heatmapData" class="space-y-5">
                <div class="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 font-inria">Class CO Attainment</p>
                  <div class="flex flex-wrap gap-2">
                    <div v-for="co in riskModal.heatmapData.co_summary" :key="co.co"
                      class="flex-1 min-w-[90px] rounded-lg p-2.5 border text-center"
                      :class="co.pass_rate >= 75 ? 'bg-green-50 border-green-200' : co.pass_rate >= 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'">
                      <p class="text-[10px] font-bold font-inria" :class="co.pass_rate >= 75 ? 'text-green-700' : co.pass_rate >= 50 ? 'text-yellow-700' : 'text-red-700'">{{ co.co }}</p>
                      <p class="text-lg font-epundaslab font-bold" :class="co.pass_rate >= 75 ? 'text-green-800' : co.pass_rate >= 50 ? 'text-yellow-800' : 'text-red-800'">{{ co.pass_rate }}%</p>
                      <p class="text-[9px] text-gray-400 font-inria">{{ co.pass_count }}/{{ co.total }}</p>
                      <div class="w-full bg-gray-200 rounded-full h-1 mt-1.5">
                        <div class="h-1 rounded-full" :class="co.pass_rate >= 75 ? 'bg-green-500' : co.pass_rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'" :style="{ width: co.pass_rate + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="overflow-x-auto rounded-xl border border-gray-200">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b border-gray-200 bg-gray-50">
                        <th class="px-4 py-2.5 text-left text-xs text-gray-500 font-semibold uppercase tracking-wider sticky left-0 bg-gray-50 min-w-[180px]">Student</th>
                        <th v-for="co in riskModal.heatmapData.cos" :key="co" class="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wider min-w-[72px]">{{ co }}</th>
                        <th class="px-4 py-2.5 text-center text-xs text-gray-500 font-semibold uppercase">Avg</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr v-for="(student, idx) in filteredHeatmapStudents" :key="student.studid" :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'">
                        <td class="px-4 py-2 sticky left-0 bg-inherit">
                          <p class="font-bold text-gray-800 text-xs font-inria">{{ student.student_name }}</p>
                          <p class="text-[10px] text-gray-400 font-inria">{{ student.studid }}</p>
                        </td>
                        <td v-for="score in student.scores" :key="score.co" class="px-2 py-2 text-center">
                          <div class="w-14 h-7 rounded-lg flex items-center justify-center text-xs font-bold mx-auto"
                            :class="{ 'bg-green-100 text-green-800 border border-green-200': score.status === 'pass', 'bg-red-100 text-red-800 border border-red-200': score.status === 'fail', 'bg-gray-100 text-gray-400 border border-gray-200': score.status === 'missing' }">
                            {{ score.pct !== null ? score.pct + '%' : '—' }}
                          </div>
                        </td>
                        <td class="px-4 py-2 text-center">
                          <span class="font-bold text-sm" :class="student.avg_score >= 75 ? 'text-green-700' : student.avg_score >= 60 ? 'text-yellow-700' : 'text-red-700'">{{ student.avg_score }}%</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- TAB 3: Score Trajectory -->
            <div v-if="riskModal.activeTab === 'trajectory'" class="p-5 space-y-4">
              <div v-if="riskModal.trajectoryLoading" class="space-y-3">
                <div v-for="n in 5" :key="n" class="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
              <div v-else-if="riskModal.trajectoryData && riskModal.trajectoryData.error" class="flex flex-col items-center justify-center py-16 text-gray-400">
                <svg class="w-14 h-14 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="font-epundaslab font-bold text-gray-500 mb-1">{{ riskModal.trajectoryData.error }}</p>
                <p class="text-sm font-inria">Compute Grades in the Grading Module first.</p>
              </div>
              <div v-else-if="riskModal.trajectoryData">
                <div v-for="student in filteredTrajectoryStudents" :key="student.studid"
                  class="bg-white rounded-xl shadow-sm border overflow-hidden mb-4"
                  :class="{ 'border-red-200': student.trend === 'declining', 'border-gray-200': student.trend === 'stable', 'border-green-200': student.trend === 'improving' }">
                  <div class="flex items-center justify-between px-4 py-3 border-b"
                    :class="{ 'bg-red-50 border-red-100': student.trend === 'declining', 'bg-gray-50 border-gray-100': student.trend === 'stable', 'bg-green-50 border-green-100': student.trend === 'improving' }">
                    <div class="flex items-center gap-3">
                      <div class="w-7 h-7 rounded-full flex items-center justify-center"
                        :class="{ 'bg-red-500': student.trend === 'declining', 'bg-gray-400': student.trend === 'stable', 'bg-green-500': student.trend === 'improving' }">
                        <div class="w-2.5 h-2.5 rounded-full bg-white/80"></div>
                      </div>
                      <div>
                        <p class="font-bold text-gray-800 text-sm font-inria">{{ student.student_name }}</p>
                        <p class="text-[10px] text-gray-500 font-inria">ID: {{ student.studid }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-4">
                      <div class="text-center">
                        <p class="text-[10px] text-gray-500 font-inria">Avg</p>
                        <p class="font-bold text-sm" :class="student.overall_avg >= 75 ? 'text-green-700' : student.overall_avg >= 60 ? 'text-yellow-700' : 'text-red-700'">{{ student.overall_avg }}%</p>
                      </div>
                      <div class="text-center">
                        <p class="text-[10px] text-gray-500 font-inria">Recent</p>
                        <p class="font-bold text-sm" :class="student.latest_avg >= 75 ? 'text-green-700' : student.latest_avg >= 60 ? 'text-yellow-700' : 'text-red-700'">{{ student.latest_avg }}%</p>
                      </div>
                      <span class="text-xs font-bold px-3 py-1 rounded-full border font-inria"
                        :class="{ 'bg-red-100 text-red-700 border-red-200': student.trend === 'declining', 'bg-gray-100 text-gray-600 border-gray-200': student.trend === 'stable', 'bg-green-100 text-green-700 border-green-200': student.trend === 'improving' }">
                        {{ student.trend.charAt(0).toUpperCase() + student.trend.slice(1) }}
                      </span>
                    </div>
                  </div>
                  <div class="px-4 py-3 overflow-x-auto">
                    <div class="flex items-end gap-1 min-w-max" style="height: 52px;">
                      <div v-for="(pt, i) in student.points" :key="i" class="group/bar flex flex-col items-center gap-0.5 cursor-default" style="min-width: 28px;">
                        <div class="relative w-6 rounded-t transition-all"
                          :style="{ height: pt.pct !== null ? Math.max((pt.pct / 100) * 40, 3) + 'px' : '3px' }"
                          :class="{ 'bg-green-400': pt.status === 'pass', 'bg-red-400': pt.status === 'fail', 'bg-gray-200': pt.status === 'missing' }">
                          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/bar:flex flex-col items-center z-20 pointer-events-none">
                            <div class="bg-gray-800 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap font-inria shadow-lg">
                              {{ pt.label }}<br>{{ pt.pct !== null ? pt.pct + '%' : 'No data' }}<span v-if="pt.co"> · {{ pt.co }}</span>
                            </div>
                            <div class="w-1.5 h-1.5 bg-gray-800 rotate-45 -mt-0.5"></div>
                          </div>
                        </div>
                        <div class="w-1 h-1 rounded-full bg-orange-400 opacity-60"></div>
                      </div>
                    </div>
                    <div class="flex gap-1 mt-1 min-w-max">
                      <div v-for="(pt, i) in student.points" :key="'l'+i" style="min-width: 28px;" class="text-[9px] text-gray-400 font-inria text-center truncate">
                        {{ i % 4 === 0 ? pt.label.substring(0, 5) : '' }}
                      </div>
                    </div>
                  </div>
                  <div v-if="student.trend === 'declining'" class="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center gap-2">
                    <svg class="w-3.5 h-3.5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <p class="text-[10px] text-red-700 font-inria">Declining trend — recent scores below earlier performance. Early intervention recommended.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <!-- End OBE Modal -->

    <!-- Scroll to Top -->
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
        { name: "Dashboard",          component: null,              icon: require("../../assets/image/dashboard-sidebar.png") },
        { name: "Grading Module",     component: GradingModule,     icon: require("../../assets/image/grading-module.png") },
        // { name: "Student Monitoring", component: StudentMonitoring, icon: require("../../assets/image/student-monitoring.png") },
        { name: "User",               component: User,              icon: require("../../assets/image/multiple-users-silhouette.png") },
        { name: "Profile",            component: Profile,           icon: require("../../assets/image/user-sidebar.png") },
        { name: "Import CSV",         component: ImportCSV,         icon: require("../../assets/image/import.png") },
      ],
      masterlistStats: { count: 0, latest: null },
      obeLoading: false,
      obeClassCards: [],
      riskModal: {
        open: false,
        loading: false,
        card: null,
        students: [],
        filter: '',
        search: '',
        activeTab: 'risk',
        heatmapData: null,
        heatmapLoading: false,
        heatmapSearch: '',
        trajectoryData: null,
        trajectoryLoading: false,
        trajectorySearch: '',
        trajectoryFilter: ''
      }
    }
  },
  computed: {
    profilePicture() {
      if (!this.user?.empid) return null
      try { return localStorage.getItem('profile_pic_' + this.user.empid) || null } catch (e) { return null }
    },
    currentDate() { return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
    currentMonth() { return new Date().toLocaleDateString('en-US', { month: 'long' }) },
    currentYear() { return new Date().getFullYear() },
    currentDay() { return new Date().getDate() },
    filteredModalStudents() {
      let list = this.riskModal.students
      if (this.riskModal.filter) list = list.filter(s => s.risk_level === this.riskModal.filter)
      if (this.riskModal.search.trim()) {
        const q = this.riskModal.search.trim().toLowerCase()
        list = list.filter(s => (s.student_name || '').toLowerCase().includes(q) || String(s.studid || '').toLowerCase().includes(q))
      }
      return list
    },
    topWeakCOs() {
      const counts = {}
      this.riskModal.students.forEach(s => {
        if (s.weak_cos && s.weak_cos.length) s.weak_cos.forEach(co => { counts[co] = (counts[co] || 0) + 1 })
      })
      const total = this.riskModal.students.length || 1
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([co, count]) => ({ co, count, pct: Math.round(count / total * 100) }))
    },
    filteredHeatmapStudents() {
      if (!this.riskModal.heatmapData) return []
      let list = this.riskModal.heatmapData.students
      if (this.riskModal.heatmapSearch.trim()) {
        const q = this.riskModal.heatmapSearch.trim().toLowerCase()
        list = list.filter(s => (s.student_name || '').toLowerCase().includes(q) || String(s.studid || '').toLowerCase().includes(q))
      }
      return list
    },
    filteredTrajectoryStudents() {
      if (!this.riskModal.trajectoryData) return []
      let list = this.riskModal.trajectoryData.students
      if (this.riskModal.trajectoryFilter) list = list.filter(s => s.trend === this.riskModal.trajectoryFilter)
      if (this.riskModal.trajectorySearch.trim()) {
        const q = this.riskModal.trajectorySearch.trim().toLowerCase()
        list = list.filter(s => (s.student_name || '').toLowerCase().includes(q) || String(s.studid || '').toLowerCase().includes(q))
      }
      return list
    }
  },
  async mounted() {
    try {
      const res = await this.$axios.get("/auth/user", { withCredentials: true })
      this.user = res.data
      this.fetchDashboardStats()
      this.fetchAllClassRisks()
    } catch (err) { console.error("Failed to fetch user:", err) }
    window.addEventListener("scroll", this.handleScroll)
  },
  beforeUnmount() { window.removeEventListener("scroll", this.handleScroll) },
  methods: {
    async fetchDashboardStats() {
      try {
        const res = await this.$axios.get("/masterlist/all", { withCredentials: true })
        const lists = res.data
        const uniqueClasses = new Set()
        lists.forEach(item => { if (item.subjcode && item.section) uniqueClasses.add(`${item.subjcode}-${item.section}`) })
        this.masterlistStats.count = uniqueClasses.size
        if (lists.length > 0) { lists.sort((a, b) => b.masterlist_id - a.masterlist_id); this.masterlistStats.latest = lists[0] }
      } catch (e) { console.error("Failed to load stats", e) }
    },
    toggleSidebar() { this.sidebarOpen = !this.sidebarOpen },
    setActivePage(item) {
      this.activePage = item
      this.sidebarOpen = false
      if (item.name === 'Dashboard') { this.fetchDashboardStats(); if (this.obeClassCards.length === 0) this.fetchAllClassRisks() }
    },
    showLogout() { this.showLogoutModal = true; setTimeout(() => (this.modalAnimation = true), 10) },
    cancelLogout() { this.modalAnimation = false; setTimeout(() => (this.showLogoutModal = false), 300) },
    async confirmLogout() {
      try {
        await this.$axios.post("/auth/logout", {}, { withCredentials: true })
        this.$store.dispatch('logout'); this.user = null; window.location.href = "/"
      } catch (err) { console.error("Logout failed:", err) }
    },
    handleScroll() { this.showScrollTop = window.scrollY > 200 },
    scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }) },

    async fetchAllClassRisks() {
      this.obeLoading = true
      this.obeClassCards = []
      try {
        const res = await this.$axios.get("/masterlist/all", { withCredentials: true })
        const lists = res.data
        const classMap = {}
        lists.forEach(row => {
          if (!row.subjcode || !row.section) return
          const key = `${row.subjcode}||${row.section}||${row.sy}||${row.sem}`
          if (!classMap[key]) {
            classMap[key] = {
              key, subjcode: row.subjcode, section: row.section, sy: row.sy, sem: row.sem,
              instructor: row.employee ? `${row.employee.firstname} ${row.employee.lastname}` : 'Unassigned',
              hasData: false, total: 0, safe: 0, warning: 0, critical: 0, students: []
            }
          }
        })
        const classes = Object.values(classMap)
        this.obeClassCards = classes
        this.obeLoading = false
        const results = await Promise.allSettled(
          classes.map(cls => this.$axios.get('/prediction/batch', {
            params: { subjcode: cls.subjcode, section: cls.section, sy: cls.sy, sem: cls.sem },
            withCredentials: true
          }).then(r => ({ key: cls.key, data: r.data })))
        )
        results.forEach(result => {
          if (result.status !== 'fulfilled') return
          const { key, data } = result.value
          if (!data || data.error || !Array.isArray(data) || data.length === 0) return
          const cardIndex = this.obeClassCards.findIndex(c => c.key === key)
          if (cardIndex === -1) return
          const safe = data.filter(s => s.risk_level === 'Safe').length
          const warning = data.filter(s => s.risk_level === 'Warning').length
          const critical = data.filter(s => s.risk_level === 'Critical').length
          this.$set(this.obeClassCards, cardIndex, { ...this.obeClassCards[cardIndex], hasData: true, total: data.length, safe, warning, critical, students: data })
        })
        this.obeClassCards = [
          ...this.obeClassCards.filter(c => c.hasData).sort((a, b) => b.critical - a.critical || b.warning - a.warning),
          ...this.obeClassCards.filter(c => !c.hasData)
        ]
      } catch (e) { console.error("Failed to load OBE class risks", e); this.obeLoading = false }
    },

    openRiskModal(card) {
      this.riskModal.card = card
      this.riskModal.students = [...card.students].sort((a, b) => b.fail_probability - a.fail_probability)
      this.riskModal.filter = ''; this.riskModal.search = ''; this.riskModal.activeTab = 'risk'
      this.riskModal.heatmapData = null; this.riskModal.heatmapLoading = false; this.riskModal.heatmapSearch = ''
      this.riskModal.trajectoryData = null; this.riskModal.trajectoryLoading = false
      this.riskModal.trajectorySearch = ''; this.riskModal.trajectoryFilter = ''
      this.riskModal.open = true
    },
    closeRiskModal() {
      this.riskModal.open = false; this.riskModal.card = null; this.riskModal.students = []
      this.riskModal.filter = ''; this.riskModal.search = ''; this.riskModal.activeTab = 'risk'
      this.riskModal.heatmapData = null; this.riskModal.trajectoryData = null
    },
    switchModalTab(tab) {
      this.riskModal.activeTab = tab
      if (tab === 'heatmap' && !this.riskModal.heatmapData && !this.riskModal.heatmapLoading) this.loadModalHeatmap()
      if (tab === 'trajectory' && !this.riskModal.trajectoryData && !this.riskModal.trajectoryLoading) this.loadModalTrajectory()
    },
    async loadModalHeatmap() {
      const card = this.riskModal.card; if (!card) return
      this.riskModal.heatmapLoading = true
      try {
        const res = await this.$axios.get('/prediction/heatmap', { params: { subjcode: card.subjcode, section: card.section, sy: card.sy, sem: card.sem }, withCredentials: true })
        this.riskModal.heatmapData = (res.data && !res.data.error && res.data.students && res.data.students.length) ? res.data : { error: res.data?.error || 'No CO score data available.' }
      } catch (e) { this.riskModal.heatmapData = { error: 'Failed to load heatmap data.' } }
      finally { this.riskModal.heatmapLoading = false }
    },
    async loadModalTrajectory() {
      const card = this.riskModal.card; if (!card) return
      this.riskModal.trajectoryLoading = true
      try {
        const res = await this.$axios.get('/prediction/trajectory', { params: { subjcode: card.subjcode, section: card.section, sy: card.sy, sem: card.sem }, withCredentials: true })
        this.riskModal.trajectoryData = (res.data && !res.data.error && res.data.students && res.data.students.length) ? res.data : { error: res.data?.error || 'No assessment data available.' }
      } catch (e) { this.riskModal.trajectoryData = { error: 'Failed to load trajectory data.' } }
      finally { this.riskModal.trajectoryLoading = false }
    },

    // Card pie helpers (r=38, circ=238.76)
    getPieOffset(card, segment) {
      const circ = 238.76; if (card.total === 0) return circ
      const pct = segment === 'safe' ? card.safe / card.total : segment === 'warning' ? card.warning / card.total : card.critical / card.total
      return circ * (1 - pct)
    },
    getPieRotation(card, segment) {
      if (card.total === 0) return -90
      const safePct = card.safe / card.total; const warningPct = card.warning / card.total
      return segment === 'warning' ? -90 + safePct * 360 : -90 + (safePct + warningPct) * 360
    },

    // Modal pie helpers (r=50, circ=314.16)
    getModalPieOffset(segment) {
      const circ = 314.16; const students = this.riskModal.students; const total = students.length; if (total === 0) return circ
      const count = segment === 'safe' ? students.filter(s => s.risk_level === 'Safe').length : segment === 'warning' ? students.filter(s => s.risk_level === 'Warning').length : students.filter(s => s.risk_level === 'Critical').length
      return circ * (1 - count / total)
    },
    getModalPieRotation(segment) {
      const students = this.riskModal.students; const total = students.length; if (total === 0) return -90
      const safePct = students.filter(s => s.risk_level === 'Safe').length / total
      const warningPct = students.filter(s => s.risk_level === 'Warning').length / total
      return segment === 'warning' ? -90 + safePct * 360 : -90 + (safePct + warningPct) * 360
    },

    getRiskExplanation(student) {
      const fp = student.fail_probability || 0; const copr = student.co_pass_rate !== undefined ? student.co_pass_rate * 100 : null
      const wp = student.total_weighted_percent || 0; const weak = student.weak_cos || []
      if (student.risk_level === 'Critical') {
        const reasons = []
        if (fp >= 70) reasons.push(`very high fail probability of ${fp}%`)
        if (copr !== null && copr < 50) reasons.push(`only ${copr.toFixed(0)}% of Course Outcomes passed`)
        if (wp < 60) reasons.push(`weighted score is critically low at ${wp.toFixed(1)}%`)
        if (weak.length > 0) reasons.push(`failing ${weak.length} CO${weak.length > 1 ? 's' : ''} (${weak.join(', ')})`)
        return reasons.length ? `This student is at critical risk due to: ${reasons.join('; ')}. Immediate academic intervention is strongly recommended.` : 'This student has indicators placing them at critical academic risk. Immediate intervention is recommended.'
      }
      if (student.risk_level === 'Warning') {
        const reasons = []
        if (fp >= 40 && fp < 70) reasons.push(`moderate fail probability of ${fp}%`)
        if (copr !== null && copr >= 50 && copr < 75) reasons.push(`${copr.toFixed(0)}% CO pass rate is below the 75% threshold`)
        if (wp >= 60 && wp < 75) reasons.push(`weighted score of ${wp.toFixed(1)}% is approaching the passing threshold`)
        if (weak.length > 0) reasons.push(`struggling with ${weak.join(', ')}`)
        return reasons.length ? `This student shows warning signs: ${reasons.join('; ')}. Close monitoring and early support are advised.` : 'This student shows early warning indicators. Proactive support is advised to prevent further decline.'
      }
      const positives = []
      if (fp < 40) positives.push(`low fail probability of only ${fp}%`)
      if (copr !== null && copr >= 75) positives.push(`strong CO pass rate of ${copr.toFixed(0)}%`)
      if (wp >= 75) positives.push(`weighted score of ${wp.toFixed(1)}% is above the passing threshold`)
      return positives.length ? `This student is performing well with ${positives.join(', ')}. No immediate intervention required.` : 'This student is on track. Performance indicators are within acceptable range.'
    },

    getAssessmentIntervention(co, student) {
      const fp = student.fail_probability || 0; const wp = student.total_weighted_percent || 0
      return (fp >= 70 || wp < 60) ? 'Remediation & re-assessment needed' : 'Review & practice recommended'
    }
  }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.nav-icon { filter: brightness(0); }
.bg-black700 .nav-icon { filter: brightness(0) invert(1); }
a:hover .nav-icon { filter: brightness(0) invert(1); }
.logout-icon { filter: brightness(0); }
a:hover .logout-icon { filter: brightness(0) saturate(100%) invert(20%) sepia(100%) saturate(700%) hue-rotate(330deg); }
</style>