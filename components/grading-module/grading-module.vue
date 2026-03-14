<template>
  <div class="font-inria min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">

    <!-- Header with OBE Branding - Icon removed -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-epundaslab font-bold text-gray-800">OBE Grading Sheet</h1>
        <p class="text-xs text-gray-500 flex items-center gap-2">
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          Outcome-Based Education • Real-time Assessment
        </p>
      </div>
      
      <!-- Subject Info Badge -->
      <div v-if="activeSubject" class="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 self-start sm:self-auto">
        <span class="text-sm font-bold text-orange-500">{{ activeSubject.subjcode }}</span>
        <span class="text-xs text-gray-400 ml-2">Sec {{ activeSubject.section || activeSubject.sect }}</span>
      </div>
    </div>

    <!-- Enhanced Toolbar - Responsive -->
    <div class="bg-white rounded-2xl shadow-lg p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border border-gray-100">
      <div class="flex flex-wrap gap-2 w-full sm:w-auto">
        <button @click="addActivity"
          class="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 md:px-4 py-2.5 rounded-xl text-xs font-bold hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 flex-1 sm:flex-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Activity
        </button>
        <button @click="saveGrades" :disabled="saving"
          class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 md:px-4 py-2.5 rounded-xl text-xs font-bold hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2 flex-1 sm:flex-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {{ saving ? 'Saving...' : 'Save Scores' }}
        </button>
        <button @click="computeGrades" :disabled="computing"
          class="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 md:px-4 py-2.5 rounded-xl text-xs font-bold hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2 flex-1 sm:flex-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {{ computing ? 'Computing...' : 'Compute OBE Grades' }}
        </button>
      </div>
      
      <div class="relative w-full sm:w-56">
        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" placeholder="Search student..."
          class="border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm" />
      </div>
    </div>

    <!-- Loading indicator with animation -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-400 text-sm font-inria">Loading OBE gradebook…</p>
    </div>

    <!-- Grading Table - Enhanced Design with fixed layout -->
    <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full border-collapse text-sm table-fixed">
            <thead>
              <!-- ROW 1: Course Outcomes with OBE styling -->
              <tr>
                <th rowspan="3"
                  class="sticky left-0 z-30 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 px-2 py-3 text-center font-black text-white text-xs uppercase tracking-wider w-[40px]"
                  style="width:40px">#</th>
                <th rowspan="3"
                  class="sticky left-[40px] z-30 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 px-4 py-3 text-left font-black text-white text-xs uppercase tracking-wider w-[200px]"
                  style="width:200px">
                  Student Name
                  <svg class="w-3 h-3 inline ml-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </th>
                <th v-for="group in coGroups" :key="'hdr-' + group.co_code" :colspan="group.activities.length || 1"
                  class="border border-gray-300 px-2 py-2 text-center font-black text-white text-xs uppercase tracking-wider"
                  :style="{ backgroundColor: group.color, borderColor: group.color, width: (group.activities.length * 100) + 'px' }">
                  <div class="flex items-center justify-center gap-1 truncate">
                    <span class="truncate">{{ group.co_code }}</span>
                  </div>
                </th>
              </tr>

              <!-- ROW 2: Task names with better styling -->
              <tr>
                <template v-for="group in coGroups">
                  <td v-for="act in group.activities" :key="'task-' + act.localId"
                    class="border border-gray-200 bg-gray-50 px-1 py-2 text-center"
                    :style="{ width: '100px' }">
                    <input v-model="act.name"
                      class="w-full text-center text-xs font-bold text-gray-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-orange-400 rounded px-1 uppercase truncate"
                      placeholder="TASK" />
                  </td>
                  <td v-if="group.activities.length === 0" :key="'task-empty-' + group.co_code"
                    class="border border-gray-200 text-center text-xs text-white font-bold bg-gray-300 px-2 py-2"
                    :style="{ width: '100px' }">—</td>
                </template>
              </tr>

              <!-- ROW 3: Max Score with better design -->
              <tr>
                <template v-for="group in coGroups">
                  <td v-for="act in group.activities" :key="'max-' + act.localId"
                    class="border border-gray-200 bg-orange-50 px-1 py-2 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <span class="text-[9px] font-bold text-orange-500 shrink-0">MAX</span>
                      <input type="number" v-model.number="act.maxScore"
                        class="w-14 text-center text-xs font-black text-orange-600 bg-white border border-orange-200 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="100" />
                    </div>
                  </td>
                  <td v-if="group.activities.length === 0" :key="'max-empty-' + group.co_code"
                    class="border border-gray-200 bg-gray-100 px-2 py-2"
                    :style="{ width: '100px' }"></td>
                </template>
              </tr>
            </thead>
            
            <tbody>
              <tr v-for="(student, idx) in filteredStudents" :key="student.studid"
                :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'" 
                class="hover:bg-orange-50/50 transition-colors group">

                <td class="sticky left-0 z-10 border border-gray-200 px-2 py-2.5 text-center text-xs font-bold text-gray-500"
                  :class="idx % 2 === 0 ? 'bg-white group-hover:bg-orange-50/50' : 'bg-gray-50/50 group-hover:bg-orange-50/50'">
                  {{ idx + 1 }}
                </td>
                <td class="sticky left-[40px] z-10 border border-gray-200 px-4 py-2.5 font-medium whitespace-nowrap text-gray-700 truncate"
                  :class="idx % 2 === 0 ? 'bg-white group-hover:bg-orange-50/50' : 'bg-gray-50/50 group-hover:bg-orange-50/50'">
                  {{ student.studlastname }}, {{ student.studfirstname }}
                </td>

                <template v-for="group in coGroups">
                  <td v-for="act in group.activities" :key="'sc-' + act.localId + '-' + student.studid"
                    class="border border-gray-200 text-center p-0 relative">
                    <input
                      type="number"
                      v-model.number="student.scores[act.localId]"
                      :max="act.maxScore"
                      :min="0"
                      @input="clampScore(student, act.localId, act.maxScore)"
                      class="w-full py-2.5 px-1 text-sm text-center bg-transparent focus:outline-none focus:bg-white focus:shadow-inner focus:text-orange-600 transition-all truncate"
                      :class="{
                        'text-green-600 font-semibold': student.scores[act.localId] >= (act.maxScore * 0.75),
                        'text-orange-600': student.scores[act.localId] >= (act.maxScore * 0.5) && student.scores[act.localId] < (act.maxScore * 0.75),
                        'text-red-500': student.scores[act.localId] < (act.maxScore * 0.5) && student.scores[act.localId] > 0
                      }" />
                    <!-- Over-limit warning indicator -->
                    <span
                      v-if="student.scores[act.localId] > act.maxScore"
                      class="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"
                      :title="'Max allowed: ' + act.maxScore">
                    </span>
                  </td>
                  <td v-if="group.activities.length === 0" :key="'sc-empty-' + group.co_code + '-' + student.studid"
                    class="border border-gray-200 bg-gray-100/50" :style="{ width: '100px' }"></td>
                </template>

              </tr>

              <!-- Empty state with OBE theme -->
              <tr v-if="filteredStudents.length === 0">
                <td :colspan="totalColumns + 2" class="text-center py-16">
                  <div class="flex flex-col items-center">
                    <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p class="text-gray-400 text-sm italic mb-2">No students found matching your search</p>
                    <p class="text-xs text-gray-300">Add students to the class record to begin OBE assessment</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- OBE Legend - Responsive -->
    <div class="mt-4 flex flex-wrap gap-4 justify-end text-xs">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-green-500 rounded-full"></span>
        <span class="text-gray-500">Excellent (≥75%)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-orange-400 rounded-full"></span>
        <span class="text-gray-500">Fair (50-74%)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-red-500 rounded-full"></span>
        <span class="text-gray-500">Needs Improvement (&lt;50%)</span>
      </div>
    </div>

    <!-- Add Activity Modal - Enhanced Design -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all animate-slideIn">
        <div class="mb-6">
          <h3 class="text-xl font-epundaslab font-bold text-gray-800">Add OBE Activity</h3>
          <p class="text-xs text-gray-400">Create a new assessment task</p>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Course Outcome</label>
            <select v-model="newActivity.co_code" @change="onAddActivityCoChange"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50">
              <option v-for="co in outcomes" :key="co.co_code" :value="co.co_code">{{ co.co_code }}</option>
            </select>
          </div>
          
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Task Name</label>
            <input v-model="newActivity.name" placeholder="e.g. Quiz 1, Exam, Project"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50" />
          </div>
          
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Assessment Type</label>
            <select v-model="newActivity.type_id"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50">
              <option v-for="t in filteredAssessmentTypes" :key="t.type_id" :value="t.type_id">
                {{ t.code }} — {{ t.name }}
              </option>
            </select>
            <p v-if="filteredAssessmentTypes.length === 0" class="text-xs text-red-500 mt-2 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No assessment types configured for this CO
            </p>
          </div>
          
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Max Score</label>
            <input type="number" v-model.number="newActivity.maxScore"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50" />
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-8">
          <button @click="showAddModal = false"
            class="px-6 py-3 text-sm text-gray-400 font-bold hover:text-gray-600 transition-colors">
            Cancel
          </button>
          <button @click="confirmAddActivity"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-sm font-bold hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all">
            Add Activity
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
/*
 * ═══════════════════════════════════════════════════════════════
 * TRANSMUTATION TABLE — must match backend shared/transmutation-table.ts
 * Used ONLY for instant local preview while the teacher types scores.
 * The authoritative grade comes from POST /class-activity/compute-grades.
 * ═══════════════════════════════════════════════════════════════
 */
