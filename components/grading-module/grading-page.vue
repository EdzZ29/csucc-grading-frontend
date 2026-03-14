<template>
    <div class="font-inria min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <success-message ref="msg" />

        <!-- ═══ OBE Syllabus Setup Modal ═══ -->
        <obe-setup-modal :is-open="showObeModal" :active-subject="activeSubject" @close="showObeModal = false"
            @save="handleObeSetupSave" />

        <!-- ═══════════════════════════════════════════════ -->
        <!-- HEADER                                           -->
        <!-- ═══════════════════════════════════════════════ -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div class="flex items-center gap-4">
                <div class="w-1.5 h-12 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
                <div>
                    <h1 class="text-3xl md:text-4xl font-bold font-epundaslab text-gray-800">Grading Module</h1>
                    <p class="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Outcome-Based Education • Manage student grades and class records
                    </p>
                </div>
            </div>

            <!-- Quick Stats (optional) -->
            <div v-if="subjects.length > 0" class="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                <span class="text-sm text-gray-600">{{ subjects.length }} Active Classes</span>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- YEAR / SEMESTER PICKER                          -->
        <!-- ═══════════════════════════════════════════════ -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wider">Academic Period</h2>
            </div>

            <div class="flex flex-col md:flex-row items-end gap-4">
                <div class="w-full md:w-64">
                    <label class="block text-xs font-semibold text-gray-500 mb-2 ml-1">Academic Year</label>
                    <div class="relative">
                        <select v-model="selectedYear"
                            class="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent appearance-none">
                            <option value="" disabled>Select Year</option>
                            <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
                        </select>
                        <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <div class="w-full md:w-64">
                    <label class="block text-xs font-semibold text-gray-500 mb-2 ml-1">Semester</label>
                    <div class="relative">
                        <select v-model="selectedSemester"
                            class="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent appearance-none">
                            <option value="" disabled>Select Semester</option>
                            <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
                        </select>
                        <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <button @click="loadClassesFromDatabase" :disabled="loading"
                    class="h-12 px-8 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-orange-600 font-bold text-sm flex items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                    <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    {{ loading ? 'Loading...' : 'Display Classes' }}
                </button>

                <button v-if="activeSubject" @click="closeGradingSheet"
                    class="h-12 px-6 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 font-bold text-sm flex items-center gap-2 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Close Grading Sheet
                </button>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- CLASS CARDS - Orange themed                      -->
        <!-- ═══════════════════════════════════════════════ -->
        <div v-if="showSubjects && !activeSubject" class="animate-fade-in">
            <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">Available Classes</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-if="subjects.length === 0"
                    class="col-span-full text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p class="text-lg mb-2">No classes found</p>
                    <p class="text-sm">Select a different academic period or contact administrator</p>
                </div>

                <div v-for="(subject, index) in subjects" :key="index" @click="openGradingSheet(subject)"
                    class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group">
                    <div class="bg-gradient-to-r from-orange-400 to-orange-500 p-5 relative overflow-hidden">
                        <!-- Decorative pattern -->
                        <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8"></div>
                        
                        <div class="flex justify-between items-start relative z-10">
                            <h3 class="font-bold text-white text-xl">{{ subject.subjcode }}</h3>
                            <div class="flex gap-2">
                                <span class="bg-white text-orange-600 text-xs px-2 py-1 rounded-full font-bold">
                                    Sec {{ subject.section }}
                                </span>
                            </div>
                        </div>
                        <p class="text-sm text-white/80 mt-2 line-clamp-2 relative z-10">{{ subject.description }}</p>
                        <div class="mt-4 flex items-center gap-2 text-xs text-white/70 relative z-10">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span class="font-medium">{{ subject.instructor }}</span>
                        </div>
                    </div>
                    <div class="p-5 flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-600">{{ subject.students.length }} Students</span>
                        <span class="text-orange-600 font-semibold text-sm group-hover:underline flex items-center gap-1">
                            Open Sheet
                            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- GRADING SHEET (OBE-powered)                     -->
        <!-- ═══════════════════════════════════════════════ -->
        <div v-if="activeSubject"
            class="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col relative animate-fade-in overflow-hidden">
            
            <!-- Loading overlay with OBE theme -->
            <div v-if="loadingGradebook"
                class="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <div class="bg-white p-8 rounded-2xl shadow-2xl text-center">
                    <div class="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mb-4 mx-auto"></div>
                    <p class="text-gray-800 font-bold text-xl mb-2">Loading OBE Gradebook</p>
                    <p class="text-gray-400 text-sm">Please wait while we prepare your data...</p>
                </div>
            </div>

            <!-- Header bar -->
            <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div class="flex items-center gap-4">
                        
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h2 class="text-xl font-bold flex items-center gap-2">
                                    {{ activeSubject.subjcode }}
                                    <span class="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Sec {{ activeSubject.section }}</span>
                                </h2>
                            </div>
                            <div class="flex items-center gap-3 text-sm">
                                <span class="text-gray-300">Instructor:</span>
                                <span class="text-white font-medium">{{ activeSubject.instructor }}</span>
                                <span class="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                <span class="text-gray-300">{{ activeSubject.students.length }} Students</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button @click="showObeModal = true"
                            class="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl text-sm font-bold hover:from-orange-500 hover:to-orange-600 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            OBE Syllabus Setup
                        </button>
                    </div>
                </div>
            </div>

            <!-- OBE Grading Sheet Component -->
            <div class="p-6">
                <grading-sheet ref="gradingSheet" :active-subject="activeSubject" :outcomes="courseOutcomes"
                    :students="activeSubject.students" :assessment-types="assessmentTypes" />
            </div>
        </div>

        <!-- OBE Info Footer (shown when no active subject) -->
        <div v-if="!activeSubject && showSubjects && subjects.length > 0" class="mt-8 text-center text-xs text-gray-400">
            <p>Select a class to begin OBE grading and assessment</p>
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