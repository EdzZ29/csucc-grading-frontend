<template>
    <div class="font-inria min-h-screen bg-white p-4 md:p-8 rounded-md">
        <success-message ref="msg" />

        <!-- ═══ OBE Syllabus Setup Modal ═══ -->
        <obe-setup-modal :is-open="showObeModal" :active-subject="activeSubject" @close="showObeModal = false"
            @save="handleObeSetupSave" />

        <!-- ═══════════════════════════════════════════════ -->
        <!-- HEADER                                          -->
        <!-- ═══════════════════════════════════════════════ -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h1 class="text-3xl font-bold font-epundaslab text-black700">Grading Module</h1>
                <p class="text-md text-gray-500 mt-1">Manage student grades and class records</p>
            </div>

            <div></div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- YEAR / SEMESTER PICKER                          -->
        <!-- ═══════════════════════════════════════════════ -->
        <div
            class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-end gap-4">
            <div class="w-full md:w-64">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Academic Year</label>
                <select v-model="selectedYear"
                    class="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    <option value="" disabled>Select Year</option>
                    <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>

            <div class="w-full md:w-64">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Semester</label>
                <select v-model="selectedSemester"
                    class="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    <option value="" disabled>Select Semester</option>
                    <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
                </select>
            </div>

            <button @click="loadClassesFromDatabase" :disabled="loading"
                class="h-10 px-6 bg-orange400 text-white rounded-lg hover:bg-orange300 font-bold text-sm flex items-center gap-2 disabled:opacity-50">
                {{ loading ? 'Loading...' : 'Display Classes' }}
            </button>

            <button v-if="activeSubject" @click="closeGradingSheet"
                class="h-10 px-6 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-bold text-sm">
                Close Grading Sheet
            </button>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- CLASS CARDS                                     -->
        <!-- ═══════════════════════════════════════════════ -->
        <div v-if="showSubjects && !activeSubject"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <div v-if="subjects.length === 0"
                class="col-span-full text-center py-10 text-gray-500 border border-dashed rounded-xl">
                No classes found for the selected timeline.
            </div>

            <div v-for="(subject, index) in subjects" :key="index" @click="openGradingSheet(subject)"
                class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md cursor-pointer group">
                <div class="bg-orange400 p-4 border-b border-green-100">
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-white text-lg">{{ subject.subjcode }}</h3>
                        <span class="bg-white text-orange400 text-xs px-2 py-1 rounded font-bold">
                            {{ subject.section }}
                        </span>
                    </div>
                    <p class="text-sm text-white mt-1 truncate">{{ subject.description }}</p>
                    <p class="text-xs text-white mt-2 flex items-center gap-1">
                        <span class="font-bold">Instructor:</span> {{ subject.instructor }}
                    </p>
                </div>
                <div class="p-4 flex justify-between items-center text-sm text-gray-500">
                    <span>{{ subject.students.length }} Students</span>
                    <span class="text-orange400 font-semibold group-hover:underline">Open Sheet &rarr;</span>
                </div>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- GRADING SHEET (OBE-powered)                    -->
        <!-- ═══════════════════════════════════════════════ -->
        <div v-if="activeSubject"
            class="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col relative animate-fade-in">
            <!-- Loading overlay -->
            <div v-if="loadingGradebook"
                class="absolute inset-0 z-50 bg-white bg-opacity-90 flex flex-col items-center justify-center">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-t-green-600 border-gray-200 mb-4"></div>
                <p class="text-green-800 font-bold text-xl animate-pulse">Processing...</p>
            </div>

            <!-- Header bar -->
            <div class="bg-black700 text-white px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="flex-1">
                    <h2 class="text-lg font-bold flex items-center gap-2">
                        <span class="bg-orange400 text-xs px-2 py-0.5 rounded">{{ activeSubject.subjcode }}</span>
                        {{ activeSubject.section }}
                    </h2>
                    <div class="mt-1 flex items-center gap-2 text-sm">
                        <span class="text-orange400 font-bold">Instructor:</span>
                        <span class="text-white">{{ activeSubject.instructor }}</span>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button @click="showObeModal = true"
                        class="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 shadow">
                        Syllabus Setup
                    </button>
                </div>
            </div>

            <!-- OBE Grading Sheet Component -->
            <grading-sheet ref="gradingSheet" :active-subject="activeSubject" :outcomes="courseOutcomes"
                :students="activeSubject.students" :assessment-types="assessmentTypes" />
        </div>
    </div>
</template>

<script>
import SuccessMessage from '@/components/success-message.vue'
import ObeSetupModal from './obe-setup-modal.vue'
import GradingSheet from './grading-module.vue'

