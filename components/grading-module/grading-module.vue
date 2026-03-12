<template>
  <div class="font-inria min-h-screen bg-gray-50 p-4">

    <!-- Toolbar -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-4 flex flex-wrap gap-2 items-center justify-between">
      <div class="flex flex-wrap gap-2">
        <button @click="addActivity"
          class="bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-green-800">
          + Add Activity
        </button>
        <button @click="saveGrades" :disabled="saving"
          class="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50">
          {{ saving ? 'Saving...' : 'Save Scores' }}
        </button>
        <button @click="computeGrades" :disabled="computing"
          class="bg-black text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-orange-600 disabled:opacity-50">
          {{ computing ? 'Computing...' : 'Compute & Save Grades' }}
        </button>
      </div>
      <input v-model="searchQuery" placeholder="Search student..."
        class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-green-400" />
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="text-center py-12 text-gray-400 text-sm">Loading gradebook…</div>

    <!-- Grading Table -->
    <div v-else class="bg-white rounded-xl shadow border border-gray-200 overflow-auto">
      <table class="border-collapse text-sm" style="min-width: max-content;">
        <thead>

          <!-- ROW 1: Course Outcomes -->
          <tr>
            <th rowspan="3"
              class="sticky left-0 z-30 bg-yellow-300 border border-gray-400 px-2 py-1 text-center font-black text-gray-800"
              style="min-width:40px">No.</th>
            <th rowspan="3"
              class="sticky left-[40px] z-30 bg-yellow-300 border border-gray-400 px-4 py-1 text-left font-black text-gray-800"
              style="min-width:220px">
              Student Name <span class="text-gray-500 font-normal">▼</span>
            </th>
            <th v-for="group in coGroups" :key="'hdr-' + group.co_code" :colspan="group.activities.length || 1"
              class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs"
              :style="{ backgroundColor: group.color }">
              {{ group.co_code }}
            </th>
            <th rowspan="3"
              class="bg-gray-700 text-white border border-gray-400 px-3 py-1 text-center font-black text-xs"
              style="min-width:120px">FINAL<br />GRADE</th>
          </tr>

          <!-- ROW 2: Task names -->
          <tr>
            <template v-for="group in coGroups">
              <td v-for="act in group.activities" :key="'task-' + act.localId"
                class="border border-gray-300 bg-gray-50 px-1 py-0.5 text-center" style="min-width:100px">
                <input v-model="act.name"
                  class="w-full text-center text-xs font-bold text-gray-700 bg-transparent focus:outline-none uppercase"
                  placeholder="Task" />
              </td>
              <td v-if="group.activities.length === 0" :key="'task-empty-' + group.co_code"
                class="border border-gray-300 text-center text-xs text-white font-bold opacity-60"
                :style="{ backgroundColor: group.color, minWidth: '100px' }">—
              </td>
            </template>
          </tr>

          <!-- ROW 3: Max Score -->
          <tr>
            <template v-for="group in coGroups">
              <td v-for="act in group.activities" :key="'max-' + act.localId"
                class="border border-gray-300 bg-green-50 px-1 py-0.5 text-center">
                <input type="number" v-model.number="act.maxScore"
                  class="w-14 text-center text-xs font-black text-green-700 bg-transparent focus:outline-none"
                  placeholder="Max" />
              </td>
              <td v-if="group.activities.length === 0" :key="'max-empty-' + group.co_code"
                class="border border-gray-300 text-center text-xs text-white font-bold opacity-40"
                :style="{ backgroundColor: group.color, minWidth: '100px' }"></td>
            </template>
          </tr>

        </thead>
        <tbody>
          <tr v-for="(student, idx) in filteredStudents" :key="student.studid"
            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'" class="hover:bg-yellow-50 transition-colors">

            <td
              class="sticky left-0 z-10 border border-gray-200 px-2 py-1.5 text-center text-xs font-bold text-gray-500"
              :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
              {{ idx + 1 }}
            </td>
            <td
              class="sticky left-[40px] z-10 border border-gray-200 px-4 py-1.5 font-medium whitespace-nowrap text-gray-800"
              :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
              {{ student.studlastname }}, {{ student.studfirstname }}
            </td>

            <template v-for="group in coGroups">
              <td v-for="act in group.activities" :key="'sc-' + act.localId + '-' + student.studid"
                class="border border-gray-200 text-center p-0">
                <input type="number" v-model.number="student.scores[act.localId]" :max="act.maxScore"
                  class="w-full text-center py-1.5 px-1 text-sm bg-transparent focus:outline-none focus:bg-blue-50" />
              </td>
              <td v-if="group.activities.length === 0" :key="'sc-empty-' + group.co_code + '-' + student.studid"
                class="border border-gray-200 bg-gray-100" style="min-width:100px"></td>
            </template>

            <td class="border border-gray-200 text-center font-black text-sm px-2" :class="getFinalGradeClass(student)">
              <div>{{ displayGrade(student) }}</div>
              <div v-if="displayRemarks(student)" class="text-[10px] font-bold mt-0.5"
                :class="displayRemarks(student) === 'INC' ? 'text-red-600' : displayRemarks(student) === 'PASSED' ? 'text-green-600' : 'text-red-500'">
                {{ displayRemarks(student) }}
              </div>
            </td>
          </tr>

          <tr v-if="filteredStudents.length === 0">
            <td :colspan="totalColumns + 3" class="text-center py-12 text-gray-400 text-sm italic">
              No students found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Activity Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <h3 class="font-black text-gray-800 text-lg mb-4 uppercase">Add Activity</h3>
        <div class="space-y-3">
          <div>
            <label class="text-xs font-black text-gray-400 uppercase block mb-1">Course Outcome</label>
            <select v-model="newActivity.co_code" @change="onAddActivityCoChange"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
              <option v-for="co in outcomes" :key="co.co_code" :value="co.co_code">{{ co.co_code }}</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-black text-gray-400 uppercase block mb-1">Task Name</label>
            <input v-model="newActivity.name" placeholder="e.g. Quiz 1"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label class="text-xs font-black text-gray-400 uppercase block mb-1">Assessment Type</label>
            <!-- Only shows types that have a TOS weight for the selected CO -->
            <select v-model="newActivity.type_id"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
              <option v-for="t in filteredAssessmentTypes" :key="t.type_id" :value="t.type_id">
                {{ t.code }} — {{ t.name }}
              </option>
            </select>
            <p v-if="filteredAssessmentTypes.length === 0" class="text-xs text-red-500 mt-1">
              No assessment types configured for this CO. Set them up in Syllabus Setup first.
            </p>
          </div>
          <div>
            <label class="text-xs font-black text-gray-400 uppercase block mb-1">Max Score</label>
            <input type="number" v-model.number="newActivity.maxScore"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-5">
          <button @click="showAddModal = false"
            class="px-4 py-2 text-sm text-gray-400 font-bold uppercase">Cancel</button>
          <button @click="confirmAddActivity"
            class="px-6 py-2 bg-green-700 text-white rounded-lg text-sm font-black hover:bg-green-800 uppercase">
            Add
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
     * 4. GRADE DISPLAY — AUTO-COMPUTE (matches Excel pipeline)
     *
     * Computes grades live as the teacher types, using TOS weights
     * from the outcomes prop. No button click needed.
     *
     * Pipeline: RAW SCORE → % RATING → WEIGHTED % RATING → FINAL GRADE
     * ══════════════════════════════════════════════════════════ */

    /**
     * Build per-activity weight map from TOS weights.
     * TOS defines weight per CO×Type cell. We distribute equally
     * among activities in each cell, matching the Excel.
     */
    getActivityWeights: function () {
      var outcomes = this.outcomes || []
      var coGroups = this.coGroups
      var weights = {} // { localId: weight% }

      for (var i = 0; i < outcomes.length; i++) {
        var co = outcomes[i]
        var coCode = co.co_code
        var tosWeights = co.tosWeights || []

        // Find activities for this CO
        var coActivities = []
        for (var g = 0; g < coGroups.length; g++) {
          if (coGroups[g].co_code === coCode) {
            coActivities = coGroups[g].activities
            break
          }
        }

        for (var t = 0; t < tosWeights.length; t++) {
          var tw = tosWeights[t]
          var twWeight = tw.weight_percentage

          // Auto-detect old decimal format (0.10 for 10%) vs whole number (10)
          if (twWeight > 0 && twWeight < 1) twWeight = twWeight * 100

          // Find activities matching this type_id within this CO
          var matching = []
          for (var a = 0; a < coActivities.length; a++) {
            if (coActivities[a].type_id === tw.type_id) {
              matching.push(coActivities[a])
            }
          }

          if (matching.length === 0) continue

          // Distribute weight equally
          var perActivity = twWeight / matching.length
          for (var m = 0; m < matching.length; m++) {
            var lid = matching[m].localId
            weights[lid] = (weights[lid] || 0) + perActivity
          }
        }
      }
      return weights
    },

    /**
     * Auto-compute grade for a student using TOS weights.
     * Returns { grade: number, remarks: string, coResults: [...] }
     */
    autoComputeStudent: function (student) {
      var actWeights = this.getActivityWeights()
      var coGroups = this.coGroups
      var outcomes = this.outcomes || []

      // Per-activity weighted values
      var weightedByActivity = {} // { localId: weightedValue }
      var allActivities = []
      for (var g = 0; g < coGroups.length; g++) {
        for (var a = 0; a < coGroups[g].activities.length; a++) {
          allActivities.push(coGroups[g].activities[a])
        }
      }

      if (allActivities.length === 0) return null

      for (var i = 0; i < allActivities.length; i++) {
        var act = allActivities[i]
        var w = actWeights[act.localId] || 0
        if (w === 0) continue

        var raw = student.scores[act.localId] || 0
        var max = act.maxScore || 0
        var pctRating = max > 0 ? (raw / max) * 100 : 0

        // Excel: ((raw/max)*100) * weight%  (% operator = /100)
        weightedByActivity[act.localId] = (pctRating * w) / 100
      }

      // Per-CO sums + pass check
      var coResults = []
      var allCosPassed = true

      for (var c = 0; c < outcomes.length; c++) {
        var co = outcomes[c]
        var coCode = co.co_code

        // Find activities for this CO
        var coActs = []
        for (var g2 = 0; g2 < coGroups.length; g2++) {
          if (coGroups[g2].co_code === coCode) {
            coActs = coGroups[g2].activities
            break
          }
        }

        // Sum weighted values for this CO
        var coSum = 0
        var coMaxWeight = 0
        for (var a2 = 0; a2 < coActs.length; a2++) {
          var lid = coActs[a2].localId
          coSum += weightedByActivity[lid] || 0
          coMaxWeight += actWeights[lid] || 0
        }

        // Excel threshold: (maxWeight * 0.6) - 0.01
        // CO with no activities: threshold = -0.01, sum = 0 → 0 > -0.01 → PASSED
        var threshold = (coMaxWeight * 0.6) - 0.01
        var passed = coSum > threshold

        if (!passed) allCosPassed = false

        coResults.push({
          co_code: coCode,
          sum: Math.round(coSum * 100) / 100,
          maxWeight: Math.round(coMaxWeight * 100) / 100,
          passed: passed,
        })
      }

      // Total + transmutation
      var total = 0
      for (var r = 0; r < coResults.length; r++) {
        total += coResults[r].sum
      }
      var totalRounded = Math.round(total)

      // VLOOKUP transmutation
      var grade = 5.00
      for (var t = 0; t < TRANSMUTATION.length; t++) {
        if (totalRounded >= TRANSMUTATION[t].min) {
          grade = TRANSMUTATION[t].grade
          break
        }
      }

      // Remarks: PASSED / INC / FAILED
      var remarks = 'FAILED'
      if (grade <= 3.00) {
        remarks = allCosPassed ? 'PASSED' : 'INC'
      }

      return { grade: grade, remarks: remarks, total: totalRounded, coResults: coResults }
    },

    displayGrade: function (student) {
      // Backend-computed grade takes priority (persisted)
      var computed = this.computedGrades[student.studid]
      if (computed && computed.grade != null) {
        return computed.grade.toFixed(2)
      }
      // Auto-compute locally using TOS weights
      var result = this.autoComputeStudent(student)
      if (result) return result.grade.toFixed(2)
      return '—'
    },

    displayRemarks: function (student) {
      var computed = this.computedGrades[student.studid]
      if (computed && computed.remarks) {
        return computed.remarks
      }
      // Auto-compute locally
      var result = this.autoComputeStudent(student)
      if (result) return result.remarks
      return ''
    },

    getFinalGradeClass: function (student) {
      var g = this.displayGrade(student)
      if (g === '—') return 'text-gray-400'
      var remarks = this.displayRemarks(student)
      if (remarks === 'INC') return 'text-red-700 bg-red-50'
      return parseFloat(g) <= 3.00 ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'
    },


    /* ══════════════════════════════════════════════════════════
     * 5. ADD ACTIVITY — modal
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