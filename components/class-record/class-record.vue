<template>
    <div class="font-inria p-4 md:p-8 bg-gray-50 min-h-screen">
        <success-message ref="msg" />

        <div class="mb-6">
            <h1 class="text-3xl font-bold font-epundaslab text-green-900">Class Record</h1>
            <p class="text-sm text-gray-500">View OBE computed grades — Raw Scores, Ratings, and Final Grades</p>
        </div>

        <!-- Year / Semester Picker -->
        <div
            class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-end gap-4">
            <div class="w-full md:w-64">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Academic
                    Year</label>
                <select v-model="selectedYear"
                    class="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    <option value="" disabled>Select Year</option>
                    <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
            <div class="w-full md:w-64">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Semester</label>
                <select v-model="selectedSemester"
                    class="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    <option value="" disabled>Select Semester</option>
                    <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
                </select>
            </div>
            <button @click="loadSubjects" :disabled="loading"
                class="h-10 px-6 bg-green-700 text-white rounded-lg hover:bg-green-800 text-sm font-bold disabled:opacity-50">
                {{ loading ? 'Loading...' : 'Load Subjects' }}
            </button>
            <button v-if="activeSubject" @click="activeSubject = null; gradeData = []"
                class="h-10 px-6 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm font-bold">
                Close Record
            </button>
        </div>

        <!-- Subject Cards -->
        <div v-if="!activeSubject && subjects.length === 0 && !loading"
            class="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            No class records found. Please select a Year and Semester.
        </div>

        <div v-if="!activeSubject && subjects.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <div v-for="(subject, index) in subjects" :key="index" @click="openRecord(subject)"
                class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md group">
                <div class="bg-green-700 p-4 border-b">
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-white text-lg">{{ subject.subjcode }}</h3>
                        <span class="bg-white text-green-700 text-xs px-2 py-1 rounded font-bold">{{ subject.section
                            }}</span>
                    </div>
                    <p class="text-sm text-green-100 mt-1 truncate">{{ subject.description }}</p>
                    <p class="text-xs text-green-200 mt-2"><span class="font-bold">Instructor:</span> {{
                        subject.instructor }}</p>
                </div>
                <div class="p-4 flex justify-between items-center text-sm text-gray-500">
                    <span>{{ subject.students.length }} Students</span>
                    <span class="text-green-700 font-semibold group-hover:underline">View Record &rarr;</span>
                </div>
            </div>
        </div>

        <!-- Active Record View -->
        <div v-if="activeSubject" class="animate-fade-in">

            <!-- Record Header -->
            <div
                class="bg-green-800 text-white rounded-t-xl px-5 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
                <div>
                    <h2 class="text-lg font-bold">
                        <span class="bg-green-600 text-xs px-2 py-0.5 rounded mr-2">{{ activeSubject.subjcode }}</span>
                        Section {{ activeSubject.section }}
                    </h2>
                    <p class="text-green-200 text-xs mt-1">Instructor: {{ activeSubject.instructor }}</p>
                </div>
                <div class="flex gap-1 bg-green-900 rounded-lg p-1">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="['px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap',
                        activeTab === tab.id ? 'bg-white text-green-800 shadow' : 'text-green-200 hover:text-white']">
                        {{ tab.label }}
                    </button>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loadingRecord" class="bg-white border border-gray-200 rounded-b-xl p-16 text-center">
                <div
                    class="animate-spin rounded-full h-10 w-10 border-4 border-t-green-600 border-gray-200 mx-auto mb-3">
                </div>
                <p class="text-gray-500 text-sm">Loading class record...</p>
            </div>

            <!-- No Data -->
            <div v-else-if="gradeData.length === 0"
                class="bg-white border border-gray-200 rounded-b-xl p-16 text-center text-gray-400">
                No computed grades found. Grades must be computed in the Grading Module first.
            </div>

            <!-- Table -->
            <div v-else class="bg-white border border-gray-200 rounded-b-xl overflow-hidden">

                <!-- Search -->
                <div class="p-3 border-b flex justify-between items-center bg-gray-50">
                    <input v-model="searchQuery" placeholder="Search student..." type="text"
                        class="w-full max-w-xs px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                    <span class="text-xs text-gray-500">{{ filteredData.length }} students</span>
                </div>

                <div class="overflow-auto" style="max-height: 65vh;">
                    <table class="w-full text-xs border-collapse whitespace-nowrap" style="min-width: max-content;">

                        <!-- ═══════════ RAW SCORE TAB ═══════════ -->
                        <template v-if="activeTab === 'raw'">
                            <thead class="bg-gray-100 sticky top-0 z-20">
                                <tr>
                                    <th rowspan="2"
                                        class="sticky left-0 z-30 bg-yellow-300 border border-gray-400 px-2 py-1 text-center font-black"
                                        style="min-width:40px">No.</th>
                                    <th rowspan="2"
                                        class="sticky left-[40px] z-30 bg-yellow-300 border border-gray-400 px-3 py-1 text-left font-black"
                                        style="min-width:200px">Student Name</th>
                                    <th v-for="co in coHeaders" :key="'rh-' + co.co_code" :colspan="co.count || 1"
                                        class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs"
                                        :style="{ backgroundColor: co.color }">
                                        {{ co.co_code }}
                                    </th>
                                </tr>
                                <tr>
                                    <th v-for="act in activityHeaders" :key="'ra-' + act.activity_id"
                                        class="border border-gray-300 bg-gray-50 px-2 py-1 text-center font-bold text-gray-600"
                                        style="min-width:80px">
                                        <div>{{ act.activity_name }}</div>
                                        <div class="text-green-600 font-black">{{ act.max_score }}</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, idx) in filteredData" :key="'r-' + row.studid"
                                    :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                    <td class="sticky left-0 z-10 border border-gray-200 px-2 py-1.5 text-center font-bold text-gray-400"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ idx + 1 }}</td>
                                    <td class="sticky left-[40px] z-10 border border-gray-200 px-3 py-1.5 font-medium text-gray-800"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ row.student_name }}</td>
                                    <td v-for="rs in row.raw_scores" :key="'rs-' + rs.activity_id + row.studid"
                                        class="border border-gray-200 text-center py-1.5 text-sm">
                                        {{ rs.score !== null ? rs.score : '' }}
                                    </td>
                                </tr>
                            </tbody>
                        </template>

                        <!-- ═══════════ % RATING TAB ═══════════ -->
                        <template v-if="activeTab === 'percent'">
                            <thead class="bg-gray-100 sticky top-0 z-20">
                                <tr>
                                    <th rowspan="2"
                                        class="sticky left-0 z-30 bg-yellow-300 border border-gray-400 px-2 py-1 text-center font-black"
                                        style="min-width:40px">No.</th>
                                    <th rowspan="2"
                                        class="sticky left-[40px] z-30 bg-yellow-300 border border-gray-400 px-3 py-1 text-left font-black"
                                        style="min-width:200px">Student Name</th>
                                    <th v-for="co in coHeaders" :key="'ph-' + co.co_code" :colspan="co.count || 1"
                                        class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs"
                                        :style="{ backgroundColor: co.color }">
                                        {{ co.co_code }}
                                    </th>
                                </tr>
                                <tr>
                                    <th v-for="act in activityHeaders" :key="'pa-' + act.activity_id"
                                        class="border border-gray-300 bg-gray-50 px-2 py-1 text-center font-bold text-gray-600"
                                        style="min-width:80px">
                                        {{ act.activity_name }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, idx) in filteredData" :key="'p-' + row.studid"
                                    :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                    <td class="sticky left-0 z-10 border border-gray-200 px-2 py-1.5 text-center font-bold text-gray-400"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ idx + 1 }}</td>
                                    <td class="sticky left-[40px] z-10 border border-gray-200 px-3 py-1.5 font-medium text-gray-800"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ row.student_name }}</td>
                                    <td v-for="pr in row.percent_ratings" :key="'pr-' + pr.activity_id + row.studid"
                                        class="border border-gray-200 text-center py-1.5 text-sm"
                                        :class="pr.percent !== null && pr.percent < 60 ? 'text-red-600 font-bold' : ''">
                                        {{ pr.percent !== null ? pr.percent.toFixed(1) + '%' : '' }}
                                    </td>
                                </tr>
                            </tbody>
                        </template>

                        <!-- ═══════════ WEIGHTED % RATING TAB ═══════════ -->
                        <template v-if="activeTab === 'weighted'">
                            <thead class="bg-gray-100 sticky top-0 z-20">
                                <tr>
                                    <th rowspan="2"
                                        class="sticky left-0 z-30 bg-yellow-300 border border-gray-400 px-2 py-1 text-center font-black"
                                        style="min-width:40px">No.</th>
                                    <th rowspan="2"
                                        class="sticky left-[40px] z-30 bg-yellow-300 border border-gray-400 px-3 py-1 text-left font-black"
                                        style="min-width:200px">Student Name</th>
                                    <th v-for="co in coHeaders" :key="'wh-' + co.co_code" :colspan="co.count || 1"
                                        class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs"
                                        :style="{ backgroundColor: co.color }">
                                        {{ co.co_code }} ({{ co.weight }}%)
                                    </th>
                                    <th rowspan="2"
                                        class="bg-gray-700 text-white border border-gray-400 px-3 py-1 text-center font-black"
                                        style="min-width:70px">TOTAL</th>
                                </tr>
                                <tr>
                                    <th v-for="act in activityHeaders" :key="'wa-' + act.activity_id"
                                        class="border border-gray-300 bg-gray-50 px-2 py-1 text-center font-bold text-gray-600"
                                        style="min-width:80px">
                                        <div>{{ act.activity_name }}</div>
                                        <div class="text-blue-600 text-[10px]">{{ act.weight }}%</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, idx) in filteredData" :key="'w-' + row.studid"
                                    :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                    <td class="sticky left-0 z-10 border border-gray-200 px-2 py-1.5 text-center font-bold text-gray-400"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ idx + 1 }}</td>
                                    <td class="sticky left-[40px] z-10 border border-gray-200 px-3 py-1.5 font-medium text-gray-800"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ row.student_name }}</td>
                                    <td v-for="wr in row.weighted_ratings" :key="'wr-' + wr.activity_id + row.studid"
                                        class="border border-gray-200 text-center py-1.5 text-sm">
                                        {{ wr.weighted_value !== undefined ? wr.weighted_value.toFixed(2) : '' }}
                                    </td>
                                    <td class="border border-gray-200 text-center py-1.5 font-black text-sm bg-gray-50">
                                        {{ row.total_weighted_percent }}
                                    </td>
                                </tr>
                            </tbody>
                        </template>

                        <!-- ═══════════ FINAL GRADE TAB ═══════════ -->
                        <template v-if="activeTab === 'final'">
                            <thead class="bg-gray-100 sticky top-0 z-20">
                                <tr>
                                    <th class="sticky left-0 z-30 bg-yellow-300 border border-gray-400 px-2 py-1 text-center font-black"
                                        style="min-width:40px">No.</th>
                                    <th class="sticky left-[40px] z-30 bg-yellow-300 border border-gray-400 px-3 py-1 text-left font-black"
                                        style="min-width:200px">Student Name</th>
                                    <th v-for="co in coResultHeaders" :key="'fh-' + co.co_code" colspan="2"
                                        class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs"
                                        :style="{ backgroundColor: co.color }">
                                        {{ co.co_code }}
                                    </th>
                                    <th class="bg-gray-600 text-white border border-gray-400 px-3 py-1 text-center font-black"
                                        style="min-width:60px">Total</th>
                                    <th class="bg-gray-700 text-white border border-gray-400 px-3 py-1 text-center font-black"
                                        style="min-width:60px">Grade</th>
                                    <th class="bg-gray-800 text-white border border-gray-400 px-3 py-1 text-center font-black"
                                        style="min-width:80px">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, idx) in filteredData" :key="'f-' + row.studid"
                                    :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                    <td class="sticky left-0 z-10 border border-gray-200 px-2 py-2 text-center font-bold text-gray-400"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ idx + 1 }}</td>
                                    <td class="sticky left-[40px] z-10 border border-gray-200 px-3 py-2 font-medium text-gray-800"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ row.student_name }}</td>

                                    <template v-for="cr in row.co_results">
                                        <td :key="'cs-' + cr.co_code + row.studid"
                                            class="border border-gray-200 text-center py-2 text-sm">
                                            {{ cr.sum_weighted.toFixed(1) }}
                                        </td>
                                        <td :key="'cp-' + cr.co_code + row.studid"
                                            class="border border-gray-200 text-center py-2 text-xs font-bold"
                                            :class="cr.passed ? 'text-green-600' : 'text-red-600'">
                                            {{ cr.passed ? 'PASSED' : '-' }}
                                        </td>
                                    </template>

                                    <td class="border border-gray-200 text-center py-2 font-black text-sm bg-gray-50">
                                        {{ row.total_weighted_percent }}
                                    </td>
                                    <td class="border border-gray-200 text-center py-2 font-black text-lg"
                                        :class="row.final_numerical_grade <= 3.0 ? 'text-green-700' : 'text-red-600'">
                                        {{ row.final_numerical_grade ? row.final_numerical_grade.toFixed(2) : '' }}
                                    </td>
                                    <td class="border border-gray-200 text-center py-2 font-black text-xs uppercase"
                                        :class="row.remarks === 'PASSED' ? 'text-green-600 bg-green-50' : row.remarks === 'INC' ? 'text-red-600 bg-red-50' : 'text-red-600 bg-red-50'">
                                        {{ row.remarks || '' }}
                                    </td>
                                </tr>
                            </tbody>
                        </template>

                    </table>
                </div>

                <!-- Summary bar -->
                <div v-if="activeTab === 'final'" class="p-3 bg-gray-50 border-t flex flex-wrap gap-6 text-xs">
                    <div><span class="text-gray-500">Total Students:</span> <span class="font-bold text-gray-800">{{
                            filteredData.length
                            }}</span></div>
                    <div><span class="text-gray-500">Passed:</span> <span class="font-bold text-green-700">{{
                            passedCount }}</span>
                    </div>
                    <div><span class="text-gray-500">Failed:</span> <span class="font-bold text-red-600">{{ failedCount
                            }}</span></div>
                    <div><span class="text-gray-500">INC:</span> <span class="font-bold text-red-600">{{ incCount
                            }}</span></div>
                    <div><span class="text-gray-500">Pass Rate:</span> <span class="font-bold text-green-700">{{
                            passRate }}%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SuccessMessage from '@/components/success-message.vue'