var TRANSMUTATION = [
  { min: 97, grade: 1.00 },
  { min: 93, grade: 1.25 },
  { min: 89, grade: 1.50 },
  { min: 85, grade: 1.75 },
  { min: 80, grade: 2.00 },
  { min: 75, grade: 2.25 },
  { min: 70, grade: 2.50 },
  { min: 65, grade: 2.75 },
  { min: 60, grade: 3.00 },
]

export default {
  name: 'GradingSheet',

  props: {
    activeSubject: { type: Object, default: null },
    outcomes: { type: Array, default: function () { return [] } },
    students: { type: Array, default: function () { return [] } },
    assessmentTypes: { type: Array, default: function () { return [] } },
  },

  data: function () {
    return {
      searchQuery: '',
      showAddModal: false,
      newActivity: { co_code: '', name: '', type_id: null, maxScore: 100 },

      // ── Core state ─────────────────────────────────────────
      activitiesMap: {},     // { CO1: [{ localId, activity_id, name, co_id, type_id, type_code, maxScore }] }
      localStudents: [],     // [{ masterlist_id, studid, studlastname, studfirstname, scores: { localId: value } }]
      computedGrades: {},    // { studid: { grade, total, remarks } } — from backend compute

      idCounter: 1,
      loading: false,
      saving: false,
      computing: false,

      coColors: [
        '#22c55e', '#14b8a6', '#3b82f6', '#a855f7',
        '#ec4899', '#f97316', '#ef4444', '#6366f1',
      ],
    }
  },

  computed: {
    /* ── Parent context (Nuxt 2 page component) ─────────── */
    empid: function () {
      return this.$parent && this.$parent.user ? this.$parent.user.empid : null
    },
    sy: function () {
      return (this.$parent && this.$parent.selectedYear) || '2025-2026'
    },
    sem: function () {
      return (this.$parent && this.$parent.selectedSemester) || '1st'
    },
    section: function () {
      if (!this.activeSubject) return ''
      return (this.activeSubject.section || this.activeSubject.sect || '').trim()
    },
    subjcode: function () {
      return this.activeSubject ? this.activeSubject.subjcode : ''
    },

    /* ── Lookup maps ────────────────────────────────────────── */
    coIdToCode: function () {
      var m = {}
        ; (this.outcomes || []).forEach(function (co) { m[co.co_id] = co.co_code })
      return m
    },
    coCodeToId: function () {
      var m = {}
        ; (this.outcomes || []).forEach(function (co) { m[co.co_code] = co.co_id })
      return m
    },
    typeIdToCode: function () {
      var m = {}
        ; (this.assessmentTypes || []).forEach(function (t) { m[t.type_id] = t.code })
      return m
    },

    /* ── TOS-aware type filter ─────────────────────────────── */
    // Builds { CO1: [1, 3], CO2: [2, 4] } from outcomes.tosWeights
    // So the Add Activity modal only shows types that have a weight defined
    validTypesPerCo: function () {
      var m = {}
        ; (this.outcomes || []).forEach(function (co) {
          var typeIds = []
            ; (co.tosWeights || []).forEach(function (tw) {
              if (tw.type_id && typeIds.indexOf(tw.type_id) === -1) {
                typeIds.push(tw.type_id)
              }
            })
          m[co.co_code] = typeIds
        })
      return m
    },

    // Filtered assessment types for the currently selected CO in the Add Activity modal
    filteredAssessmentTypes: function () {
      var coCode = this.newActivity.co_code
      var validIds = this.validTypesPerCo[coCode]

      // If no TOS weights defined yet, show all types (graceful fallback)
      if (!validIds || validIds.length === 0) return this.assessmentTypes

      return (this.assessmentTypes || []).filter(function (t) {
        return validIds.indexOf(t.type_id) !== -1
      })
    },

    /* ── Table structure ───────────────────────────────────── */
    coGroups: function () {
      var self = this
      return (this.outcomes || []).map(function (co, idx) {
        return {
          co_id: co.co_id,
          co_code: co.co_code,
          color: self.coColors[idx % self.coColors.length],
          activities: self.activitiesMap[co.co_code] || [],
        }
      })
    },
    totalColumns: function () {
      return this.coGroups.reduce(function (sum, g) {
        return sum + Math.max(g.activities.length, 1)
      }, 0)
    },
    filteredStudents: function () {
      if (!this.searchQuery) return this.localStudents
      var q = this.searchQuery.toLowerCase()
      return this.localStudents.filter(function (s) {
        return (s.studlastname || '').toLowerCase().indexOf(q) !== -1 ||
          (s.studfirstname || '').toLowerCase().indexOf(q) !== -1 ||
          (s.studid || '').toLowerCase().indexOf(q) !== -1
      })
    },
  },

  watch: {
    /* Reload when the teacher switches subjects */
    activeSubject: {
      immediate: true,
      handler: function (val) {
        if (val && val.subjcode) {
          this.loadGradebook()
        }
      },
    },
    /* Use prop students as fallback when backend returns nothing */
    students: {
      immediate: true,
      handler: function (val) {
        if (val && val.length && !this.localStudents.length) {
          this.localStudents = val.map(function (s) {
            return Object.assign({}, s, { scores: s.scores ? Object.assign({}, s.scores) : {} })
          })
        }
      },
    },
  },

  methods: {

    /* ══════════════════════════════════════════════════════════
     * CLAMP SCORE — prevents entering a value above maxScore or below 0.
     * Called via @input on every student score cell.
     * Uses this.$set to ensure Vue 2 reactivity is triggered.
     * ══════════════════════════════════════════════════════════ */
    clampScore: function (student, localId, maxScore) {
      var raw = student.scores[localId]

      // Nothing entered yet — leave it alone
      if (raw === null || raw === undefined || raw === '') return

      var val = Number(raw)

      // If below 0, snap to 0
      if (val < 0) {
        this.$set(student.scores, localId, 0)
        return
      }

      // If above maxScore, snap back to maxScore
      if (val > maxScore) {
        this.$set(student.scores, localId, maxScore)
      }
    },


    /* ══════════════════════════════════════════════════════════
     * 1. LOAD — GET /class-activity/sheet/raw-score
     *
     * Backend returns per student:
     *   { masterlist_id, studid, student_name: "LASTNAME, FIRSTNAME",
     *     scores: [{ activity_id, activity_name, co_id, type_id, max_score, score }] }
     *
     * We convert this into:
     *   activitiesMap  — activities grouped by CO code
     *   localStudents  — students with scores keyed by localId
     * ══════════════════════════════════════════════════════════ */
    loadGradebook: async function () {
      if (!this.subjcode || !this.section) return
      this.loading = true
      var self = this
      try {
        var res = await this.$axios.get('/class-activity/sheet/raw-score', {
          params: { subjcode: this.subjcode, section: this.section, sy: this.sy, sem: this.sem },
        })
        var data = res.data

        if (!data || !data.length) {
          // No activities yet — use prop students with empty scores
          this.localStudents = (this.students || []).map(function (s) {
            return Object.assign({}, s, { scores: {} })
          })
          this.activitiesMap = {}
          return
        }

        // ── Build activitiesMap from the first student's score columns ──
        var activityList = data[0].scores || []
        var newMap = {}

        activityList.forEach(function (act) {
          var coCode = self.coIdToCode[act.co_id] || 'UNASSIGNED'
          var localId = 'a_' + act.activity_id

          if (!newMap[coCode]) newMap[coCode] = []
          var exists = newMap[coCode].some(function (a) { return a.localId === localId })
          if (!exists) {
            newMap[coCode].push({
              localId: localId,
              activity_id: act.activity_id,
              name: act.activity_name,
              co_id: act.co_id,
              type_id: act.type_id,
              type_code: self.typeIdToCode[act.type_id] || '',
              maxScore: act.max_score,
            })
          }
        })
        this.activitiesMap = newMap

        // ── Build localStudents with score map keyed by localId ──
        this.localStudents = data.map(function (row) {
          var scores = {}
            ; (row.scores || []).forEach(function (sc) {
              if (sc.score !== null && sc.score !== undefined) {
                scores['a_' + sc.activity_id] = sc.score
              }
            })
          // Backend returns "LASTNAME, FIRSTNAME"
          var parts = (row.student_name || '').split(', ')
          return {
            masterlist_id: row.masterlist_id,
            studid: row.studid,
            studlastname: parts[0] || '',
            studfirstname: parts.slice(1).join(', ') || '',
            scores: scores,
          }
        })

        // Clear stale computed grades
        this.computedGrades = {}
      } catch (err) {
        console.error('Failed to load gradebook:', err)
        this.localStudents = (this.students || []).map(function (s) {
          return Object.assign({}, s, { scores: {} })
        })
      } finally {
        this.loading = false
      }
    },


    /* ══════════════════════════════════════════════════════════
     * 2. SAVE — POST /class-activity/save-gradebook
     *
     * Activities are grouped by assessment type code ("category")
     * because the DTO sets category once per batch.
     * Each activity carries its own co_id + type_id for the
     * OBE computation pipeline.
     * ══════════════════════════════════════════════════════════ */
    saveGrades: async function () {
      if (!this.subjcode) return
      this.saving = true
      var self = this

      try {
        // Flatten all activities across CO groups
        var allActivities = this.coGroups.reduce(function (arr, g) {
          return arr.concat(g.activities)
        }, [])

        if (!allActivities.length) {
          alert('No activities to save.')
          this.saving = false
          return
        }

        // Group by type_code → becomes the DTO "category" field
        var byCategory = {}
        allActivities.forEach(function (act) {
          var cat = act.type_code || 'MISC'
          if (!byCategory[cat]) byCategory[cat] = []
          byCategory[cat].push(act)
        })

        var categories = Object.keys(byCategory)
        for (var i = 0; i < categories.length; i++) {
          var category = categories[i]
          var acts = byCategory[category]

          var payload = {
            subjcode: self.subjcode,
            section: self.section,
            sy: self.sy,
            sem: self.sem,
            category: category,
            empid: self.empid,
            activities: acts.map(function (act) {
              return {
                activity_id: act.activity_id || undefined,
                name: act.name,
                maxScore: act.maxScore,
                co_id: act.co_id,
                type_id: act.type_id,
                scores: self.localStudents.map(function (s) {
                  return {
                    studentId: s.studid,
                    score: s.scores[act.localId] != null ? s.scores[act.localId] : 0,
                  }
                }),
              }
            }),
          }

          await self.$axios.post('/class-activity/save-gradebook', payload)
        }

        alert('Scores saved successfully!')
        // Reload to pick up backend-assigned activity_ids for newly created activities
        await this.loadGradebook()
      } catch (err) {
        console.error('Failed to save:', err)
        alert('Error saving scores. Check console for details.')
      } finally {
        this.saving = false
      }
    },


    /* ══════════════════════════════════════════════════════════
     * 3. COMPUTE — POST /class-activity/compute-grades
     *
     * Triggers the full backend OBE pipeline:
     *   RAW SCORE → % RATING → WEIGHTED % RATING → FINAL GRADE
     *
     * Returns per student:
     *   { studid, final_numerical_grade, total_weighted_percent, remarks, ... }
     * ══════════════════════════════════════════════════════════ */
    computeGrades: async function () {
      if (!this.empid || !this.subjcode) return
      this.computing = true

      try {
        var res = await this.$axios.post('/class-activity/compute-grades', {
          empid: this.empid,
          subjcode: this.subjcode,
          section: this.section,
          sy: this.sy,
          sem: this.sem,
        })
        var data = res.data

        var grades = {}
          ; (data || []).forEach(function (row) {
            grades[row.studid] = {
              grade: row.final_numerical_grade,
              total: row.total_weighted_percent,
              remarks: row.remarks,
              co_results: row.co_results || [],
            }
          })
        this.computedGrades = grades

        alert('Final grades computed and saved!')
      } catch (err) {
        console.error('Failed to compute grades:', err)
        alert('Error computing grades. Make sure TOS weights are configured in Syllabus Setup.')
      } finally {
        this.computing = false
      }
    },


    /* ══════════════════════════════════════════════════════════
     * 4. ADD ACTIVITY — modal
     * ══════════════════════════════════════════════════════════ */
    addActivity: function () {
      if (!this.outcomes || !this.outcomes.length) {
        alert('Please set up Course Outcomes in Syllabus Setup first.')
        return
      }
      var firstCo = this.outcomes[0].co_code
      var validTypes = this.validTypesPerCo[firstCo] || []
      var firstTypeId = validTypes.length > 0 ? validTypes[0] : null

      this.newActivity = {
        co_code: firstCo,
        name: '',
        type_id: firstTypeId,
        maxScore: 100,
      }
      this.showAddModal = true
    },

    // When teacher changes the CO dropdown, reset type_id to first valid type
    onAddActivityCoChange: function () {
      var coCode = this.newActivity.co_code
      var validTypes = this.validTypesPerCo[coCode] || []
      this.newActivity.type_id = validTypes.length > 0 ? validTypes[0] : null
    },

    confirmAddActivity: function () {
      if (!this.newActivity.co_code || !this.newActivity.name || !this.newActivity.type_id) return

      var co_code = this.newActivity.co_code
      var type = null
      for (var i = 0; i < this.assessmentTypes.length; i++) {
        if (this.assessmentTypes[i].type_id === this.newActivity.type_id) {
          type = this.assessmentTypes[i]
          break
        }
      }

      if (!this.activitiesMap[co_code]) {
        this.$set(this.activitiesMap, co_code, [])
      }

      this.activitiesMap[co_code].push({
        localId: 'new_' + this.idCounter++,
        activity_id: null,   // new — backend assigns ID on first save
        name: this.newActivity.name,
        co_id: this.coCodeToId[co_code] || null,
        type_id: this.newActivity.type_id,
        type_code: type ? type.code : '',
        maxScore: this.newActivity.maxScore,
      })

      this.showAddModal = false
    },
  },
}
</script>

<style scoped>
table {
  border-spacing: 0;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>