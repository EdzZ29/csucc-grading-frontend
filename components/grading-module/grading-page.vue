<template>
    <div class="font-inria min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <success-message ref="msg" />

        <!-- ═══ OBE Syllabus Setup Modal ═══ -->
        <obe-setup-modal :is-open="showObeModal" :active-subject="activeSubject" @close="showObeModal = false"
            @save="handleObeSetupSave" />

        <!-- ═══════════════════════════════════════════════ -->
        <!-- CLASS RECORD MODAL (integrated)                 -->
        <!-- ═══════════════════════════════════════════════ -->
        <div v-if="showClassRecord"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-xl p-2 md:p-4">
            <div
                class="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-full max-h-[92vh] overflow-hidden flex flex-col animate-popInDown">

                <!-- Modal Header -->
                <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 flex justify-between items-center shrink-0">
                    <div>
                        <h2 class="text-lg font-bold flex items-center gap-2">
                            Class Record
                            <span v-if="activeSubject"
                                class="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                {{ activeSubject.subjcode }} — Sec {{ activeSubject.section }}
                            </span>
                        </h2>
                        <p class="text-gray-400 text-xs mt-0.5">
                            {{ activeSubject ? activeSubject.instructor : '' }} •
                            {{ activeSubject ? activeSubject.students.length : 0 }} Students
                        </p>
                    </div>
                    <button @click="showClassRecord = false"
                        class="text-white hover:bg-gray-700 rounded-full p-2 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- ── Prominent Tab Bar ── -->
                <div class="shrink-0 bg-white border-b-2 border-gray-100 px-6 pt-3 pb-0 flex items-end gap-1">
                    <!-- Raw Score -->
                    <button @click="classRecordActiveTab = 'raw'"
                        :class="[
                            'flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-b-[3px] transition-all whitespace-nowrap',
                            classRecordActiveTab === 'raw'
                                ? 'border-orange-500 text-orange-600 bg-orange-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        ]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Raw Score
                    </button>

                    <!-- % Rating -->
                    <button @click="classRecordActiveTab = 'percent'"
                        :class="[
                            'flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-b-[3px] transition-all whitespace-nowrap',
                            classRecordActiveTab === 'percent'
                                ? 'border-teal-500 text-teal-600 bg-teal-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        ]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        </svg>
                        % Rating
                    </button>

                    <!-- Weighted % -->
                    <button @click="classRecordActiveTab = 'weighted'"
                        :class="[
                            'flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-b-[3px] transition-all whitespace-nowrap',
                            classRecordActiveTab === 'weighted'
                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        ]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        Weighted %
                    </button>

                    <!-- Final Grade -->
                    <button @click="classRecordActiveTab = 'final'"
                        :class="[
                            'flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-b-[3px] transition-all whitespace-nowrap',
                            classRecordActiveTab === 'final'
                                ? 'border-purple-500 text-purple-600 bg-purple-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        ]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Final Grade
                    </button>

                    <!-- Print Button (right side) -->
                    <div class="ml-auto pb-3 flex items-center gap-2">
                        <!-- ── Grading Report Sheet ── -->
                        <button @click="openGradingReportSheet()"
                            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Grading Report Sheet
                        </button>
                        <button @click="printClassRecord"
                            class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print
                        </button>
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="loadingRecord" class="flex-1 flex flex-col items-center justify-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-4 border-t-orange-500 border-gray-200 mb-4">
                    </div>
                    <p class="text-gray-500 text-sm">Loading class record...</p>
                </div>

                <!-- No Data -->
                <div v-else-if="gradeData.length === 0"
                    class="flex-1 flex items-center justify-center text-gray-400">
                    <div class="text-center">
                        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p class="text-lg font-medium mb-1">No computed grades found</p>
                        <p class="text-sm text-gray-400">Grades must be computed in the Grading Sheet first.</p>
                    </div>
                </div>

                <!-- Table Content -->
                <div v-else class="flex-1 flex flex-col overflow-hidden">

                    <!-- Search + count -->
                    <div
                        class="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
                        <input v-model="searchRecordQuery" placeholder="Search student..." type="text"
                            class="w-full max-w-xs px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                        <span class="text-xs text-gray-500 ml-4 shrink-0">
                            {{ filteredRecordData.length }} students
                        </span>
                    </div>

                    <div class="overflow-auto flex-1">
                        <table class="w-full text-xs border-collapse whitespace-nowrap"
                            style="min-width: max-content;">

                            <!-- ═══ RAW SCORE ═══ -->
                            <template v-if="classRecordActiveTab === 'raw'">
                                <thead class="bg-gray-100 top-0 z-20">
                                    <tr v-if="sortedActivityHeaders.length > 0">
                                        <th class="sticky left-0 z-30 bg-white border-0" style="min-width:40px"></th>
                                        <th class="sticky left-[40px] z-30 bg-white border-r border-gray-400 px-3 py-1 text-right text-xs italic font-bold text-black"
                                            style="min-width:200px">Course Outcomes</th>
                                        <!-- FIX: Use sortedCoHeaders which respects CO order from courseOutcomes -->
                                        <th v-for="co in sortedCoHeaders" :key="'rh-' + co.co_code"
                                            :colspan="co.count || 1"
                                            class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs relative z-20 bg-clip-padding"
                                            :style="{ backgroundColor: co.color }">
                                            {{ co.co_code }}
                                        </th>
                                    </tr>
                                    <tr v-if="sortedActivityHeaders.length > 0">
                                        <th class="sticky left-0 z-30 bg-white border-0" style="min-width:40px"></th>
                                        <th class="sticky left-[40px] z-30 bg-white border-r border-gray-400 px-3 py-1 text-right text-xs italic font-bold text-black"
                                            style="min-width:200px">Assesment Task</th>
                                        <!-- FIX: Use sortedActivityHeaders which is sorted by CO order -->
                                        <th v-for="act in sortedActivityHeaders" :key="'ra-' + act.activity_id"
                                            class="border border-gray-300 bg-white px-2 py-1 text-center font-bold text-black italic relative z-20 bg-clip-padding"
                                            style="min-width:80px">
                                            {{ act.type_code }}
                                        </th>
                                    </tr>
                                    <tr v-if="sortedActivityHeaders.length > 0">
                                        <th class="sticky left-0 z-30 bg-white border-0" style="min-width:40px"></th>
                                        <th class="sticky left-[40px] z-30 bg-white border-r border-gray-400 px-3 py-1 text-right text-xs italic font-bold text-black"
                                            style="min-width:200px">Assessment Total Points</th>
                                        <th v-for="act in sortedActivityHeaders" :key="'ra-max-' + act.activity_id"
                                            class="border border-gray-400 bg-yellow-300 px-2 py-1 text-center font-bold text-black relative z-20 bg-clip-padding"
                                            style="min-width:80px">
                                            {{ act.max_score }}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th class="sticky left-0 z-30 bg-white border-t border-b border-r border-gray-400 px-2 py-1 text-center font-bold text-black"
                                            style="min-width:40px">No.</th>
                                        <th class="sticky left-[40px] z-30 bg-white border-t border-b border-r border-gray-400 px-3 py-1 text-left font-bold text-black"
                                            style="min-width:200px">Student Name</th>
                                        <th v-for="act in sortedActivityHeaders" :key="'ra-gap-' + act.activity_id"
                                            class="border border-gray-300 bg-gray-50 px-2 py-1 text-center relative z-20 bg-clip-padding"
                                            style="min-width:80px">&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, idx) in filteredRecordData" :key="'r-' + row.studid"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                        <td class="sticky left-0 z-10 border border-gray-200 px-2 py-1.5 text-center font-bold text-gray-400"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ idx + 1 }}</td>
                                        <td class="sticky left-[40px] z-10 border border-gray-200 px-3 py-1.5 font-medium text-gray-800"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ row.student_name }}
                                        </td>
                                        <!-- FIX: Render cells in sortedActivityHeaders order using scoreMap lookup -->
                                        <td v-for="act in sortedActivityHeaders"
                                            :key="'rs-' + act.activity_id + row.studid"
                                            class="border border-gray-200 text-center py-1.5 text-sm">
                                            {{ getRawScore(row, act.activity_id) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </template>

                            <!-- ═══ % RATING ═══ -->
                            <template v-if="classRecordActiveTab === 'percent'">
                                <thead class="bg-gray-100 top-0 z-20">
                                    <tr v-if="sortedActivityHeaders.length > 0">
                                        <th class="sticky left-0 z-30 bg-white border-0" style="min-width:40px"></th>
                                        <th class="sticky left-[40px] z-30 bg-white border-r border-gray-400 px-3 py-1 text-right text-xs italic font-bold text-black"
                                            style="min-width:200px">Course Outcomes</th>
                                        <th v-for="co in sortedCoHeaders" :key="'ph-' + co.co_code"
                                            :colspan="co.count || 1"
                                            class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs relative z-20 bg-clip-padding"
                                            :style="{ backgroundColor: co.color }">
                                            {{ co.co_code }}
                                        </th>
                                    </tr>
                                    <tr v-if="sortedActivityHeaders.length > 0">
                                        <th class="sticky left-0 z-30 bg-white border-0" style="min-width:40px"></th>
                                        <th class="sticky left-[40px] z-30 bg-white border-r border-gray-400 px-3 py-1 text-right text-xs italic font-bold text-black"
                                            style="min-width:200px">Assesment Task</th>
                                        <th v-for="act in sortedActivityHeaders" :key="'pa-type-' + act.activity_id"
                                            class="border border-gray-300 bg-white px-2 py-1 text-center font-bold text-black italic relative z-20 bg-clip-padding"
                                            style="min-width:80px">
                                            {{ act.type_code }}
                                        </th>
                                    </tr>
                                    <tr v-if="sortedActivityHeaders.length > 0">
                                        <th class="sticky left-0 z-30 bg-white border-0" style="min-width:40px"></th>
                                        <th class="sticky left-[40px] z-30 bg-white border-r border-gray-400 px-3 py-1 text-right text-xs italic font-bold text-black"
                                            style="min-width:200px">Assessment Total Points</th>
                                        <th v-for="act in sortedActivityHeaders" :key="'pa-max-' + act.activity_id"
                                            class="border border-gray-400 bg-yellow-300 px-2 py-1 text-center font-bold text-black relative z-20 bg-clip-padding"
                                            style="min-width:80px">
                                            {{ act.max_score }}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th class="sticky left-0 z-30 bg-white border-t border-b border-r border-gray-400 px-2 py-1 text-center font-bold text-black"
                                            style="min-width:40px">No.</th>
                                        <th class="sticky left-[40px] z-30 bg-white border-t border-b border-r border-gray-400 px-3 py-1 text-left font-bold text-black"
                                            style="min-width:200px">Student Name</th>
                                        <th v-for="act in sortedActivityHeaders" :key="'pa-gap-' + act.activity_id"
                                            class="border border-gray-300 bg-gray-50 px-2 py-1 text-center relative z-20 bg-clip-padding"
                                            style="min-width:80px">&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, idx) in filteredRecordData" :key="'p-' + row.studid"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                        <td class="sticky left-0 z-10 border border-gray-200 px-2 py-1.5 text-center font-bold text-gray-400"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ idx + 1 }}</td>
                                        <td class="sticky left-[40px] z-10 border border-gray-200 px-3 py-1.5 font-medium text-gray-800"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ row.student_name }}
                                        </td>
                                        <!-- FIX: Look up percent_ratings by activity_id -->
                                        <td v-for="act in sortedActivityHeaders"
                                            :key="'pr-' + act.activity_id + row.studid"
                                            class="border border-gray-200 text-center py-1.5 text-sm"
                                            :class="getPercentRating(row, act.activity_id) !== null && getPercentRating(row, act.activity_id) < 60 ? 'text-red-600 font-bold' : ''">
                                            {{ getPercentRating(row, act.activity_id) !== null ? getPercentRating(row, act.activity_id).toFixed(1) + '%' : '' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </template>

                            <!-- ═══ WEIGHTED % RATING ═══ -->
                            <template v-if="classRecordActiveTab === 'weighted'">
                                <thead class="bg-gray-100 top-0 z-20">
                                    <tr v-if="sortedActivityHeaders.length > 0">
                                        <th class="sticky left-0 z-30 bg-white border-0" style="min-width:40px"></th>
                                        <th class="sticky left-[40px] z-30 bg-white border-r border-gray-400 px-3 py-1 text-right text-xs italic font-bold text-black"
                                            style="min-width:200px">Course Outcomes</th>
                                        <!-- CO Headers with proper colspan -->
                                        <th v-for="co in sortedCoHeaders" :key="'wh-' + co.co_code"
                                            :colspan="co.count || 1"
                                            class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs relative z-20 bg-clip-padding"
                                            :style="{ backgroundColor: co.color }">
                                            {{ co.co_code }}
                                        </th>
                                    </tr>
                                    <tr v-if="sortedActivityHeaders.length > 0">
                                        <th class="sticky left-0 z-30 bg-white border-0" style="min-width:40px"></th>
                                        <th class="sticky left-[40px] z-30 bg-white border-r border-gray-400 px-3 py-1 text-right text-xs italic font-bold text-black"
                                            style="min-width:200px">Assesment Task</th>
                                        <!-- Show all activities with their type codes -->
                                        <th v-for="act in sortedActivityHeaders" :key="'wa-type-' + act.activity_id"
                                            class="border border-gray-300 bg-white px-2 py-1 text-center font-bold text-black italic relative z-20 bg-clip-padding"
                                            style="min-width:80px">
                                            {{ act.type_code }}
                                        </th>
                                    </tr>
                                    <tr v-if="sortedActivityHeaders.length > 0">
                                        <th class="sticky left-0 z-30 bg-white border-0" style="min-width:40px"></th>
                                        <th class="sticky left-[40px] z-30 bg-white border-r border-gray-400 px-3 py-1 text-right text-xs italic font-bold text-black"
                                            style="min-width:200px">Weight %</th>
                                        <!-- Display weight percentage for each activity -->
                                        <th v-for="act in sortedActivityHeaders" :key="'wa-weight-' + act.activity_id"
                                            class="border border-gray-400 bg-yellow-300 px-2 py-1 text-center font-bold text-black relative z-20 bg-clip-padding"
                                            style="min-width:80px">
                                            {{ act.weight > 0 ? (act.weight.toFixed(2) + '%') : '-' }}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th class="sticky left-0 z-30 bg-white border-t border-b border-r border-gray-400 px-2 py-1 text-center font-bold text-black"
                                            style="min-width:40px">No.</th>
                                        <th class="sticky left-[40px] z-30 bg-white border-t border-b border-r border-gray-400 px-3 py-1 text-left font-bold text-black"
                                            style="min-width:200px">Student Name</th>
                                        <!-- Empty cells for data alignment -->
                                        <th v-for="act in sortedActivityHeaders" :key="'wa-gap-' + act.activity_id"
                                            class="border border-gray-300 bg-gray-50 px-2 py-1 text-center relative z-20 bg-clip-padding"
                                            style="min-width:80px">&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Student data rows - show weighted values -->
                                    <tr v-for="(row, idx) in filteredRecordData" :key="'w-' + row.studid"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                        <td class="sticky left-0 z-10 border border-gray-200 px-2 py-1.5 text-center font-bold text-gray-400"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ idx + 1 }}</td>
                                        <td class="sticky left-[40px] z-10 border border-gray-200 px-3 py-1.5 font-medium text-gray-800"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ row.student_name }}
                                        </td>
                                        <!-- Show weighted values for each activity -->
                                        <td v-for="act in sortedActivityHeaders"
                                            :key="'wr-' + act.activity_id + row.studid"
                                            class="border border-gray-200 text-center py-1.5 text-sm">
                                            {{ getWeightedRating(row, act.activity_id) !== undefined ? getWeightedRating(row, act.activity_id).toFixed(2) : '-' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </template>

                            <!-- ═══ FINAL GRADE ═══ -->
                            <template v-if="classRecordActiveTab === 'final'">
                                <thead class="bg-gray-100 top-0 z-20">
                                    <!-- Row 1 -->
                                    <tr>
                                        <th class="sticky left-0 z-30 bg-white border-0" style="min-width:40px"></th>
                                        <th class="sticky left-[40px] z-30 bg-white border-0" style="min-width:200px"></th>
                                        <th colspan="3" class="border border-gray-400 bg-white px-2 py-1 text-right font-black text-black">
                                            % of Student Passed
                                        </th>
                                        <th v-for="co in recordCoResultHeaders" :key="'fp-' + co.co_code"
                                            colspan="2"
                                            class="border border-gray-400 bg-red-600 px-2 py-1 text-center font-bold italic text-white text-xs relative z-20 bg-clip-padding">
                                            {{ coPassedPercent(co.co_code) }}%
                                        </th>
                                    </tr>
                                    <!-- Row 2 -->
                                    <tr>
                                        <th class="sticky left-0 z-30 bg-white border-0" style="min-width:40px"></th>
                                        <th class="sticky left-[40px] z-30 bg-white border-0" style="min-width:200px"></th>
                                        <th colspan="3" class="border border-gray-400 bg-white px-2 py-1 text-center font-black text-black uppercase">
                                            FINAL GRADE
                                        </th>
                                        <th v-for="co in recordCoResultHeaders" :key="'fc-' + co.co_code"
                                            colspan="2"
                                            class="border border-gray-400 bg-white px-2 py-1 text-center font-black text-black text-xs relative z-20 bg-clip-padding">
                                            {{ co.co_code }}
                                        </th>
                                    </tr>
                                    <!-- Row 3 -->
                                    <tr>
                                        <th rowspan="2" class="sticky left-0 z-30 bg-white border-t border-b border-l border-r border-gray-400 px-2 py-1 text-center font-black text-black" style="min-width:40px">No.</th>
                                        <th rowspan="2" class="sticky left-[40px] z-30 bg-white border-t border-b border-r border-gray-400 px-3 py-1 text-left font-black text-black" style="min-width:200px">Student Name</th>
                                        <th rowspan="2" class="border border-gray-400 bg-white px-2 py-1 text-center font-bold italic text-black text-[12px]" style="min-width:60px">
                                            Total
                                        </th>
                                        <th rowspan="2" class="border border-gray-400 bg-white px-2 py-1 text-center font-bold italic text-black text-[12px]" style="min-width:70px">
                                            Final<br>Numerical<br>Grade
                                        </th>
                                        <th rowspan="2" class="border border-gray-400 bg-white px-2 py-1 text-center font-bold italic text-black text-[12px] uppercase" style="min-width:80px">
                                            REMARKS
                                        </th>
                                        <th v-for="co in recordCoResultHeaders" :key="'fw-' + co.co_code"
                                            colspan="2"
                                            class="border border-gray-400 bg-white px-2 py-1 text-center font-bold italic text-black text-xs relative z-20 bg-clip-padding">
                                            {{ coWeightPercent(co.co_code) }}%
                                        </th>
                                    </tr>
                                    <!-- Row 4 -->
                                    <tr>
                                        <template v-for="co in recordCoResultHeaders">
                                            <th :key="'fs-' + co.co_code"
                                                class="border border-gray-400 bg-white px-2 py-1 text-center font-bold italic text-black text-[12px] relative z-20 bg-clip-padding"
                                                style="min-width:70px">Sum %</th>
                                            <th :key="'fr-' + co.co_code"
                                                class="border border-gray-400 bg-white px-2 py-1 text-center font-bold italic text-black text-[12px] relative z-20 bg-clip-padding"
                                                style="min-width:80px">REMARKS</th>
                                        </template>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, idx) in filteredRecordData" :key="'f-' + row.studid"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                        <td class="sticky left-0 z-10 border border-gray-200 px-2 py-2 text-center font-bold text-gray-400"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ idx + 1 }}</td>
                                        <td class="sticky left-[40px] z-10 border border-gray-200 px-3 py-2 font-medium text-gray-800"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ row.student_name }}</td>
                                        
                                        <!-- Summary Columns Moved BEFORE CO Columns -->
                                        <td class="border border-gray-200 text-center py-2 font-black text-sm bg-gray-50">
                                            {{ row.total_weighted_percent }}
                                        </td>
                                        <td class="border border-gray-200 text-center py-2 font-black text-base"
                                            :class="row.total_weighted_percent > 0 && row.final_numerical_grade <= 3.0 ? 'text-green-700' : row.total_weighted_percent > 0 ? 'text-red-600' : 'text-gray-400'">
                                            {{ row.total_weighted_percent > 0 ? row.final_numerical_grade.toFixed(2) : '-' }}
                                        </td>
                                        <td class="border border-gray-200 text-center py-2 font-black text-xs uppercase"
                                            :class="row.total_weighted_percent > 0 && row.remarks === 'PASSED' ? 'text-green-600 bg-green-50' : row.total_weighted_percent > 0 ? 'text-red-600 bg-red-50' : 'text-gray-400'">
                                            {{ row.total_weighted_percent > 0 ? row.remarks : '-' }}
                                        </td>

                                        <template v-for="cr in sortedCoResults(row.co_results)">
                                            <td :key="'cs-' + cr.co_code + row.studid"
                                                class="border border-gray-200 text-center py-2 text-sm font-semibold">
                                                {{ cr.sum_weighted !== undefined ? cr.sum_weighted.toFixed(2) : '0.00' }}
                                            </td>
                                            <td :key="'cp-' + cr.co_code + row.studid"
                                                class="border border-gray-200 text-center py-2 text-xs font-bold"
                                                :class="cr.sum_weighted > 0 && cr.passed ? 'text-green-600 bg-green-50' : cr.sum_weighted > 0 ? 'text-red-600 bg-red-50' : 'text-gray-400'">
                                                {{ cr.sum_weighted > 0 ? (cr.passed ? 'PASSED' : 'FAILED') : '-' }}
                                            </td>
                                        </template>
                                    </tr>
                                </tbody>
                            </template>

                        </table>
                    </div>

                    <!-- Summary bar — Final Grade tab only -->
                    <div v-if="classRecordActiveTab === 'final'"
                        class="p-3 bg-gray-50 border-t flex flex-wrap gap-6 text-xs shrink-0">
                        <div><span class="text-gray-500">Total Students:</span>
                            <span class="font-bold text-gray-800 ml-1">{{ filteredRecordData.length }}</span>
                        </div>
                        <div><span class="text-gray-500">Passed:</span>
                            <span class="font-bold text-green-700 ml-1">{{ recordPassedCount }}</span>
                        </div>
                        <div><span class="text-gray-500">Failed:</span>
                            <span class="font-bold text-red-600 ml-1">{{ recordFailedCount }}</span>
                        </div>
                        <div><span class="text-gray-500">INC:</span>
                            <span class="font-bold text-red-600 ml-1">{{ recordIncCount }}</span>
                        </div>
                        <div><span class="text-gray-500">Pass Rate:</span>
                            <span class="font-bold text-green-700 ml-1">{{ recordPassRate }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- GRADING REPORT SHEET MODAL                      -->
        <!-- ═══════════════════════════════════════════════ -->
        <div v-if="showGradingReportSheetModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-xl p-2 md:p-4">
            <div
                class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[92vh] overflow-hidden flex flex-col animate-fade-in">

                <!-- Modal Header -->
                <div class="bg-gradient-to-r from-indigo-800 to-indigo-900 text-white px-6 py-4 flex justify-between items-center shrink-0">
                    <div>
                        <h2 class="text-lg font-bold flex items-center gap-2">
                            Grading Report Sheet
                            <span v-if="activeSubject"
                                class="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                {{ activeSubject.subjcode }} — Sec {{ activeSubject.section }}
                            </span>
                        </h2>
                        <p class="text-gray-300 text-xs mt-0.5">
                            Final Numerical Grades for All Students
                        </p>
                    </div>
                    <button @click="showGradingReportSheetModal = false"
                        class="text-white hover:bg-indigo-700 rounded-full p-2 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Search Bar and Action Buttons -->
                <div class="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shrink-0 gap-3">
                    <div class="flex-1 flex items-center">
                        <input v-model="searchReportSheetQuery" type="text" placeholder="Search by Student ID or Name..."
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                        <span v-if="filteredGradingReportSheetData.length > 0" class="ml-3 text-xs text-gray-600">
                            {{ filteredGradingReportSheetData.length }} of {{ gradingReportSheetData.length }} records
                        </span>
                    </div>
                    <button @click="printReportOfRating"
                        class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Report of Rating
                    </button>
                </div>

                <!-- Grading Report Sheet Table -->
                <div class="flex-1 flex flex-col overflow-hidden">
                    <!-- Table container -->
                    <div class="overflow-auto flex-1">
                        <table class="w-full text-xs border-collapse">
                            <thead class="bg-gray-100 sticky top-0 z-20">
                                <tr>
                                    <th class="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-gray-100">
                                        Student ID
                                    </th>
                                    <th class="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-gray-100">
                                        Program
                                    </th>
                                    <th class="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-gray-100">
                                        Student
                                    </th>
                                    <th class="border border-gray-300 px-4 py-2 text-center font-bold text-gray-700 bg-gray-100">
                                        Validation Date
                                    </th>
                                    <th class="border border-gray-300 px-4 py-2 text-center font-bold text-gray-700 bg-indigo-200 min-w-[100px]">
                                        Grade
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(student, idx) in filteredGradingReportSheetData" :key="'grs-' + student.studid"
                                    :class="[
                                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                        'hover:bg-indigo-100 transition-colors'
                                    ]">
                                    <td class="border border-gray-300 px-4 py-2 font-mono text-gray-800">
                                        {{ student.studid }}
                                    </td>
                                    <td class="border border-gray-300 px-4 py-2 text-gray-800">
                                        {{ student.course || 'N/A' }}
                                    </td>
                                    <td class="border border-gray-300 px-4 py-2 text-gray-800">
                                        {{ student.name || 'N/A' }}
                                    </td>
                                    <td class="border border-gray-300 px-4 py-2 text-center text-gray-600 text-xs">
                                        {{ new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) }}
                                    </td>
                                    <td class="border border-gray-300 px-4 py-2 text-center font-bold">
                                        <span v-if="student.final_grade !== null && student.final_grade !== undefined && student.final_grade !== ''">
                                            {{ parseFloat(student.final_grade).toFixed(2) }}
                                        </span>
                                        <span v-else class="text-gray-400">
                                            —
                                        </span>
                                    </td>
                                </tr>
                                <tr v-if="filteredGradingReportSheetData.length === 0">
                                    <td colspan="5" class="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                        {{ gradingReportSheetData.length === 0 ? 'No data available. Please load the class record first.' : 'No records match your search.' }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

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

            <!-- Quick Stats -->
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                        <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 9l-7 7-7-7" />
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
                        <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <button @click="loadClassesFromDatabase" :disabled="loading"
                    class="h-12 px-8 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-orange-600 font-bold text-sm flex items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                    <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    {{ loading ? 'Loading...' : 'Display Classes' }}
                </button>

                <button v-if="activeSubject" @click="closeGradingSheet"
                    class="h-12 px-6 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 font-bold text-sm flex items-center gap-2 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Close Grading Sheet
                </button>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- CLASS CARDS                                      -->
        <!-- ═══════════════════════════════════════════════ -->
        <div v-if="showSubjects && !activeSubject" class="animate-fade-in">
            <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">Available Classes</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-if="subjects.length === 0"
                    class="col-span-full text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p class="text-lg mb-2">No classes found</p>
                    <p class="text-sm">Select a different academic period or contact administrator</p>
                </div>

                <div v-for="(subject, index) in paginatedSubjects" :key="index" @click="openGradingSheet(subject)"
                    class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group">
                    <div class="bg-gradient-to-r from-orange-400 to-orange-500 p-5 relative overflow-hidden">
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
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span class="font-medium">{{ subject.instructor }}</span>
                        </div>
                    </div>
                    <div class="p-5 flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-600">{{ subject.students.length }} Students</span>
                        <span
                            class="text-orange-600 font-semibold text-sm group-hover:underline flex items-center gap-1">
                            Open Sheet
                            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Pagination Controls -->
            <div v-if="subjects.length > 0" class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <!-- Rows per page selection -->
                <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-gray-700">Rows per page:</span>
                    <select v-model="itemsPerPage" @change="currentPage = 1" class="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm cursor-pointer">
                        <option v-for="n in [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]" :key="n" :value="n">{{ n }}</option>
                    </select>
                </div>
                
                <!-- Pagination buttons -->
                <div class="flex items-center gap-2">
                    <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-gray-700">
                        Prev
                    </button>
                    
                    <div class="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
                        <button v-for="page in displayedPages" :key="page" @click="currentPage = page" :class="['px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors', currentPage === page ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'border-gray-300 text-gray-700 hover:bg-gray-50 bg-white']">
                            {{ page }}
                        </button>
                    </div>

                    <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages || totalPages === 0" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-gray-700">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- GRADING SHEET (OBE-powered)                     -->
        <!-- ═══════════════════════════════════════════════ -->
        <div v-if="activeSubject"
            class="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col relative animate-fade-in overflow-hidden">

            <!-- Loading overlay -->
            <div v-if="loadingGradebook"
                class="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
                <div class="bg-white p-8 rounded-2xl shadow-2xl text-center">
                    <div
                        class="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mb-4 mx-auto">
                    </div>
                    <p class="text-gray-800 font-bold text-xl mb-2">Loading OBE Gradebook</p>
                    <p class="text-gray-400 text-sm">Please wait while we prepare your data...</p>
                </div>
            </div>

            <!-- Header bar -->
            <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4">
                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

                    <!-- Subject info -->
                    <div class="flex items-center gap-4">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h2 class="text-xl font-bold flex items-center gap-2">
                                    {{ activeSubject.subjcode }}
                                    <span
                                        class="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Sec {{
                                            activeSubject.section }}</span>
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

                    <!-- Action buttons -->
                    <div class="flex flex-wrap gap-2">

                        <button @click="openClassRecord('raw')"
                            class="px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border border-orange-400 bg-orange-500 hover:bg-orange-600 text-white shadow-md">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Class Record
                        </button>

                        <!-- ── OBE Syllabus Setup ── -->
                        <button @click="showObeModal = true"
                            class="px-5 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl text-xs font-bold hover:from-orange-500 hover:to-orange-600 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

        <!-- Footer hint -->
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
            currentPage: 1,
            itemsPerPage: 5,
            academicYears: ['2026-2027', '2025-2026', '2024-2025', '2023-2024', '2022-2023', '2021-2022', '2020-2021'],
            semesters: ['1st', '2nd', 'Summer'],
            selectedYear: '',
            selectedSemester: '',
            loading: false,
            loadingGradebook: false,
            loadingRecord: false,
            user: null,
            subjects: [],
            activeSubject: null,
            courseOutcomes: [],
            assessmentTypes: [],
            showSubjects: false,
            showObeModal: false,
            showClassRecord: false,
            showGradingReportSheetModal: false,
            classRecordActiveTab: 'raw',
            gradeData: [],
            gradingReportSheetData: [],
            searchRecordQuery: '',
            searchReportSheetQuery: '',
            recordTabs: [
                { id: 'raw',      label: 'Raw Score'   },
                { id: 'percent',  label: '% Rating'    },
                { id: 'weighted', label: 'Weighted %'  },
                { id: 'final',    label: 'Final Grade' },
            ],
            coColors: [
                '#22c55e', '#14b8a6', '#3b82f6', '#a855f7',
                '#ec4899', '#f97316', '#ef4444', '#6366f1',
            ],
        }
    },

    async mounted() {
        await this.getUserInfo()
    },

    computed: {

        paginatedSubjects() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.subjects.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.subjects.length / this.itemsPerPage) || 1;
        },

        displayedPages() {
            let pages = [];
            for (let i = 1; i <= this.totalPages; i++) {
                pages.push(i);
            }
            return pages;
        },

        coIdToCode: function () {
            var m = {}
            ;(this.courseOutcomes || []).forEach(function (co) {
                m[co.co_id] = co.co_code
            })
            return m
        },

        typeIdToCode: function () {
            var m = {}
            ;(this.assessmentTypes || []).forEach(function (t) {
                m[t.type_id] = t.code
            })
            return m
        },

        coOrderMap: function () {
            var m = {}
            ;(this.courseOutcomes || []).forEach(function (co, idx) {
                m[co.co_code] = idx
            })
            return m
        },

        sortedActivityHeaders: function () {
            if (!this.gradeData.length) return []
            var self = this
            var first = this.gradeData[0]

            var weightMap = {}
            if (first.weighted_ratings) {
                first.weighted_ratings.forEach(function (wr) {
                    weightMap[wr.activity_id] = wr.weight_percentage
                })
            }

            var activities = (first.raw_scores || []).map(function (rs) {
                var co_code = self.coIdToCode[rs.co_id] || 'UNASSIGNED'
                var type_code = self.typeIdToCode[rs.type_id] || ''
                return {
                    activity_id:   rs.activity_id,
                    activity_name: rs.activity_name,
                    co_id:         rs.co_id,
                    co_code:       co_code,
                    type_id:       rs.type_id,
                    type_code:     type_code,
                    max_score:     rs.max_score,
                    weight:        weightMap[rs.activity_id] || 0,
                    coOrder: self.coOrderMap[co_code] !== undefined
                        ? self.coOrderMap[co_code]
                        : 9999,
                }
            })

            activities.sort(function (a, b) {
                if (a.coOrder !== b.coOrder) return a.coOrder - b.coOrder
                return a.activity_id - b.activity_id
            })

            return activities
        },

        // DEDUPLICATED headers for Weighted % tab: unique (CO, Type) combinations
        uniqueWeightedHeaders: function () {
            // For Weighted % tab: group by (co_id, type_id) to avoid duplicate type codes
            // Multiple activities with same type under same CO should show as ONE column
            var self = this
            var seen = {}  // key: co_id + ':' + type_id
            var result = []

            this.sortedActivityHeaders.forEach(function (act) {
                // Skip activities with no weight (deleted from assessment matrix)
                if (act.weight === 0) return

                var key = act.co_id + ':' + act.type_id
                if (!seen[key]) {
                    seen[key] = {
                        co_id: act.co_id,
                        co_code: act.co_code,
                        type_id: act.type_id,
                        type_code: act.type_code,
                        weight: 0,
                        activities: [],  // Store ALL activities in this group
                        coOrder: act.coOrder,
                    }
                    result.push(seen[key])
                }
                // Accumulate weight and activities for this (CO, Type) group
                seen[key].weight += act.weight
                seen[key].activities.push(act.activity_id)
            })

            return result
        },

        filteredActivityHeadersForWeighted: function () {
            // For Weighted % tab: only show activities that have weight > 0
            // This filters out deleted assessments that no longer have weights
            return this.sortedActivityHeaders.filter(function (act) {
                return act.weight > 0
            })
        },

        sortedCoHeaders: function () {
            var self = this
            var seen  = {}
            var result = []

            this.sortedActivityHeaders.forEach(function (act) {
                if (!seen[act.co_code]) {
                    var coIdx = self.coOrderMap[act.co_code]
                    seen[act.co_code] = {
                        co_code: act.co_code,
                        count:   0,
                        weight:  0,
                        color:   self.coColors[coIdx !== undefined ? coIdx % self.coColors.length : result.length % self.coColors.length],
                    }
                    result.push(seen[act.co_code])
                }
                seen[act.co_code].count  += 1
                seen[act.co_code].weight += act.weight
            })

            result.forEach(function (co) {
                co.weight = Math.round(co.weight * 100) / 100
            })

            return result
        },

        filteredCoHeadersForWeighted: function () {
            // For Weighted % tab: build CO headers using deduplicated (CO, Type) groups
            // Each CO header's colspan = count of unique types under that CO
            var self = this
            var seen  = {}
            var result = []

            this.uniqueWeightedHeaders.forEach(function (header) {
                if (!seen[header.co_code]) {
                    var coIdx = self.coOrderMap[header.co_code]
                    seen[header.co_code] = {
                        co_code: header.co_code,
                        count:   0,
                        weight:  0,
                        color:   self.coColors[coIdx !== undefined ? coIdx % self.coColors.length : result.length % self.coColors.length],
                    }
                    result.push(seen[header.co_code])
                }
                seen[header.co_code].count  += 1
                seen[header.co_code].weight += header.weight
            })

            result.forEach(function (co) {
                co.weight = Math.round(co.weight * 100) / 100
            })

            return result
        },

        recordCoResultHeaders: function () {
            if (!this.gradeData.length || !this.gradeData[0].co_results) return []
            var self = this
            var sorted = this.gradeData[0].co_results.slice().sort(function (a, b) {
                var ai = self.coOrderMap[a.co_code] !== undefined ? self.coOrderMap[a.co_code] : 9999
                var bi = self.coOrderMap[b.co_code] !== undefined ? self.coOrderMap[b.co_code] : 9999
                return ai - bi
            })
            return sorted.map(function (cr) {
                var idx = self.coOrderMap[cr.co_code]
                return {
                    co_code: cr.co_code,
                    color:   self.coColors[idx !== undefined ? idx % self.coColors.length : 0],
                }
            })
        },

        filteredRecordData: function () {
            if (!this.searchRecordQuery) return this.gradeData
            var q = this.searchRecordQuery.toLowerCase()
            return this.gradeData.filter(function (r) {
                return r.student_name.toLowerCase().indexOf(q) !== -1 ||
                    (r.studid || '').toLowerCase().indexOf(q) !== -1
            })
        },

        filteredGradingReportSheetData: function () {
            if (!this.searchReportSheetQuery) return this.gradingReportSheetData
            var q = this.searchReportSheetQuery.toLowerCase()
            return this.gradingReportSheetData.filter(function (s) {
                return (s.studid || '').toLowerCase().indexOf(q) !== -1 ||
                    (s.name || '').toLowerCase().indexOf(q) !== -1
            })
        },

        recordPassedCount: function () {
            return this.filteredRecordData.filter(function (r) { return r.remarks === 'PASSED' }).length
        },
        recordFailedCount: function () {
            return this.filteredRecordData.filter(function (r) { return r.remarks === 'FAILED' }).length
        },
        recordIncCount: function () {
            return this.filteredRecordData.filter(function (r) { return r.remarks === 'INC' }).length
        },
        recordPassRate: function () {
            if (!this.filteredRecordData.length) return 0
            return Math.round((this.recordPassedCount / this.filteredRecordData.length) * 100)
        },

        maxGradeReport: function () {
            if (!this.gradingReportSheetData.length) return 0
            var validGrades = this.gradingReportSheetData
                .filter(function (s) { return s.final_grade !== null && s.final_grade !== undefined && s.final_grade !== '' })
                .map(function (s) { return parseFloat(s.final_grade) || 0 })
            return validGrades.length > 0 ? Math.max.apply(null, validGrades) : 0
        },

        minGradeReport: function () {
            if (!this.gradingReportSheetData.length) return 0
            var validGrades = this.gradingReportSheetData
                .filter(function (s) { return s.final_grade !== null && s.final_grade !== undefined && s.final_grade !== '' })
                .map(function (s) { return parseFloat(s.final_grade) || 0 })
            return validGrades.length > 0 ? Math.min.apply(null, validGrades) : 0
        },

        avgGradeReport: function () {
            if (!this.gradingReportSheetData.length) return 0
            var validGrades = this.gradingReportSheetData
                .filter(function (s) { return s.final_grade !== null && s.final_grade !== undefined && s.final_grade !== '' })
                .map(function (s) { return parseFloat(s.final_grade) || 0 })
            if (validGrades.length === 0) return 0
            var total = validGrades.reduce(function (sum, g) { return sum + g }, 0)
            return total / validGrades.length
        },

        passedCountReport: function () {
            return this.gradingReportSheetData.filter(function (s) { 
                return s.final_grade !== null && s.final_grade !== undefined && s.final_grade !== '' && parseFloat(s.final_grade) >= 75 
            }).length
        },

        studentsWithGradesReport: function () {
            return this.gradingReportSheetData.filter(function (s) { 
                return s.final_grade !== null && s.final_grade !== undefined && s.final_grade !== '' 
            }).length
        },
    },

    methods: {

        getRawScore: function (row, activityId) {
            if (!row.raw_scores) return ''
            var entry = row.raw_scores.find(function (rs) {
                return rs.activity_id === activityId
            })
            return entry && entry.score !== null ? entry.score : ''
        },

        getPercentRating: function (row, activityId) {
            if (!row.percent_ratings) return null
            var entry = row.percent_ratings.find(function (pr) {
                return pr.activity_id === activityId
            })
            return entry && entry.percent !== null ? entry.percent : null
        },

        getWeightedRating: function (row, activityId) {
            if (!row.weighted_ratings) return undefined
            var entry = row.weighted_ratings.find(function (wr) {
                return wr.activity_id === activityId
            })
            return entry && entry.weighted_value !== undefined ? entry.weighted_value : undefined
        },

        // Helper: get aggregated weighted score for (CO, Type) group
        getAggregatedWeightedScore: function (row, coId, typeId) {
            if (!row.weighted_ratings) return ''
            var matching = row.weighted_ratings.filter(function (wr) {
                return wr.co_id === coId && wr.type_id === typeId
            })
            if (matching.length === 0) return ''
            // Sum all weighted values for this (CO, Type) group
            var total = matching.reduce(function (sum, wr) {
                return sum + wr.weighted_value
            }, 0)
            return Math.round(total * 100) / 100
        },

        coPassedPercent: function (coCode) {
            if (!this.filteredRecordData.length) return 0
            var passed = this.filteredRecordData.filter(function (row) {
                if (!row.co_results) return false
                var cr = row.co_results.find(function (c) { return c.co_code === coCode })
                return cr && cr.passed
            }).length
            return Math.round((passed / this.filteredRecordData.length) * 100)
        },

        coWeightPercent: function (coCode) {
            var co = this.sortedCoHeaders.find(function (c) { return c.co_code === coCode })
            return co ? co.weight : 0
        },

        sortedCoResults: function (coResults) {
            if (!coResults) return []
            var self = this
            return coResults.slice().sort(function (a, b) {
                var ai = self.coOrderMap[a.co_code] !== undefined ? self.coOrderMap[a.co_code] : 9999
                var bi = self.coOrderMap[b.co_code] !== undefined ? self.coOrderMap[b.co_code] : 9999
                return ai - bi
            })
        },

        getUserInfo: async function () {
            try {
                var res = await this.$axios.get('/auth/user')
                this.user = res.data
            } catch (e) {
                console.error('User not found', e)
            }
        },

        loadClassesFromDatabase: async function () {
            if (!this.selectedYear || !this.selectedSemester) {
                this.$refs.msg.show('Please select Academic Year and Semester.', 'error')
                return
            }
            this.loading = true
            this.currentPage = 1
            this.activeSubject = null
            this.gradeData = []
            this.showClassRecord = false

            try {
                var url = '/masterlist/filter/' + this.selectedYear + '/' + this.selectedSemester
                var res = await this.$axios.get(url)

                if (!res.data || res.data.length === 0) {
                    this.subjects = []
                    this.$refs.msg.show('No classes found.', 'info')
                    this.loading = false
                    return
                }

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
                            chairperson: row.chairperson || '',
                            college_dean: row.college_dean || '',
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

        openGradingSheet: async function (subject) {
            this.loadingGradebook = true
            this.gradeData = []
            this.courseOutcomes = []
            this.assessmentTypes = []

            try {
                await this.fetchAssessmentTypes()
                await this.fetchSyllabusForSubject(subject)
                this.activeSubject = subject
            } catch (e) {
                console.error('Error loading grading sheet:', e)
            } finally {
                this.loadingGradebook = false
            }
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

        fetchSyllabusForSubject: async function (subject) {
            if (!this.user || !subject) {
                this.courseOutcomes = []
                return
            }
            try {
                var empid = this.user.empid
                var subj = encodeURIComponent(subject.subjcode)
                var sect = encodeURIComponent((subject.section || '').trim())
                var url = '/obe/syllabus/' + empid + '/' + subj + '/' + sect
                var res = await this.$axios.get(url)
                var data = res.data
                if (data && data.length > 0) {
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

        fetchSyllabus: async function () {
            await this.fetchSyllabusForSubject(this.activeSubject)
        },

        closeGradingSheet: function () {
            this.activeSubject = null
            this.courseOutcomes = []
            this.gradeData = []
            this.showClassRecord = false
        },

        openClassRecord: async function (tab) {
            this.classRecordActiveTab = tab || 'raw'
            this.showClassRecord = true
            this.searchRecordQuery = ''
            this.loadingRecord = true
            this.gradeData = []

            try {
                var res = await this.$axios.post('/class-activity/compute-grades', {
                    empid:    this.user ? this.user.empid : null,
                    subjcode: this.activeSubject.subjcode,
                    section:  (this.activeSubject.section || '').trim(),
                    sy:       this.selectedYear,
                    sem:      this.selectedSemester,
                })
                this.gradeData = res.data || []
            } catch (e) {
                console.error('Failed to load class record:', e)
                this.gradeData = []
            } finally {
                this.loadingRecord = false
            }
        },

        openGradingReportSheet: function () {
            // Populate grading report sheet data from existing gradeData
            this.gradingReportSheetData = []
            
            if (this.gradeData && this.gradeData.length > 0) {
                var self = this
                var gradebookData = this.gradeData || []
                
                gradebookData.forEach(function (row) {
                    // Backend now includes all required fields:
                    // - final_numerical_grade: The final numerical grade
                    // - student_name: Format "LastName, FirstName"
                    // - course: Student's course/program from masterlist
                    
                    self.gradingReportSheetData.push({
                        studid: row.studid,
                        name: row.student_name || row.studid,
                        course: row.course || 'N/A',
                        final_grade: row.final_numerical_grade || null
                    })
                })
            }
            
            // Show the grading report sheet modal
            this.showGradingReportSheetModal = true
        },

        handleObeSetupSave: async function () {
            this.showObeModal = false
            
            // SMART REFRESH: Clear cached data and intelligently reload
            console.log('[OBE REFRESH] Updating grading sheet and class record after syllabus save')
            this.courseOutcomes = []
            this.assessmentTypes = []
            this.filteredRecordData = []
            
            try {
                // Fetch the new syllabus and assessment types
                await this.fetchSyllabus()
                await this.fetchAssessmentTypes()
                
                // Reload gradebook with new setup
                if (this.$refs.gradingSheet) {
                    console.log('[OBE REFRESH] Reloading gradebook')
                    await this.$refs.gradingSheet.loadGradebook()
                }
                
                // IF class record is open, reload it with new CO structure AND updated weights
                if (this.showClassRecord && this.activeSubject) {
                    console.log('[OBE REFRESH] Class record is open - reloading with new CO structure and weights')
                    this.loadingRecord = true
                    this.gradeData = []  // Clear old data first
                    
                    try {
                        // Reload grade data with new weight percentages
                        var res = await this.$axios.post('/class-activity/compute-grades', {
                            empid:    this.user ? this.user.empid : null,
                            subjcode: this.activeSubject.subjcode,
                            section:  (this.activeSubject.section || '').trim(),
                            sy:       this.selectedYear,
                            sem:      this.selectedSemester,
                        })
                        
                        this.gradeData = res.data || []
                        
                        // Force Vue to recalculate computed properties
                        this.$forceUpdate()
                        
                        console.log('[OBE REFRESH] Class record data reloaded with', this.gradeData.length, 'records')
                        console.log('[OBE REFRESH] Updated weighted data:', this.gradeData.length > 0 ? this.gradeData[0].weighted_ratings : 'none')
                    } catch (e) {
                        console.error('[OBE REFRESH] Error reloading class record:', e)
                        this.gradeData = []
                    } finally {
                        this.loadingRecord = false
                    }
                }
                
                this.$refs.msg.show('Syllabus updated! OBE Grading Sheet and Class Record have been refreshed with the new assessment weights.', 'success')
            } catch (e) {
                console.error('Error refreshing after syllabus save:', e)
                this.$refs.msg.show('Syllabus saved but there was an error refreshing. Please reload the grading sheet.', 'warning')
            }
        },

        // ── Print current class record tab ──────────────────────────
        printClassRecord: function () {
            if (!this.activeSubject) {
                alert('Please open a grading sheet first.')
                return
            }

            if (this.classRecordActiveTab !== 'final') {
                alert('Please view the Final Grade tab to print the Outcome-Based Class Record.')
                return
            }

            var self = this
            var subj = this.activeSubject
            var subjcode = subj.subjcode || ''
            var section = subj.section || subj.sect || ''
            var instructor = subj.instructor || ''
            var credits = subj.credit_units || subj.units || '3'
            var sy = this.selectedYear || ''
            var sem = this.selectedSemester || ''
            var students = this.filteredRecordData || []

            // Get CO result headers with pass percentages
            var coHeaders = this.recordCoResultHeaders || []

            // Build student rows with CO data
            var rowsHtml = students.map(function (row, idx) {
                var grade = row.final_numerical_grade ? parseFloat(row.final_numerical_grade).toFixed(2) : ''
                var remarks = row.remarks || ''
                var totalPercent = row.total_weighted_percent || 0
                var txtColor = remarks === 'PASSED' ? '#15803d' : remarks === 'FAILED' ? '#dc2626' : '#111'
                var bgColor = remarks === 'PASSED' ? '#f0fdf4' : remarks === 'FAILED' ? '#fff1f2' : 'transparent'

                var coData = ''
                if (row.co_results) {
                    var sortedCos = row.co_results.slice().sort(function (a, b) {
                        var ai = self.coOrderMap[a.co_code] !== undefined ? self.coOrderMap[a.co_code] : 9999
                        var bi = self.coOrderMap[b.co_code] !== undefined ? self.coOrderMap[b.co_code] : 9999
                        return ai - bi
                    })
                    coData = sortedCos.map(function (cr) {
                        var sumCn = cr.sum_weighted !== undefined ? cr.sum_weighted.toFixed(2) : '0.00'
                        var remarkCn = cr.sum_weighted > 0 ? (cr.passed ? 'PASSED' : 'FAILED') : '-'
                        var remarkColorCn = cr.sum_weighted > 0 && cr.passed ? 'style="color:#15803d;background:#f0fdf4;"' : cr.sum_weighted > 0 ? 'style="color:#dc2626;background:#fff1f2;"' : ''
                        return '<td style="text-align:center;font-size:10px;">' + sumCn + '</td><td ' + remarkColorCn + ' style="text-align:center;font-size:10px;font-weight:bold;">' + remarkCn + '</td>'
                    }).join('')
                }

                return [
                    '<tr>',
                    '<td style="border:1px solid #999;padding:4px;text-align:center;font-size:10px;">' + (idx + 1) + '</td>',
                    '<td style="border:1px solid #999;padding:4px;text-align:left;font-size:10px;">' + (row.student_name || '') + '</td>',
                    '<td style="border:1px solid #999;padding:4px;text-align:center;font-size:10px;font-weight:bold;">' + totalPercent + '</td>',
                    '<td style="border:1px solid #999;padding:4px;text-align:center;font-size:10px;font-weight:bold;">' + grade + '</td>',
                    '<td style="border:1px solid #999;padding:4px;text-align:center;font-weight:bold;color:' + txtColor + ';background:' + bgColor + ';font-size:10px;">' + remarks + '</td>',
                    coData,
                    '</tr>',
                ].join('')
            }).join('')

            // Build CO header colspan rows
            var coHeadersHtml = coHeaders.map(function (co) {
                var percent = self.coWeightPercent(co.co_code)
                var passPercent = self.coPassedPercent(co.co_code)
                return '<th colspan="2" style="border:1px solid #999;padding:4px;background:' + co.color + ';color:white;font-weight:bold;font-size:10px;">' + co.co_code + '<br>(' + percent + '%) Pass: ' + passPercent + '%</th>'
            }).join('')

            var coSubHeadersHtml = coHeaders.map(function () {
                return '<th style="border:1px solid #999;padding:3px;background:#f5f5f5;font-size:9px;font-weight:bold;">Sum %</th><th style="border:1px solid #999;padding:3px;background:#f5f5f5;font-size:9px;font-weight:bold;">REMARKS</th>'
            }).join('')

            var headerImage = '/assets/image/header.png'  // Path to header.png in assets

            var html = [
                '<!DOCTYPE html><html><head><meta charset="UTF-8">',
                '<title>Outcome-Based Class Record — ' + subjcode + ' Sec ' + section + '</title>',
                '<style>',
                'body{font-family:"Arial","Calibri",sans-serif;font-size:11px;color:#000;margin:0.5in 0.3in;}',
                '.header-img{max-width:100%;height:80px;margin-bottom:10px;}',
                '.center{text-align:center;} .bold{font-weight:bold;}',
                'table.info{width:100%;border-collapse:collapse;margin:6px 0;font-size:10px;}',
                'table.info td{padding:2px 4px;vertical-align:top;}',
                'table.grades{width:100%;border-collapse:collapse;margin:8px 0;border:1px solid #999;}',
                'table.grades th{border:1px solid #999;padding:4px;background:#f0f0f0;font-weight:bold;text-align:center;font-size:10px;}',
                'table.grades td{border:1px solid #999;padding:4px;font-size:9px;}',
                'h1{font-size:14px;margin:4px 0;text-align:center;font-weight:bold;}',
                'h2{font-size:11px;margin:3px 0;text-align:center;}',
                '.subtitle{font-size:10px;text-align:center;color:#555;margin:2px 0;}',
                '@page{size:A4;margin:0.5in;}',
                '@media print{body{margin:0;}page-break-after:avoid;}',
                '</style></head><body>',
                '<img src="' + headerImage + '" class="header-img" alt="CSU Header">',
                '<h1>OUTCOME-BASED CLASS RECORD</h1>',
                '<table class="info">',
                '<tr><td style="width:15%;"><b>Course Code:</b></td><td style="width:20%;">' + subjcode + '</td><td style="width:20%;"><b>Course Name:</b></td><td>' + (subj.description || '') + '</td><td style="text-align:right;"><b>School Year:</b></td><td>' + sy + '</td></tr>',
                '<tr><td><b>Credit Units:</b></td><td>' + credits + '</td><td><b>Semester:</b></td><td>' + sem + '</td></tr>',
                '<tr><td><b>Section Code:</b></td><td>' + section + '</td></tr>',
                '</table>',
                '<table class="info" style="margin-top:10px;">',
                '<tr><td style="width:30%;"><b>Prepared & Submitted by:</b></td><td style="width:20%;"></td><td style="width:30%;"><b>Checked by:</b></td><td style="width:20%;"></td><td><b>Noted by:</b></td><td></td></tr>',
                '<tr><td colspan="2" style="height:40px;border-bottom:1px solid #999;"></td><td colspan="2" style="height:40px;border-bottom:1px solid #999;"></td><td colspan="2" style="height:40px;border-bottom:1px solid #999;"></td></tr>',
                '<tr><td style="font-size:9px;"><b>' + instructor + '</b></td><td style="font-size:9px;">Faculty</td><td style="font-size:9px;"></td><td style="font-size:9px;">Chairperson</td><td style="font-size:9px;"></td><td style="font-size:9px;">College Dean</td></tr>',
                '</table>',
                '<h2 style="margin-top:12px;">% of Student Passed</h2>',
                '<table class="grades">',
                '<thead>',
                '<tr><th style="width:5%;">No.</th><th style="width:25%;">Student Name</th><th style="background:#ffcccc;font-weight:bold;">Total</th><th style="background:#ffcccc;font-weight:bold;">Final Numerical Grade</th><th style="background:#ffcccc;font-weight:bold;">REMARKS</th>' + coHeadersHtml + '</tr>',
                '<tr><th colspan="5"></th>' + coSubHeadersHtml + '</tr>',
                '</thead>',
                '<tbody>' + rowsHtml + '</tbody>',
                '</table>',
                '</body></html>',
            ].join('\n')

            var iframe = document.createElement('iframe')
            iframe.id = 'print-frame-' + Date.now()
            iframe.style.display = 'none'
            document.body.appendChild(iframe)

            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document
            iframeDoc.open()
            iframeDoc.write(html)
            iframeDoc.close()

            setTimeout(function () {
                iframe.contentWindow.print()
                setTimeout(function () {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe)
                    }
                }, 500)
            }, 250)
        },

        // ── Report of Rating ─────────────────────────────────────────
        // Prints the official CSU Report of Rating format using gradeData.
        // If gradeData is empty (modal not opened yet), fetches it first.
        printReportOfRating: async function () {
            if (!this.activeSubject) {
                alert('Please open a grading sheet first.')
                return
            }

            // Use already-loaded gradeData; if empty, fetch it now
            var rows = this.gradeData
            if (!rows.length) {
                try {
                    var res = await this.$axios.post('/class-activity/compute-grades', {
                        empid:    this.user ? this.user.empid : null,
                        subjcode: this.activeSubject.subjcode,
                        section:  (this.activeSubject.section || '').trim(),
                        sy:       this.selectedYear,
                        sem:      this.selectedSemester,
                    })
                    rows = res.data || []
                } catch (e) {
                    alert('Could not load grade data. Please compute grades first in the Grading Sheet.')
                    return
                }
            }

            if (!rows.length) {
                alert('No grade data found. Please compute grades first.')
                return
            }

            var subj       = this.activeSubject
            var subjcode   = subj.subjcode  || ''
            var section    = subj.section   || subj.sect || ''
            var instructor = subj.instructor || ''
            var sy         = this.selectedYear     || ''
            var sem        = this.selectedSemester  || ''
            var now        = new Date()
            // Format date as YYYY-MM-DD
            var year = now.getFullYear()
            var month = String(now.getMonth() + 1).padStart(2, '0')
            var day = String(now.getDate()).padStart(2, '0')
            var dateFormatted = year + '-' + month + '-' + day

            // Fetch chairperson and dean from backend roles
            var dean = ''
            var chairperson = ''
            try {
                var employeeRes = await this.$axios.get('/employee')
                var employees = employeeRes.data || []
                
                console.log('Fetched employees:', employees)
                
                // Find dean and chairperson by role (matching exact enum values)
                var deanEmp = employees.find(function (emp) {
                    return emp.role === 'Dean'
                })
                var chairpersonEmp = employees.find(function (emp) {
                    return emp.role === 'Chairperson'
                })
                
                console.log('Dean employee:', deanEmp)
                console.log('Chairperson employee:', chairpersonEmp)
                
                if (deanEmp && deanEmp.firstname && deanEmp.lastname) {
                    dean = (deanEmp.firstname + ' ' + deanEmp.lastname).trim()
                }
                if (chairpersonEmp && chairpersonEmp.firstname && chairpersonEmp.lastname) {
                    chairperson = (chairpersonEmp.firstname + ' ' + chairpersonEmp.lastname).trim()
                }
                
                console.log('Dean name:', dean)
                console.log('Chairperson name:', chairperson)
            } catch (e) {
                console.error('Failed to fetch dean and chairperson:', e)
                dean = ''
                chairperson = ''
            }

            // Build student rows with period in No. column
            var rowsHtml = rows.map(function (row, idx) {
                var grade   = row.final_numerical_grade ? parseFloat(row.final_numerical_grade).toFixed(2) : ''
                var remarks = row.remarks || ''
                var txtColor = remarks === 'PASSED' ? '#15803d' : remarks === 'FAILED' ? '#dc2626' : '#111'
                var bgColor  = remarks === 'PASSED' ? '#f0fdf4' : remarks === 'FAILED' ? '#fff1f2' : 'transparent'
                return [
                    '<tr>',
                    '<td style="border:1px solid #999;padding:6px 8px;text-align:center;font-size:11px;">' + (idx + 1) + '.</td>',
                    '<td style="border:1px solid #999;padding:6px 10px;text-align:left;font-size:11px;">' + (row.student_name || '') + '</td>',
                    '<td style="border:1px solid #999;padding:6px 8px;text-align:center;font-weight:bold;font-size:11px;">' + grade + '</td>',
                    '<td style="border:1px solid #999;padding:6px 8px;text-align:center;font-weight:bold;color:' + txtColor + ';background:' + bgColor + ';font-size:11px;">' + remarks + '</td>',
                    '</tr>',
                ].join('')
            }).join('')

            var credits = subj.credit_units || subj.units || '3'

            var html = [
                '<!DOCTYPE html><html><head><meta charset="UTF-8">',
                '<title>Report of Rating — ' + subjcode + ' Sec ' + section + '</title>',
                '<style>',
                'body{font-family:"Arial","Calibri",sans-serif;font-size:12px;color:#000;margin:0 0.3in 0.3in 0.3in;line-height:1.2;padding:0;}',
                '.center{text-align:center;} .bold{font-weight:bold;} .italic{font-style:italic;}',
                'h1{margin:0;padding:0;}h2{margin:0;padding:0;}',
                'table.info{width:100%;border-collapse:collapse;margin:4px 0 8px 0;font-size:11px;}',
                'table.info td{padding:4px 6px;vertical-align:top;}',
                'table.grades{width:100%;border-collapse:collapse;margin:6px 0;border:1px solid #999;}',
                'table.grades th{border:1px solid #999;padding:6px 8px;background:#f0f0f0;font-weight:bold;text-align:center;font-size:12px;}',
                'table.grades td{border:1px solid #999;padding:6px 8px;font-size:11px;}',
                'table.sigs{width:100%;border-collapse:collapse;margin-top:12px;font-size:11px;}',
                'table.sigs td{padding:0 24px;vertical-align:top;width:50%;border:none;}',
                '.sig-row{margin-bottom:32px;}',
                '.sig-label{font-weight:bold;font-size:11px;margin-bottom:2px;}',
                '.sig-date{font-size:10px;color:#555;text-align:left;}',
                '.sig-line{border-top:1px solid #000;margin-top:16px;height:20px;}',
                '.sig-title{font-size:10px;color:#333;margin-top:2px;text-align:left;}',
                '.nothing{text-align:center;margin:6px 0;font-size:11px;letter-spacing:1px;}',
                '@page{size:8.5in 11in;margin:0.5in 0.3in;}',
                '@media print{',
                '  body{margin:0;}',
                '  @page{margin:0.5in 0.3in;}',
                '}',
                '</style></head><body>',

                // Header
                '<div class="center" style="font-size:13px;">CARAGA STATE UNIVERSITY CABADBARAN CAMPUS</div>',
                '<div class="center" style="font-size:11px;margin-bottom:12px;">T. Curato St. Cabadbaran City</div>',
                '<div class="center bold" style="font-size:13px;letter-spacing:0.5px;margin:2px 0;padding:0;">REPORT OF RATING</div>',

                // Date info - column format
                '<table class="info" style="margin:4px 0 4px 0;width:100%;">',
                '<tr>',
                '<td style="font-size:11px;padding:0 0 2px 0;text-align:center;"><span class="">Date Submitted:</span> ' + dateFormatted + '</td>',
                '</tr>',
                '<tr>',
                '<td style="font-size:11px;padding:0 0 4px 0;text-align:center;"><span class="">Date Printed:</span> ' + dateFormatted + '</td>',
                '</tr>',
                '</table>',

                // Course info table
                '<table class="info" style="margin:4px 0 8px 0;">',
                '<tr>',
                '<td style="width:90px;" class="">Course No.</td>',
                '<td style="width:8px;">:</td>',
                '<td style="width:40%;" class="bold">' + subjcode + '</td>',
                '<td style="width:70px;" class="">Section</td>',
                '<td style="width:8px;">:</td>',
                '<td class="bold">' + section + '</td>',
                '</tr>',
                '<tr>',
                '<td class="">Descriptive Title</td>',
                '<td>:</td>',
                '<td style="width:40%;" class="bold">' + (subj.description || '') + '</td>',
                '<td class="">Schedule</td>',
                '<td>:</td>',
                '<td class="bold">' + (subj.schedule || '') + '</td>',
                '</tr>',
                '<tr>',
                '<td class="">A.Y. & Semester</td>',
                '<td>:</td>',
                '<td class="bold">' + sy + ', ' + sem + ' Semester</td>',
                '<td class="">Unit</td>',
                '<td>:</td>',
                '<td class="bold">' + credits + '</td>',
                '</tr>',
                '</table>',

                // Grade table
                '<table class="grades">',
                '<thead><tr>',
                '<th style="width:40px;text-align:center;">No.</th>',
                '<th style="text-align:left;">Name</th>',
                '<th style="width:70px;text-align:center;">Grade</th>',
                '<th style="width:80px;text-align:center;">Remarks</th>',
                '</tr></thead>',
                '<tbody>' + rowsHtml + '</tbody>',
                '</table>',

                // Nothing follows
                '<div class="nothing">',
                '*****************************NOTHING FOLLOWS*****************************',
                '</div>',

                // Signature block - 2 columns
                '<table class="sigs">',
                '<tr>',
                '<td>',
                '<div class="sig-row">',
                '<div class="sig-label">Prepared by:</div>',
                '<div class="sig-date"><i>SGD</i> ' + dateFormatted + '</div>',
                '<div style="font-weight:bold;font-size:11px;text-decoration:underline;text-transform:uppercase;">' + instructor + '</div>',
                '<div class="sig-title">Instructor/Professor</div>',
                '</div>',
                '<div class="sig-row">',
                '<div class="sig-label">Checked by:</div>',
                '<div class="sig-date"><i>SGD</i> ' + dateFormatted + '</div>',
                '<div style="font-weight:bold;font-size:11px;text-decoration:underline;text-transform:uppercase;">' + chairperson + '</div>',
                '<div class="sig-title">Chairperson</div>',
                '</div>',
                '</td>',
                '<td>',
                '<div class="sig-row">',
                '<div class="sig-label">Approved by:</div>',
                '<div class="sig-date"><i>SGD</i> ' + dateFormatted + '</div>',
                '<div style="font-weight:bold;font-size:11px;text-decoration:underline;text-transform:uppercase;">' + dean + '</div>',
                '<div class="sig-title">Dean</div>',
                '</div>',
                '<div class="sig-row">',
                '<div class="sig-label">Received by:</div>',
                '<div class="sig-date"><i>SGD</i> ' + dateFormatted + '</div>',
                '<div style="font-weight:bold;font-size:11px;text-decoration:underline;">REY D. ODTOJAN, MSIT</div>',
                '<div class="sig-title">University Registrar</div>',
                '</div>',
                '</td>',
                '</tr>',
                '</table>',

                '</body></html>',
            ].join('\n')

            // Create hidden iframe for printing
            var iframe = document.createElement('iframe')
            iframe.id = 'print-frame-' + Date.now()
            iframe.style.display = 'none'
            document.body.appendChild(iframe)

            // Write HTML to iframe and print
            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document
            iframeDoc.open()
            iframeDoc.write(html)
            iframeDoc.close()

            // Wait for iframe to load, then print
            setTimeout(function () {
                iframe.contentWindow.print()
                // Remove iframe after print dialog closes
                setTimeout(function () {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe)
                    }
                }, 500)
            }, 250)
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

@keyframes popInDown {
    0% {
        opacity: 0;
        transform: translateY(-50px) scale(0.95);
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.animate-popInDown {
    animation: popInDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
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