export default {
    name: 'ClassRecord',
    components: { SuccessMessage },

    data: function () {
        return {
            academicYears: ['2024-2025', '2025-2026', '2026-2027'],
            semesters: ['1st', '2nd', 'Summer'],
            selectedYear: '',
            selectedSemester: '',
            loading: false,
            loadingRecord: false,
            subjects: [],
            activeSubject: null,
            activeTab: 'raw',
            searchQuery: '',
            gradeData: [],          // from POST /class-activity/compute-grades
            courseOutcomes: [],      // from GET /obe/syllabus/...
            assessmentTypes: [],     // from GET /obe/assessment-types

            coColors: [
                '#22c55e', '#14b8a6', '#3b82f6', '#a855f7',
                '#ec4899', '#f97316', '#ef4444', '#6366f1',
            ],

            tabs: [
                { id: 'raw', label: 'Raw Score' },
                { id: 'percent', label: '% Rating' },
                { id: 'weighted', label: 'Weighted %' },
                { id: 'final', label: 'Final Grade' },
            ],
        }
    },

    computed: {
        user: function () { return this.$parent && this.$parent.user },

        /** Activity column headers (from first student's raw_scores) */
        activityHeaders: function () {
            if (!this.gradeData.length) return []
            var first = this.gradeData[0]
            var coIdToCode = {}
            var self = this
                ; (this.courseOutcomes || []).forEach(function (co) { coIdToCode[co.co_id] = co.co_code })

            // Build weight map for weighted tab
            var weightMap = {}
            if (first.weighted_ratings) {
                first.weighted_ratings.forEach(function (wr) {
                    weightMap[wr.activity_id] = wr.weight_percentage
                })
            }

            return (first.raw_scores || []).map(function (rs) {
                return {
                    activity_id: rs.activity_id,
                    activity_name: rs.activity_name,
                    co_id: rs.co_id,
                    co_code: coIdToCode[rs.co_id] || 'N/A',
                    max_score: rs.max_score,
                    weight: weightMap[rs.activity_id] || 0,
                }
            })
        },

        /** CO header spans for activity columns */
        coHeaders: function () {
            var acts = this.activityHeaders
            if (!acts.length) return []
            var self = this

            // Group consecutive activities by CO
            var headers = []
            var currentCo = null
            var coIdx = -1

            var coCodeToIdx = {}
                ; (this.courseOutcomes || []).forEach(function (co, i) { coCodeToIdx[co.co_code] = i })

            // Count per CO
            var counts = {}
            var weights = {}
            acts.forEach(function (a) {
                counts[a.co_code] = (counts[a.co_code] || 0) + 1
                weights[a.co_code] = (weights[a.co_code] || 0) + a.weight
            })

                // Build ordered by outcomes
                ; (this.courseOutcomes || []).forEach(function (co, idx) {
                    if (counts[co.co_code]) {
                        headers.push({
                            co_code: co.co_code,
                            count: counts[co.co_code],
                            weight: Math.round((weights[co.co_code] || 0) * 100) / 100,
                            color: self.coColors[idx % self.coColors.length],
                        })
                    }
                })
            return headers
        },

        /** CO headers for Final Grade tab (from co_results) */
        coResultHeaders: function () {
            if (!this.gradeData.length || !this.gradeData[0].co_results) return []
            var self = this
            return this.gradeData[0].co_results.map(function (cr, idx) {
                return {
                    co_code: cr.co_code,
                    color: self.coColors[idx % self.coColors.length],
                }
            })
        },

        filteredData: function () {
            if (!this.searchQuery) return this.gradeData
            var q = this.searchQuery.toLowerCase()
            return this.gradeData.filter(function (r) {
                return r.student_name.toLowerCase().indexOf(q) !== -1 ||
                    (r.studid || '').toLowerCase().indexOf(q) !== -1
            })
        },

        passedCount: function () {
            return this.filteredData.filter(function (r) { return r.remarks === 'PASSED' }).length
        },
        failedCount: function () {
            return this.filteredData.filter(function (r) { return r.remarks === 'FAILED' }).length
        },
        incCount: function () {
            return this.filteredData.filter(function (r) { return r.remarks === 'INC' }).length
        },
        passRate: function () {
            if (!this.filteredData.length) return 0
            return Math.round((this.passedCount / this.filteredData.length) * 100)
        },
    },

    methods: {
        loadSubjects: async function () {
            if (!this.selectedYear || !this.selectedSemester) {
                this.$refs.msg.show('Please select Academic Year and Semester.', 'error')
                return
            }

            this.loading = true
            this.activeSubject = null
            this.gradeData = []

            try {
                var url = '/masterlist/filter/' + this.selectedYear + '/' + this.selectedSemester
                var res = await this.$axios.get(url)

                if (!res.data || res.data.length === 0) {
                    this.subjects = []
                    this.$refs.msg.show('No classes found.', 'info')
                    this.loading = false
                    return
                }

                var organized = {}
                res.data.forEach(function (row) {
                    var key = row.subjcode + '-' + row.section
                    if (!organized[key]) {
                        organized[key] = {
                            subjcode: row.subjcode,
                            section: row.section,
                            description: row.type || 'Subject',
                            instructor: row.employee
                                ? row.employee.firstname + ' ' + row.employee.lastname
                                : 'Unassigned',
                            students: [],
                        }
                    }
                    organized[key].students.push({
                        studid: row.studid,
                        studlastname: row.studlastname,
                        studfirstname: row.studfirstname,
                    })
                })

                this.subjects = Object.values(organized)
                this.$refs.msg.show('Subjects loaded.', 'success')
            } catch (e) {
                console.error(e)
                this.$refs.msg.show('Error loading subjects.', 'error')
            } finally {
                this.loading = false
            }
        },

        openRecord: async function (subject) {
            this.activeSubject = subject
            this.activeTab = 'raw'
            this.loadingRecord = true

            try {
                // Fetch assessment types
                var typesRes = await this.$axios.get('/obe/assessment-types')
                this.assessmentTypes = typesRes.data || []

                // Fetch syllabus (course outcomes)
                if (this.user && this.user.empid) {
                    var empid = this.user.empid
                    var subj = encodeURIComponent(subject.subjcode)
                    var sect = encodeURIComponent((subject.section || '').trim())
                    var syllabusRes = await this.$axios.get('/obe/syllabus/' + empid + '/' + subj + '/' + sect)
                    var data = syllabusRes.data || []

                    // Deduplicate
                    var coMap = new Map()
                    data.forEach(function (c) { if (!coMap.has(c.co_id)) coMap.set(c.co_id, c) })
                    this.courseOutcomes = Array.from(coMap.values())
                }

                // Fetch computed grades (the full pipeline result)
                var gradeRes = await this.$axios.post('/class-activity/compute-grades', {
                    empid: this.user ? this.user.empid : null,
                    subjcode: subject.subjcode,
                    section: (subject.section || '').trim(),
                    sy: this.selectedYear,
                    sem: this.selectedSemester,
                })
                this.gradeData = gradeRes.data || []

                if (this.gradeData.length === 0) {
                    this.$refs.msg.show('No computed grades found for this class.', 'info')
                }
            } catch (e) {
                console.error('Failed to load record:', e)
                this.$refs.msg.show('Error loading class record. Make sure grades are computed first.', 'error')
                this.gradeData = []
            } finally {
                this.loadingRecord = false
            }
        },
    },
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}
</style>