export default {
    name: 'GradingPage',
    components: { SuccessMessage, ObeSetupModal, GradingSheet },

    data: function () {
        return {
            // ── Dropdown options ──────────────────────────────
            academicYears: ['2024-2025', '2025-2026', '2026-2027'],
            semesters: ['1st', '2nd', 'Summer'],

            // ── Selections ────────────────────────────────────
            selectedYear: '',
            selectedSemester: '',

            // ── Loading states ────────────────────────────────
            loading: false,
            loadingGradebook: false,

            // ── Data ──────────────────────────────────────────
            user: null,
            subjects: [],
            activeSubject: null,

            // OBE data — passed as props to child components
            courseOutcomes: [],
            assessmentTypes: [],

            // ── UI toggles ────────────────────────────────────
            showSubjects: false,
            showObeModal: false,
        }
    },

    async mounted() {
        await this.getUserInfo()
    },

    methods: {

        /* ══════════════════════════════════════════════════════════
         * AUTH
         * ══════════════════════════════════════════════════════════ */
        getUserInfo: async function () {
            try {
                var res = await this.$axios.get('/auth/user')
                this.user = res.data
            } catch (e) {
                console.error('User not found', e)
            }
        },

        /* ══════════════════════════════════════════════════════════
         * LOAD CLASSES — identical to old flow
         * Groups flat masterlist rows into subject cards
         * ══════════════════════════════════════════════════════════ */
        loadClassesFromDatabase: async function () {
            if (!this.selectedYear || !this.selectedSemester) {
                this.$refs.msg.show('Please select Academic Year and Semester.', 'error')
                return
            }

            this.loading = true
            this.activeSubject = null

            try {
                var url = '/masterlist/filter/' + this.selectedYear + '/' + this.selectedSemester
                var res = await this.$axios.get(url)

                if (!res.data || res.data.length === 0) {
                    this.subjects = []
                    this.$refs.msg.show('No classes found.', 'info')
                    this.loading = false
                    return
                }

                // Group flat rows by subject+section
                var organizedClasses = {}

                res.data.forEach(function (row) {
                    var classId = row.subjcode + '-' + row.section

                    if (!organizedClasses[classId]) {
                        organizedClasses[classId] = {
                            subjcode: row.subjcode,
                            section: row.section,
                            description: row.type || 'Subject Description',
                            instructor: row.employee
                                ? (row.employee.firstname + ' ' + row.employee.lastname)
                                : 'Unassigned',
                            students: [],
                        }
                    }

                    organizedClasses[classId].students.push({
                        masterlist_id: row.masterlist_id,
                        studid: row.studid,
                        studlastname: row.studlastname,
                        studfirstname: row.studfirstname,
                        fullname: row.studlastname + ', ' + row.studfirstname,
                        scores: {},
                    })
                })

                this.subjects = Object.values(organizedClasses)
                this.showSubjects = true
                this.$refs.msg.show('Classes loaded successfully.', 'success')
            } catch (e) {
                console.error(e)
                this.$refs.msg.show('Error loading classes.', 'error')
            } finally {
                this.loading = false
            }
        },

        /* ══════════════════════════════════════════════════════════
         * OPEN GRADING SHEET — loads OBE syllabus + assessment types
         * then shows the GradingSheet child component
         * ══════════════════════════════════════════════════════════ */
        openGradingSheet: async function (subject) {
            this.loadingGradebook = true
            this.activeSubject = subject

            try {
                // ── 1. Fetch assessment types ────────────────────
                await this.fetchAssessmentTypes()

                // ── 2. Fetch syllabus (course outcomes + TOS weights) ─
                await this.fetchSyllabus()

            } catch (e) {
                console.error('Error loading grading sheet:', e)
            } finally {
                this.loadingGradebook = false
            }

            // The GradingSheet child will auto-load its gradebook
            // via its watch on activeSubject
        },

        fetchAssessmentTypes: async function () {
            try {
                var res = await this.$axios.get('/obe/assessment-types')
                this.assessmentTypes = res.data || []
            } catch (e) {
                console.error('Failed to load assessment types:', e)
                this.assessmentTypes = []
            }
        },

        fetchSyllabus: async function () {
            if (!this.user || !this.activeSubject) {
                this.courseOutcomes = []
                return
            }

            try {
                var empid = this.user.empid
                var subj = encodeURIComponent(this.activeSubject.subjcode)
                var sect = encodeURIComponent(
                    (this.activeSubject.section || '').trim()
                )

                var url = '/obe/syllabus/' + empid + '/' + subj + '/' + sect
                var res = await this.$axios.get(url)
                var data = res.data

                if (data && data.length > 0) {
                    // Deduplicate by co_id
                    var coMap = new Map()
                    data.forEach(function (c) {
                        if (!coMap.has(c.co_id)) coMap.set(c.co_id, c)
                    })
                    this.courseOutcomes = Array.from(coMap.values())
                } else {
                    this.courseOutcomes = []
                }
            } catch (e) {
                console.error('Failed to load syllabus:', e)
                this.courseOutcomes = []
            }
        },

        /* ══════════════════════════════════════════════════════════
         * CLOSE
         * ══════════════════════════════════════════════════════════ */
        closeGradingSheet: function () {
            this.activeSubject = null
            this.courseOutcomes = []
        },

        /* ══════════════════════════════════════════════════════════
         * EVENT HANDLERS from child modals
         * ══════════════════════════════════════════════════════════ */

        /** Called when OBE Setup Modal saves successfully */
        handleObeSetupSave: async function () {
            this.showObeModal = false
            this.$refs.msg.show('Syllabus saved successfully!', 'success')

            // Reload outcomes so the grading sheet picks up the new COs
            await this.fetchSyllabus()

            // Reload the grading sheet data with new CO structure
            if (this.$refs.gradingSheet) {
                this.$refs.gradingSheet.loadGradebook()
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
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>